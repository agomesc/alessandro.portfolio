const CreateFetchService = () => {
	async function fetchWithInterceptor(url, options = {}) {
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(TryError(response.status));
			}
			return await response.json();
		} catch (error) {
			throw new Error(`Erro na requisição: ${error.message}`);
		}
	}

	async function get(url) {
		if (!navigator.onLine) {
			throw new Error(TryError(521));
		}
		return await fetchWithInterceptor(url);
	}

	async function post(url, data) {
		const cacheKey = `${url}-${JSON.stringify(data)}`;
		const cachedResponse = getCache(cacheKey);
		if (cachedResponse) {
			return cachedResponse;
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
		setCache(cacheKey, response);
		return response;
	}

	return { get, post };
}

function setCache(key, data) {
	const cacheData = {
		timestamp: Date.now(),
		data
	};
	sessionStorage.setItem(key, JSON.stringify(cacheData));
}

function getCache(key) {
	const cachedResponse = sessionStorage.getItem(key);
	if (cachedResponse) {
		const { timestamp, data } = JSON.parse(cachedResponse);
		const cacheDuration = 5 * 60 * 1000; // 5 minutos
		if (Date.now() - timestamp < cacheDuration) {
			return data;
		}
		sessionStorage.removeItem(key);
	}
	return null;
}

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
