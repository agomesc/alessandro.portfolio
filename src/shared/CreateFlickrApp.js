import CreateFlickrService from "../shared/CreateFlickrService";

const CreateFlickrApp = () => {
  
  const instance = CreateFlickrService();
  
  const getGallery = async () => {
    try {
      const data = await instance.listarAlbuns();
      const itemData = data.map((album) => ({
        img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_b.jpg`,
        title: album.title._content,
        id: album.id,
        description: album.description._content,
      }));
      return itemData;
    } catch (error) {
      console.error("Erro ao obter galeria:", error);
      return [];
    }
  };

  const getPhotos = async (id) => {
    try {
      const data = await instance.listarFotos(id);
      const itemData = data.map((photo) => ({
        id: photo.id,
        url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
        title: photo.title,
      }));
      return itemData;
    } catch (error) {
      console.error("Erro ao obter fotos:", error);
      return [];
    }
  };

  return {
    getGallery,
    getPhotos,
  };
};

export default CreateFlickrApp;
