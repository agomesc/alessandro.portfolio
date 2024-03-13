// routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Gallery from "./Pages/Gallery";
import Photos from "./Pages/Photos";
import About from "./Pages/About";
import LatestPhotos from "./Pages/LatestPhotos";


const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Gallery />} />
      <Route path="/Gallery" element={<Gallery />} />
      <Route path="/LatestPhotos" element={<LatestPhotos />} />
      <Route path="/Photos/:id" element={<Photos />} />
      <Route path="/About" element={<About />} />
    </Routes>
  );
};
export default AppRoutes;
