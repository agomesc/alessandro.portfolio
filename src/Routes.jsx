import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Gallery = lazy(() => import("./Views/Gallery"));
const Home = lazy(() => import("./Views/Home"));
const GalleryWork = lazy(() => import("./Views/GalleryWork"));
const Photos = lazy(() => import("./Views/Photos"));
const About = lazy(() => import("./Views/About"));
const LatestPhotos = lazy(() => import("./Views/LatestPhotos"));
const PhotoInfo = lazy(() => import("./Views/PhotoInfo"));
const Privacidade = lazy(() => import("./Views/Privacidade"));
const Transparencia = lazy(() => import("./Views/Transparencia"));
const ListContent = lazy(() => import("./Views/ListContent"));
const FormContent = lazy(() => import("./Views/FormContent"));
const GalleryDetail = lazy(() => import("./Views/GalleryDetail"));
const NotFound = lazy(() => import("./Views/NotFound"));
const TestWrapper = lazy(() => import("./Views/TestWrapper"));
const CreateAds = lazy(() => import("./Views/CreateAds"));
const ListContentWithPagination = lazy(() => import("./Views/ListContentWithPagination"));
const ListAds = lazy(() => import("./Views/ListAds"));
const EditAds = lazy(() => import("./Views/EditAds"));
const EquipmentValueCalculator = lazy(() => import("./Views/EquipmentValueCalculator"));
const LoadingMessage = lazy(() => import('../src/Components/LoadingMessage'));

const AppRoutes = () => {

  const isLocalhost = window.location.hostname === "localhost";

  return (
    <Suspense fallback={<LoadingMessage />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/galleryWork" element={<GalleryWork />} />
        <Route path="/latestphotos" element={<LatestPhotos />} />
        <Route path="/photos/:id" element={<Photos />} />
        <Route path="/photoinfo/:id" element={<PhotoInfo />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/about" element={<About />} />
        {isLocalhost && <Route path="/listContent" element={<ListContent />} />}
        {isLocalhost && <Route path="/formContent" element={<FormContent />} />}
        {isLocalhost && <Route path="/createAds" element={<CreateAds />} />}
        {isLocalhost && <Route path="/listAds" element={<ListAds />} />}
        {isLocalhost && <Route path="/editAds/:id" element={<EditAds />} />}
        <Route path="/testWrapper" element={<TestWrapper />} />
        <Route path="/listContentWithPagination" element={<ListContentWithPagination />} />
        <Route path="/equipmentValueCalculator" element={<EquipmentValueCalculator />} />
        <Route path="/galleryDetail/:id" element={<GalleryDetail />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;