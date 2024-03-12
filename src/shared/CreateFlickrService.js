const CreateFlickrService = () => {
  const listarAlbuns = async () => {
    try {
      const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/albums`;
      const response = await fetch(url);
      const data = await response.json();
      return data.photosets.photoset;
    } catch (error) {
      console.error("Erro ao listar álbuns:", error);
      return [];
    }
  };

  const listarFotos = async (id) => {
    try {
      const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/photos/${id}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.photoset.photo;
    } catch (error) {
      console.error("Erro ao listar fotos:", error);
      return [];
    }
  };

  return {
    listarAlbuns,
    listarFotos,
  };
};

export default CreateFlickrService;
