import  CreateFetchService from "./CreateFetchService"
const CreateFlickrService = () => {
  
  const fetchService = CreateFetchService();
  
  const listarAlbuns = async () => {
    try {
      const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/albums`;
      const data = await fetchService.get(url);
      return data.photosets.photoset;
    } catch (error) {
      console.error("Erro ao listar álbuns:", error);
      return [];
    }
  };

  const listarFotos = async (id) => {
    try {
      const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/photos/${id}`;
      const data = await fetchService.get(url);
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
