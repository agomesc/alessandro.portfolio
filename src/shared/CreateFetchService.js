// Factory function para criar um objeto com métodos para chamadas fetch
function CreateFetchService() {
  // Função para interceptar e tratar erros
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
      console.error("Erro na requisição:", error);
      throw error;
    }
  }

  // Método para fazer uma requisição GET
  async function get(url) {
    return fetchWithInterceptor(url);
  }

  // Método para fazer uma requisição POST
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

  // Retorne os métodos que desejar usar
  return {
    get,
    post,
    // Adicione outros métodos conforme necessário
  };
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
