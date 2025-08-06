// src/services/flickrService.js
import CreateFetchService from './CreateFetchService'; // Importa seu serviço base de fetch

// É CRUCIAL que você crie uma ÚNICA INSTÂNCIA do CreateFetchService
// e do CreateFlickrService, para que o estado do cache e do rate limit seja compartilhado.
const fetchInstance = CreateFetchService();

const CreateFlickrService = () => {
    // A urlApi deve vir do seu arquivo .env
    const urlApi = process.env.REACT_APP_FLICKR_API_URL;

    // Você usa a instância ÚNICA do fetchService aqui
    // const instance = CreateFetchService(); // REMOVA ESTA LINHA e use 'fetchInstance'
    const instance = fetchInstance; // Use a instância já criada fora da função

    const getList = async (userId) => {
        if (!userId) {
            throw new Error("userId é obrigatório para getList.");
        }
        const url = `${urlApi}/flickr/albums/${userId}`;
        // O cache e o delay já estão embutidos no instance.get()
        const data = await instance.get(url);
        return data;
    };

    const getAlbum = async (userId, photosetId) => {
        if (!userId || !photosetId) {
            throw new Error("userId e photosetId são obrigatórios para getAlbum.");
        }
        const url = `${urlApi}/flickr/album/${userId}/${photosetId}`;
        const data = await instance.get(url);
        return data;
    };

    const getPhotos = async (albumId) => {
        if (!albumId) {
            throw new Error("albumId é obrigatório para getPhotos.");
        }
        const url = `${urlApi}/flickr/photos/${albumId}`;
        const data = await instance.get(url);
        return data;
    };

    const getListcomments = async (photoId) => {
        if (!photoId) {
            throw new Error("photoId é obrigatório para getListcomments.");
        }
        const url = `${urlApi}/flickr/comments/${photoId}`;
        const data = await instance.get(url);
        return data;
    };

    const getLatestPhotos = async (userId) => {
        if (!userId) {
            throw new Error("userId é obrigatório para getLatestPhotos.");
        }
        const url = `${urlApi}/flickr/latest/${userId}`;
        const data = await instance.get(url);
        return data;
    };

    const getInfo = async (id) => {
        if (!id) {
            throw new Error("id é obrigatório para getInfo.");
        }
        const url = `${urlApi}/flickr/info/${id}`
        const data = await instance.get(url);
        return data;
    };

    const getExifInfo = async (id) => {
        if (!id) {
            throw new Error("id é obrigatório para getExifInfo.");
        }
        const url = `${urlApi}/flickr/exif/${id}`;
        const data = await instance.get(url);
        return data;
    };

    const getPhotosGroupedByYear = async (userId) => {
        if (!userId) {
            throw new Error("userId é obrigatório para getPhotosGroupedByYear.");
        }
        const url = `${urlApi}/flickr/by-year/${userId}`;
        const data = await instance.get(url);
        return data;
    };

    const getMostViewedPhotos = async (userId) => {
        if (!userId) {
            throw new Error("userId é obrigatório para getMostViewedPhotos.");
        }
        const url = `${urlApi}/flickr/most-viewed/${userId}`;
        const response = await instance.get(url);
        return response;
    };


    return {
        getList,
        getAlbum,
        getPhotos,
        getListcomments,
        getLatestPhotos,
        getInfo,
        getExifInfo,
        getPhotosGroupedByYear,
        getMostViewedPhotos
    };
};

// Crie e exporte a ÚNICA INSTÂNCIA do seu FlickrService
export default CreateFlickrService;

// Opcional: Se você quiser expor o fetchInstance para subscrever eventos, faça assim:
// export const subscribeToFetchEvents = fetchInstance.subscribe;
// export const unsubscribeFromFetchEvents = fetchInstance.unsubscribe;