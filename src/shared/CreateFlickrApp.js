import CreateFlickrService from "../shared/CreateFlickrService";

//https://www.flickr.com/services/api/flickr.photos.getSizes.html
const CreateFlickrApp = () => {
	
	const userID = process.env.REACT_APP_USER_ID;
	const userwORKID = process.env.REACT_APP_USER_WORK_ID;

	const instance = CreateFlickrService();
	const isMobile = window.innerWidth <= 768;
	const sizeSuffix = isMobile ? '_c.jpg' : '_b.jpg'; 

	const getGallery = async () => {
		const data = await instance.getList(userID);
		const itemData = data.map((album) => ({
			img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}${sizeSuffix}`,
			title: album.title._content,
			id: album.id,
			description: album.description._content,
		}));
		return itemData;
	};

	const getGallerySmall = async () => {
		const data = await instance.getList(userID);
		const itemData = data.map((album) => ({
			img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_n.jpg`,
			title: album.title._content,
			id: album.id,
			description: album.description._content,
		}));
		return itemData;
	};

	const getAlbum = async (photosetId) => {
		const data = await instance.getAlbum(userID , photosetId);
		return data;
	};

	const getGalleryWork = async () => {
		const data = await instance.getList(userwORKID);
		const itemData = data.map((album) => ({
			img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}${sizeSuffix}`,
			title: album.title._content,
			id: album.id,
			description: album.description._content,
		}));
		return itemData;
	};

	const getPhotos = async (id) => {
		const data = await instance.getPhotos(id);
		const itemData = data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}${sizeSuffix}`,
			title: photo.title,
		}));
		return itemData;
	};

	const getPhotosLarge = async (id) => {
		const data = await instance.getPhotos(id);
		const itemData = data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
			title: photo.title,
		}));
		return itemData;
	};

	const getLatestPhotos = async () => {
		const data = await instance.getLatestPhotos(userID);
		const itemData = data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}${sizeSuffix}`,
			title: photo.title,
		}));
		return itemData;
	};

	const getLatestPhotosThumbnail = async () => {
		const data = await instance.getLatestPhotos(userID);
		const itemData = data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`,
			title: photo.title,
		}));
		return itemData;
	};

	const getLatestPhotosThumbnailWork = async () => {
		const data = await instance.getLatestPhotos(userwORKID);
		const itemData = data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`,
			title: photo.title,
		}));
		return itemData;
	};

	const getLatestPhotosMedium = async () => {
		const data = await instance.getLatestPhotos(userID);
		const itemData = data.map((photo) => ({
			id: photo.id,
			url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`,
			title: photo.title,
		}));
		return itemData;
	};

	const getPhotoInfo = async (id) => {
		const data = await instance.getInfo(id);
		const exifData = await instance.getExifInfo(id);

		const itemData = {
			id: data.id,
			url: `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}${sizeSuffix}`,
			description: data.description._content,
			location: data.owner.location,
			title: data.title._content,
			taken: data.dates.taken,
			photopage: data.urls.url[0]._content,
			views: data?.views,
			camera: exifData?.camera,
			lens: exifData.exif.find(exif => exif.tag === 'LensInfo')?.raw._content,
			range: exifData.exif.find(exif => exif.tag === 'FocalLength')?.raw._content,
			colorSpace: exifData.exif.find(exif => exif.tag === 'ColorSpace')?.raw._content,
			iso: exifData.exif.find(exif => exif.tag === 'ISO')?.raw._content,
			exposure: exifData.exif.find(exif => exif.tag === 'ExposureTime')?.raw._content,
			focal: exifData.exif.find(exif => exif.tag === 'FocalLength')?.raw._content,
			aperture: exifData.exif.find(exif => exif.tag === 'FNumber')?.clean._content
		};
	
		return itemData;
	};
	
	return {
		getGallery,
		getGallerySmall,
		getAlbum,
		getGalleryWork,
		getPhotos,
		getPhotosLarge,
		getLatestPhotos,
		getLatestPhotosThumbnail,
		getLatestPhotosThumbnailWork,
		getLatestPhotosMedium,
		getPhotoInfo
	};
};

export default CreateFlickrApp;
