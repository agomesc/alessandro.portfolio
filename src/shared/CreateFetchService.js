function CreateFetchService() {
	async function fetchWithInterceptor(url, options) {
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(
					`Erro na requisição: ${response.status} ${response.statusText}`
				);
			}
			return response.json();
		} catch (error) {
			throw new Error(TryError(error.status));
		}
	}

	async function get(url) {
		return fetchWithInterceptor(url);
	}

	async function post(url, data) {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};
		return fetchWithInterceptor(url, options);
	}
	return {
		get,
		post,
	};
}

function TryError(status) {
	switch (status) {
		case 201:
			return "A solicitação foi bem-sucedida, mas, o servidor criou um novo recurso.";
		case 202:
			return "O servidor aceitou a solicitação, mas não a processou a tempos.";
		case 203:
			return "O servidor processou a solicitação com sucesso, mas está retornando informações que podem ser de outra fonte.";
		case 204:
			return "O servidor processou a solicitação com sucesso, mas não está retornando conteúdo algum.";
		case 205:
			return "O servidor processou a solicitação com sucesso, mas não está retornando conteúdo algum porque o conteúdo está sendo redefinido.";
		case 206:
			return "O servidor processou uma solicitação parcialmente.";
		case 400:
			return "O servidor não entendeu o código da solicitação.";
		case 401:
			return "Não Autorizado.";
		case 403:
			return "O servidor recusou a solicitação.";
		case 404:
			return "O servidor não encontrou a página solicitada.";
		case 405:
			return "MethodNotAllowed.";
		case 408:
			return "O servidor expirou ao esperar pela solicitação.";
		case 500:
			return "Erro 500 (Erro interno do servidor).";
		case 501:
			return "O servidor não tem a funcionalidade necessária para completar a solicitação.";
		case 503:
			return "O servidor está indisponível.";
		default:
			return "O servidor está indisponível.";
	}
}

// Fazendo uma requisição GET
// fetchService.get('https://jsonplaceholder.typicode.com/todos/1')
//   .then(data => console.log('Dados recebidos:', data))
//   .catch(error => console.error('Erro:', error));

// // Fazendo uma requisição POST
// const postData = { title: 'Novo Post', body: 'Conteúdo do post' };
// fetchService.post('https://jsonplaceholder.typicode.com/posts', postData)
//   .then(data => console.log('Post criado:', data))
//   .catch(error => console.error('Erro:', error));

export default CreateFetchService;
