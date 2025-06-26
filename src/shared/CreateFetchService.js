const CreateFetchService = () => {
    let lastRequestTime = 0;
    const observers = new Set();
    // Default cache duration: 5 minutes (in milliseconds)
    const DEFAULT_CACHE_DURATION = 20 * 60 * 1000; 

    function subscribe(observer) {
        observers.add(observer);
    }

    function unsubscribe(observer) {
        observers.delete(observer);
    }

    function notify(event, data) {
        observers.forEach(observer => observer(event, data));
    }

    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchWithInterceptor(url, options = {}) {
        try {
            const currentTime = Date.now();
            const timeSinceLastRequest = currentTime - lastRequestTime;
            const delayTime = Math.max(0, 5000 - timeSinceLastRequest);

            if (delayTime > 0) {
                await delay(delayTime);
            }

            lastRequestTime = Date.now();
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(TryError(response.status));
            }

            const data = await response.json();
            notify("success", { url, options, data });
            return data;
        } catch (error) {
            notify("error", { url, options, error: error.message });
            throw new Error(`Erro na requisição: ${error.message}`);
        }
    }

    async function get(url, cacheOptions = {}) {
        if (!navigator.onLine) {
            throw new Error(TryError(521)); // Offline error
        }

        const { useCache = true, cacheDuration = DEFAULT_CACHE_DURATION } = cacheOptions;
        const cacheKey = `fetch_cache_${url}`;
        const now = Date.now();

        if (useCache) {
            try {
                const cachedData = sessionStorage.getItem(cacheKey);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    if (now - timestamp < cacheDuration) {
                        notify("cache-hit", { url, data });
                        return data; // Return cached data if fresh
                    } else {
                        sessionStorage.removeItem(cacheKey); // Remove stale data
                    }
                }
            } catch (e) {
                sessionStorage.removeItem(cacheKey); // Clear corrupted cache entry
            }
        }

        // If no cached data, or cache is stale/disabled, perform actual fetch
        const response = await fetchWithInterceptor(url);

        if (useCache) {
            try {
                // Store the response with a timestamp
                sessionStorage.setItem(cacheKey, JSON.stringify({ data: response, timestamp: now }));
            } catch (e) {
                  throw new Error(TryError(e.status)); 
            }
        }

        return response;
    }

    async function post(url, data) {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache", // Important for POST requests
                "Connection": "keep-alive"
            },
            body: JSON.stringify(data)
        };

        const response = await fetchWithInterceptor(url, options);
        return response;
    }

    return { get, post, subscribe, unsubscribe };
};

function TryError(code) {
    const errors = {
        201: "A solicitação foi bem-sucedida, mas o servidor criou um novo recurso.",
        202: "O servidor aceitou a solicitação, mas não a processou a tempo.",
        203: "O servidor processou a solicitação com sucesso, mas está retornando informações de outra fonte.",
        204: "O servidor processou a solicitação com sucesso, mas não está retornando conteúdo.",
        205: "O servidor processou a solicitação com sucesso, mas o conteúdo foi redefinido.",
        206: "O servidor processou uma solicitação parcial.",
        400: "O servidor não entendeu a solicitação.",
        401: "Não autorizado.",
        403: "O servidor recusou a solicitação.",
        404: "O servidor não encontrou a página solicitada.",
        405: "Método não permitido.",
        408: "O servidor expirou ao esperar pela solicitação.",
        500: "Erro interno do servidor.",
        501: "O servidor não tem a funcionalidade necessária para completar a solicitação.",
        503: "O servidor está indisponível.",
        521: "Offline."
    };
    return errors[code] || "Erro desconhecido.";
}

export default CreateFetchService;