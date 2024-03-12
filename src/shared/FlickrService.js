class FlickrService {
  
  listarAlbuns = async () => {
    const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/albums`;
    const response = await fetch(url);
    const data = await response.json();
    return data.photosets.photoset;
  };

  listarFotos = async (id) => {
    const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/photos/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    // Retornar a lista de fotos
    return data.photoset.photo;
  };

  listarComentarios = async (photoId) => {
    // Construir a URL da API do Flickr para mostrar os comentários de uma foto
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=${this.apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
    // Fazer uma requisição HTTP GET para a URL e obter a resposta
    const response = await fetch(url);
    // Converter a resposta em um objeto JSON
    const data = await response.json();
    // Retornar a lista de comentários

    return data.comments.comment;
  };

  listarUltimasFotos = async () => {
    // Construir a URL da API do Flickr para listar as últimas fotos postadas
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${this.apiKey}&format=json&nojsoncallback=1`;
    // Fazer uma requisição HTTP GET para a URL e obter a resposta
    const response = await fetch(url);
    // Converter a resposta em um objeto JSON
    const data = await response.json();
    // Retornar a lista de fotos
    return data.photos.photo;
  };
}

export default FlickrService;
