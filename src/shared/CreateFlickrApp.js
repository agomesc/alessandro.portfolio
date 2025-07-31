import CreateFlickrService from "./CreateFlickrService";

// https://www.flickr.com/services/api/flickr.photos.getSizes.html
const CreateFlickrApp = () => {
	const userID = process.env.REACT_APP_USER_ID;
	const userwORKID = process.env.REACT_APP_USER_WORK_ID;
	const instance = CreateFlickrService();

	const getGallery = async () => {
		const data = await instance.getList(userID);
		return data.map((album) => ({
			img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_b.jpg`,
			title: album.title._content,
			id: album.id,
			description: album.description._content,
		}));
	};

	const getGallerySmall = async () => {
		const data = await instance.getList(userID);
		return data.map((album) => ({
			img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}.jpg`,
			title: album.title._content,
			id: album.id,
			description: album.description._content,
		}));
	};

	const getAlbum = async (photosetId) => {
		return await instance.getAlbum(userID, photosetId);
	};

	const getGalleryWork = async () => {
		const data = await instance.getList(userwORKID);
		return data.map((album) => ({
			img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}.jpg`,
			title: album.title._content,
			id: album.id,
			description: album.description._content,
		}));
	};

	const getPhotos = async (id) => {
		const data = await instance.getPhotos(id);
		return data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
			title: photo.title,
		}));
	};

	const getPhotosOriginal = async (id) => {
		const data = await instance.getPhotos(id);
		return data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_o.jpg`,
			title: photo.title,
		}));
	};

	const getLatestPhotos = async () => {
		const data = await instance.getLatestPhotos(userID);
		return data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`,
			title: photo.title,
		}));
	};

	const getLatestPhotosWork = async () => {
		const data = await instance.getLatestPhotos(userwORKID);
		return data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`,
			title: photo.title,
		}));
	};

	const getLatestPhotosLargeSquare = async () => {
		const data = await instance.getLatestPhotos(userID);
		return data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`,
			title: photo.title,
		}));
	};

	const getLatestPhotosLargeSquarelWork = async () => {
		const data = await instance.getLatestPhotos(userwORKID);
		return data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`,
			title: photo.title,
		}));
	};

	const getLatestPhotosMedium = async () => {
		const data = await instance.getLatestPhotos(userID);
		return data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_n.jpg`,
			title: photo.title,
		}));
	};

	const getPhotoBasicInfo = async (id) => {
		const data = await instance.getInfo(id);

		return {
			id: data.id,
			url: `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_b.jpg`,
			description: data.description._content,
			location: data.owner.location,
			title: data.title._content,
			taken: data.dates.taken,
			photopage: data.urls.url[0]._content,
			views: data?.views,
		};
	};

	const getPhotoExifInfo = async (id) => {
		const exifData = await instance.getExifInfo(id);

		return {
			camera: exifData?.camera,
			lens: exifData.exif.find(exif => exif.tag === 'LensInfo')?.raw._content,
			range: exifData.exif.find(exif => exif.tag === 'FocalLength')?.raw._content,
			colorSpace: exifData.exif.find(exif => exif.tag === 'ColorSpace')?.raw._content,
			iso: exifData.exif.find(exif => exif.tag === 'ISO')?.raw._content,
			exposure: exifData.exif.find(exif => exif.tag === 'ExposureTime')?.raw._content,
			focal: exifData.exif.find(exif => exif.tag === 'FocalLength')?.raw._content,
			aperture: exifData.exif.find(exif => exif.tag === 'FNumber')?.clean._content,
		};
	};

	const getPhotosGroupedByYear = async () => {
		const data = await instance.getPhotosGroupedByYear(userID);

		// Aqui mantemos a estrutura original do backend, mas se quiser
		// pode transformar os dados (ex: ordenar os anos, etc)
		return Object.entries(data)
			.sort(([a], [b]) => b - a) // ordena anos decrescentes
			.map(([year, photos]) => ({
				year,
				photos: photos.map(photo => ({
					id: photo.id,
					title: photo.title,
					date: photo.date,
					url: photo.url,
				}))
			}));
	};


	return {
		getGallery,
		getGallerySmall,
		getAlbum,
		getGalleryWork,
		getPhotos,
		getPhotosOriginal,
		getLatestPhotos,
		getLatestPhotosWork,
		getLatestPhotosLargeSquare,
		getLatestPhotosLargeSquarelWork,
		getLatestPhotosMedium,
		getPhotoBasicInfo,
		getPhotoExifInfo,
		getPhotosGroupedByYear 
	};
};

export default CreateFlickrApp;
