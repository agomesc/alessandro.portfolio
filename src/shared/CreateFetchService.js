// src/services/fetchService.js

let fetchServiceInstance = null;

const CreateFetchService = () => {
    if (fetchServiceInstance) return fetchServiceInstance;

    let lastRequestTime = 0;
    const observers = new Set();
    const DEFAULT_CACHE_DURATION = 20 * 60 * 1000; // 20 minutos

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
            const delayTime = Math.max(0, 5000 - timeSinceLastRequest); // 5 segundos de delay

            if (delayTime > 0) {
                console.log(`Aguardando ${delayTime / 1000}s antes da requisição para ${url}...`);
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
            console.error(`Erro na requisição ${url}:`, error);
            throw new Error(`Erro na requisição: ${error.message}`);
        }
    }

    async function get(url, cacheOptions = {}) {
        if (!navigator.onLine) {
            notify("error", { url, error: TryError(521) });
            throw new Error(TryError(521));
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
                        console.log(`[CACHE HIT] Retornando do cache para: ${url}`);
                        return data;
                    } else {
                        console.log(`[CACHE EXPIRADO] Removendo cache para: ${url}`);
                        sessionStorage.removeItem(cacheKey);
                    }
                }
            } catch (e) {
                console.error(`[ERRO CACHE] Falha ao ler ou parsear cache para ${url}:`, e);
                sessionStorage.removeItem(cacheKey);
            }
        }

        const response = await fetchWithInterceptor(url);

        if (useCache) {
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify({ data: response, timestamp: now }));
                console.log(`[CACHE SET] Armazenando no cache para: ${url}`);
            } catch (e) {
                console.error(`[ERRO CACHE] Falha ao armazenar cache para ${url}:`, e);
                throw new Error(TryError(500));
            }
        }

        return response;
    }

    async function post(url, data) {
        if (!navigator.onLine) {
            notify("error", { url, error: TryError(521) });
            throw new Error(TryError(521));
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            },
            body: JSON.stringify(data)
        };

        const response = await fetchWithInterceptor(url, options);
        return response;
    }

    fetchServiceInstance = { get, post, subscribe, unsubscribe };
    return fetchServiceInstance;
};

function TryError(code) {
    const errors = {
        201: "A solicitação foi bem-sucedida, mas o servidor criou um novo recurso.",
        202: "O servidor aceitou a solicitação, mas não a processou a tempo.",
        203: "O servidor processou a solicitação com sucesso, mas está retornando informações de outra fonte.",
        204: "O servidor processou a solicitação com sucesso, mas não está retornando conteúdo.",
        205: "O servidor processou a solicitação com sucesso, mas o conteúdo foi redefinido.",
        206: "O servidor processou uma solicitação parcial.",
        400: "O servidor não entendeu a solicitação. Verifique os dados enviados.",
        401: "Não autorizado. Credenciais inválidas ou ausentes.",
        403: "O servidor recusou a solicitação. Você não tem permissão.",
        404: "O servidor não encontrou a página solicitada.",
        405: "Método não permitido para esta URL.",
        408: "O servidor expirou ao esperar pela solicitação.",
        500: "Erro interno do servidor. Tente novamente mais tarde.",
        501: "O servidor não tem a funcionalidade necessária para completar a solicitação.",
        503: "O servidor está indisponível. Tente novamente mais tarde.",
        521: "Você está offline. Verifique sua conexão com a internet."
    };
    return errors[code] || `Erro desconhecido. Código: ${code}`;
}

export default CreateFetchService;
