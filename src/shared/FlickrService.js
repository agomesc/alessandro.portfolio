class FlickrService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  listarAlbuns = async (userId) => {
    // Construir a URL da API do Flickr para listar os álbuns de um usuário
    const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${this.apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
    // Fazer uma requisição HTTP GET para a URL e obter a resposta
    const response = await fetch(url);
    // Converter a resposta em um objeto JSON
    const data = await response.json();
    // Retornar a lista de álbuns
    return data.photosets.photoset;
  };

  listarFotos = async (albumId) => {
    // Construir a URL da API do Flickr para listar as fotos de um álbum
    const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${this.apiKey}&photoset_id=${albumId}&format=json&nojsoncallback=1`;
    // Fazer uma requisição HTTP GET para a URL e obter a resposta
    const response = await fetch(url);
    // Converter a resposta em um objeto JSON
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
