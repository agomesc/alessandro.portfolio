import CreateFetchService from '../shared/CreateFetchService' 
const CreateFlickrService = () => {

    const apiKey = process.env.REACT_APP_FLICKR_API_KEY;
    const instance = CreateFetchService();

    const getList = async (userId) => {
        try {
            const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
            const response = await instance.get(url);
            const data = await response.json();
            return data.photosets.photoset;
        } catch (error) {
            console.error("Error fetching photo sets list:", error);
            throw error; 
        }
    };

    const getPhotos = async (albumId) => {
        try {
            const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&photoset_id=${albumId}&format=json&nojsoncallback=1`;
            const response = await instance.get(url);
            const data = await response.json();
            return data.photoset.photo;
        } catch (error) {
            console.error("Error fetching photos:", error);
            throw error;
        }
    };

    const getListcomments = async (photoId) => {
        try {
            const url = `https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
            const response = await instance.get(url);
            const data = await response.json();
            return data.comments.comment;
        } catch (error) {
            console.error("Error fetching comments list:", error);
            throw error;
        }
    };

    const getLatestPhotos = async (userId) => {
        try {
            const url = `https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
            const response = await instance.get(url);
            const data = await response.json();
            return data.photos.photo;
        } catch (error) {
            console.error("Error fetching latest photos:", error);
            throw error;
        }
    };

    const getInfo = async (id) => {
        try {
            const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${id}&format=json&nojsoncallback=1`;
            const response = await instance.get(url);
            const data = await response.json();
            return data.photo;
        } catch (error) {
            console.error("Error fetching photo info:", error);
            throw error;
        }
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
