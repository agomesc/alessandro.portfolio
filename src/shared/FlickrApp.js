import FlickrService from "../shared/FlickrService";

class FlickrApp extends FlickrService {
  constructor(apiKey) {
    super(apiKey);
    this.apiKey = apiKey;
  }

  GetGallery = async () => {
    var flickrService = new FlickrService(this.apiKey);
    var data = await flickrService.listarAlbuns("186526131@N04");
    var itemData = [];
    data.forEach(function (album) {
      
      itemData.push({
        img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_b.jpg`,
        title: album.title._content,
        id: album.id,
        description: album.description._content
      });
    });
    return itemData;
  };

  GetPhotos = async (albumId) => {
    let flickrService = new FlickrService(this.apiKey);
    let data = await flickrService.listarFotos(albumId);
    let itemData = [];
    data.forEach(function (photo) {
      let src = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
      itemData.push({ id: photo.id, url: src, title: photo.title });
    });

    return itemData;
  };
}
export default FlickrApp;
