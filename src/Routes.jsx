import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Gallery = lazy(() => import("./Views/Gallery"));
const Home = lazy(() => import("./Views/Home"));
const GalleryWork = lazy(() => import("./Views/GalleryWork"));
const Photos = lazy(() => import("./Views/Photos"));
const About = lazy(() => import("./Views/About"));
const LatestPhotos = lazy(() => import("./Views/LatestPhotos"));
const PhotoInfo = lazy(() => import("./Views/PhotoInfo"));
const Login = lazy(() => import("./Views/auth/index"));
const Privacidade = lazy(() => import("./Views/Privacidade"));
const Transparencia = lazy(() => import("./Views/Transparencia"));
const ListContent = lazy(() => import("./Views/ListContent"));


const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/galleryWork" element={<GalleryWork />} />
        <Route path="/latestphotos" element={<LatestPhotos />} />
        <Route path="/photos/:id" element={<Photos />} />
        <Route path="/photoinfo/:id" element={<PhotoInfo />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/about" element={<About />} />
        <Route path="/listContent" element={<ListContent />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
