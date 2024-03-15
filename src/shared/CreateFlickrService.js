import CreateFetchService from "./CreateFetchService";
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

	const listarFotosRecentes = async (id) => {
		const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/latest-photos`;
		const data = await fetchService.get(url);
		return data.photos.photo;
	};

	const listarInformacoes = async (id) => {
		
		const url = `https://portfolio-api-flickr.netlify.app/.netlify/functions/api/photo-info/${id}`;
		const data = await fetchService.get(url);

		return data.photo;
};

	return {
		listarAlbuns,
		listarFotos,
		listarFotosRecentes,
		listarInformacoes
	};
};

export default CreateFlickrService;
