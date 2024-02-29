import FlickrService from "../shared/FlickrService";

class FlickrApp extends FlickrService {
  constructor(apiKey) {
    super(apiKey);
    this.apiKey = apiKey;
  }

  async GetGallery() {
    var flickrService = new FlickrService(this.apiKey);
    var data = await flickrService.listarAlbuns("186526131@N04");
    var itemData = [];
    data.forEach(function (album) {
      itemData.push({
        img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_b.jpg`,
        title: album.title._content,
        id: album.id,
      });
    });
    return itemData;
  }
}

export default FlickrApp;