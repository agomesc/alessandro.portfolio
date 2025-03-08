import CreateFetchService from './CreateFetchService'
const CreateFlickrService = () => {

	const apiKey = process.env.REACT_APP_FLICKR_API_KEY;
	const instance  = CreateFetchService();

	const getList = async (userId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
		const data = await instance.get(url);
		return data.photosets.photoset;
	};

	const getAlbum = async (userId, photosetId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getInfo&api_key=${apiKey}&photoset_id=${photosetId}&user_id=${userId}&format=json&nojsoncallback=1`;
		const data = await instance.get(url);
		return data.photoset;
	};

	const getPhotos = async (albumId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&photoset_id=${albumId}&format=json&nojsoncallback=1`;
		const data = await instance.get(url);
		return data.photoset.photo;
	};

	const getListcomments = async (photoId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
		const data = await instance.get(url);
		return data.comments.comment;
	};

	const getLatestPhotos = async (userId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
		const data = await instance.get(url);
		return data.photos.photo.slice(0, 20); // Limita os resultados às últimas 10 fotos
	};

	const getInfo = async (id) => {

		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${id}&format=json&nojsoncallback=1`
		const data = await instance.get(url);
		return data.photo;
	};

	const getExifInfo = async (id) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getExif&api_key=${apiKey}&photo_id=${id}&format=json&nojsoncallback=1`;
		const data = await instance.get(url);
		return data.photo;
	};
	
	return {
		getList,
		getAlbum,
		getPhotos,
		getListcomments,
		getLatestPhotos,
		getInfo,
		getExifInfo
	};
};

export default CreateFlickrService;
