import CreateFetchService from './CreateFetchService'
const CreateFlickrService = () => {

	const urlApi = process.env.REACT_APP_FLICKR_API_URL;
	const instance  = CreateFetchService();
	
	const getList = async (userId) => {
		const url = `${urlApi}/flickr/albums/${userId}`;
		const data = await instance.get(url);
		return data;
	};

	const getAlbum = async (userId, photosetId) => {

		if (!userId || !photosetId) {
            throw new Error("userId e photosetId são obrigatórios.");
        }

		const url = `${urlApi}/flickr/albums/${userId}?photosetId=${photosetId}`;
		const data = await instance.get(url);
		return data;
	};

	const getPhotos = async (albumId) => {

		if (!albumId) {
            throw new Error("albumId é obrigatório.");
        }

		const url = `${urlApi}/flickr/photos/${albumId}`;
		const data = await instance.get(url);
		return data;
	};

	const getListcomments = async (photoId) => {

		if (!photoId) {
            throw new Error("photoId é obrigatório.");
        }

		const url = `${urlApi}/flickr/comments/${photoId}`;
		const data = await instance.get(url);
		return data;
	};

	const getLatestPhotos = async (userId) => {

		if (!userId) {
            throw new Error("userId é obrigatório.");
        }

		const url = `${urlApi}/flickr/latest/${userId}`;
		const data = await instance.get(url);
		return data;
	};

	const getInfo = async (id) => {


		if (!id) {
            throw new Error("id é obrigatório.");
        }
		

		const url = `${urlApi}/flickr/info/${id}`
		const data = await instance.get(url);
		return data;
	};

	const getExifInfo = async (id) => {

		
		if (!id) {
            throw new Error("id é obrigatório.");
        }

		const url = `${urlApi}/flickr/exif/${id}`;
		const data = await instance.get(url);
		return data;
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
