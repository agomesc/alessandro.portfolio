// routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./Pages/Main";
import Gallery from "./Pages/Gallery";
import Photos from "./Pages/Photos";
import About from "./Pages/About";

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Gallery />} />
      <Route path="/Main" element={<Main />} />
      <Route path="/Gallery" element={<Gallery />} />
      <Route path="/Photos/:id" element={<Photos />} />
      <Route path="/About" element={<About />} />
    </Routes>
  );
};
export default AppRoutes;
