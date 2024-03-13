import  CreateFetchService from "./CreateFetchService"
const CreateFlickrService = () => {
  
  const fetchService = CreateFetchService();
  
  const listarAlbuns = async () => {
      const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/albums`;
      const data = await fetchService.get(url);
      return data.photosets.photoset;
  };

  const listarFotos = async (id) => {
    
      const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/photos/${id}`;
      const data = await fetchService.get(url);
      return data.photoset.photo;
  };

  return {
    listarAlbuns,
    listarFotos,
  };
};

export default CreateFlickrService;
