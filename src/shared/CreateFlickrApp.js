import CreateFlickrService from "../shared/CreateFlickrService";
//https://www.flickr.com/services/api/flickr.photos.getSizes.html
const CreateFlickrApp = () => {
	
	const instance = CreateFlickrService();

	const getGallery = async () => {
			const data = await instance.listarAlbuns();
			const itemData = data.map((album) => ({
				img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_z.jpg`,
				title: album.title._content,
				id: album.id,
				description: album.description._content,
			}));
			return itemData;
	};

	const getPhotos = async (id) => {
		
			const data = await instance.listarFotos(id);
			const itemData = data.map((photo) => ({
				id: photo.id,
				url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
				title: photo.title,
			}));
			return itemData;
	};

	const getLatestPhotos = async () => {
		const data = await instance.listarFotosRecentes();
		const itemData = data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_n.jpg`,
			title: photo.title,
		}));
		return itemData;
};

	return {
		getGallery,
		getPhotos,
		getLatestPhotos
	};
};

export default CreateFlickrApp;
