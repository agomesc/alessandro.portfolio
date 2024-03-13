import PhotoGrid from "../Components/PhotoGrid"; // Importe o componente
import React, { useEffect, useState } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const LatestPhotos = () => {
  
    const [galleryData, setGalleryData] = useState([]);
    const instance = CreateFlickrApp();
  
    useEffect(() => {
      async function fetchData() {
        const data = await instance.getLatestPhotos();
        setGalleryData(data);
      }
      if (galleryData.length === 0) fetchData();
    }, [galleryData, instance]);
  
    return (
    <div>
      {/* Exemplo de uso */}
      <PhotoGrid itemData={galleryData} />
    </div>
  );
};

export default LatestPhotos;