const CreateFlickrService = (apiKey) => {
	const listarAlbuns = async (userId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
		const response = await fetch(url);
		const data = await response.json();
		return data.photosets.photoset;
	};

	const listarFotos = async (albumId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&photoset_id=${albumId}&format=json&nojsoncallback=1`;
		const response = await fetch(url);
		const data = await response.json();
		return data.photoset.photo;
	};

	const listarComentarios = async (photoId) => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
		const response = await fetch(url);
		const data = await response.json();
		return data.comments.comment;
	};

	const listarUltimasFotos = async () => {
		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${apiKey}&format=json&nojsoncallback=1`;
		const response = await fetch(url);
		const data = await response.json();
		return data.photos.photo;
	};

	const listarInformacoes = async (id) => {

		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${id}&format=json&nojsoncallback=1`
		const response = await fetch(url);
		const data = await response.json();
		return data.photo;
	};

	return {
		listarAlbuns,
		listarFotos,
		listarComentarios,
		listarUltimasFotos,
		listarInformacoes
	};
};

export default CreateFlickrService;
