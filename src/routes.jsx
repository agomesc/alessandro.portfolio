// routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Gallery from "./Views/Gallery";
import Photos from "./Views/Photos";
import About from "./Views/About";
import LatestPhotos from "./Views/LatestPhotos";
import PhotoInfo from "./Views/PhotoInfo";
import Login from "./Views/auth/index";
import Privacidade from "../src/Views/Privacidade";
import Transparencia from "../src/Views/Transparencia";

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Gallery />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Gallery" element={<Gallery />} />
      <Route path="/LatestPhotos" element={<LatestPhotos />} />
      <Route path="/Photos/:id" element={<Photos />} />
      <Route path="/PhotoInfo/:id" element={<PhotoInfo />} />
      <Route path="/Privacidade/" element={<Privacidade />} />
      <Route path="/Transparencia/" element={<Transparencia />} />
      <Route path="/About" element={<About />} />
    </Routes>
  );
};
export default AppRoutes;
