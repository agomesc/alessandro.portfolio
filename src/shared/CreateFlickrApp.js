import CreateFlickrService from "../shared/CreateFlickrService";
//https://www.flickr.com/services/api/flickr.photos.getSizes.html
const CreateFlickrApp = () => {

    const userID = process.env.REACT_APP_USER_ID;
    const userwORKID = process.env.REACT_APP_USER_WORK_ID;

    const instance = CreateFlickrService();

    const getGallery = async () => {
        try {
            const data = await instance.getList(userID);
            const itemData = data.map((album) => ({
                img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_z.jpg`,
                title: album.title._content,
                id: album.id,
                description: album.description._content,
            }));
            return itemData;
        } catch (error) {
            console.error("Error fetching gallery:", error);
            throw error; // você pode lançar o erro novamente ou tratar de outra forma
        }
    };

    const getGalleryWork = async () => {
        try {
            const data = await instance.getList(userwORKID);
            const itemData = data.map((album) => ({
                img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_z.jpg`,
                title: album.title._content,
                id: album.id,
                description: album.description._content,
            }));
            return itemData;
        } catch (error) {
            console.error("Error fetching gallery work:", error);
            throw error;
        }
    };

    const getPhotos = async (id) => {
        try {
            const data = await instance.getPhotos(id);
            const itemData = data.map((photo) => ({
                id: photo.id,
                url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
                title: photo.title,
            }));
            return itemData;
        } catch (error) {
            console.error("Error fetching photos:", error);
            throw error;
        }
    };

    const getLatestPhotos = async () => {
        try {
            const data = await instance.getLatestPhotos(userID);
            const itemData = data.map((photo) => ({
                id: photo.id,
                url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`,
                title: photo.title,
            }));
            return itemData;
        } catch (error) {
            console.error("Error fetching latest photos:", error);
            throw error;
        }
    };

    const getPhotoInfo = async (id) => {
        try {
            const data = await instance.getInfo(id);
            const itemData = ({
                id: data.id,
                url: `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_b.jpg`,
                description: data.description._content,
                location: data.owner.location,
                title: data.title._content,
                taken: data.dates.taken,
                photopage: data.urls.url[0]._content,
                views: data.views
            });
            return itemData;
        } catch (error) {
            console.error("Error fetching photo info:", error);
            throw error;
        }
    };

    return {
        getGallery,
        getGalleryWork,
        getPhotos,
        getLatestPhotos,
        getPhotoInfo
    };
};

export default CreateFlickrApp;
