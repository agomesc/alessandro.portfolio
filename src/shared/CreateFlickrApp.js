//https://www.flickr.com/services/api/flickr.photos.getSizes.html
const CreateFlickrApp = () => {

	const getGallery = async () => {
		try {
			const response = await fetch('/getList');
			const data = await response.json();
			const itemData = data.photosets.photoset.map((album) => ({
				img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_z.jpg`,
				title: album.title._content,
				id: album.id,
				description: album.description._content,
			}));
			return itemData;
		} catch (error) {
			console.error('Erro ao carregar a galeria: ', error);
			return [];
		}
	};

	const getPhotos = async (albumId) => {
		try {
			const response = await fetch(`/getPhotos/${albumId}`);
			const data = await response.json();

			console.log('data ', data);

			const itemData = data.photoset.photo.map((photo) => ({
				url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`,
				title: photo.title,
				id: photo.id,
			}));
			return itemData;
		} catch (error) {
			console.error('Erro ao carregar as fotos: ', error);
			return [];
		}
	};

	const getLatestPhotos = async () => {
		try {
			const response = await fetch('/getLatestPhotos');
			const data = await response.json();

			console.log('data ', data);

			if (data.photos && data.photos.photo) {
				const itemData = data.photos.photo.map((photo) => ({
					img: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`,
					title: photo.title,
					id: photo.id,
				}));
				return itemData;
			} else {
				throw new Error('Formato inesperado da resposta');
			}
		} catch (error) {
			console.error('Erro ao carregar as últimas fotos: ', error.message);
			return [];
		}
	};


	const getPhotoInfo = async (id) => {
		try {
			const response = await fetch(`/getInfo/${id}`);
			const data = await response.json();

			console.log('Informações da Foto: ', data);

			const itemData = {
				id: data.photo.id,
				url: `https://farm${data.photo.farm}.staticflickr.com/${data.photo.server}/${data.photo.id}_${data.photo.secret}_n.jpg`,
				description: data.photo.description._content,
				location: data.photo.owner.location,
				title: data.photo.title._content,
				taken: data.photo.dates.taken,
				photopage: data.photo.urls.url[0]._content,
				views: data.photo.views
			};

			return itemData;
		} catch (error) {
			console.error('Erro ao obter as informações da foto: ', error.message);
			return null;
		}
	};

	return {
		getGallery,
		getPhotos,
		getLatestPhotos,
		getPhotoInfo
	};
};

export default CreateFlickrApp;
