const CreateFlickrService = () => {

	const apiKey = process.env.REACT_APP_FLICKR_API_KEY;

	const getList = async (userId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
		const response = await fetch(url);
		const data = await response.json();
		return data.photosets.photoset;
	};

	const getPhotos = async (albumId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&photoset_id=${albumId}&format=json&nojsoncallback=1`;
		const response = await fetch(url);
		const data = await response.json();
		return data.photoset.photo;
	};

	const getListcomments = async (photoId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
		const response = await fetch(url);
		const data = await response.json();
		return data.comments.comment;
	};

	const getLatestPhotos = async (userId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`
		const response = await fetch(url);
		const data = await response.json();
		return data.photos.photo;
	};

	const getInfo = async (id) => {

		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${id}&format=json&nojsoncallback=1`
		const response = await fetch(url);
		const data = await response.json();
		return data.photo;
	};

	return {
		getList,
		getPhotos,
		getListcomments,
		getLatestPhotos,
		getInfo
	};
};

export default CreateFlickrService;
