import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { hydrate, render } from "react-dom";

const Gallery = lazy(() => import("./Views/Gallery.jsx"));
const GalleryWork = lazy(() => import("./Views/GalleryWork.jsx"));
const Photos = lazy(() => import("./Views/Photos.jsx"));
const About = lazy(() => import("./Views/About.jsx"));
const LatestPhotos = lazy(() => import("./Views/LatestPhotos.jsx"));
const PhotoInfo = lazy(() => import("./Views/PhotoInfo.jsx"));
const Login = lazy(() => import("./Views/auth/index.jsx"));
const Privacidade = lazy(() => import("./Views/Privacidade.jsx"));
const Transparencia = lazy(() => import("./Views/Transparencia.jsx"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/home" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/galleryWork" element={<GalleryWork />} />
        <Route path="/latestphotos" element={<LatestPhotos />} />
        <Route path="/photos/:id" element={<Photos />} />
        <Route path="/photoinfo/:id" element={<PhotoInfo />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
};

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(AppRoutes, rootElement);
} else {
  render(AppRoutes, rootElement);
}

const prefersColorSchemeWatcher = window.matchMedia("(prefers-color-scheme: dark)");

prefersColorSchemeWatcher.addEventListener("change", () => {
  const favicon = document.querySelector('link[rel="icon"]');
  favicon.href = null;
  favicon.href = "/favicon.ico";
});

export default AppRoutes;
