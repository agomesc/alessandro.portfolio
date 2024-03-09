// routes.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Main from "../src/Components/main";
import Gallery from "./Pages/Gallery";
import Photos from "./Pages/Photos";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="Main" element={<Main />}  exact />
        <Route path="Gallery" element={<Gallery />} />
        <Route path="Photos/:id"  element={<Photos />}/>
        
        {/* Adicione outras rotas aqui */}
        {/* Exemplo: */}
        {/* <Route component={Sobre} path="/sobre" /> */}
        {/* <Route component={Usuario} path="/usuario" /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
