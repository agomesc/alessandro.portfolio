// routes.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Main from "./Pages/Main";
import Gallery from "./Pages/Gallery";
import Photos from "./Pages/Photos";
import About from "./Pages/About";
import App from "./App"
import ReactDOM from 'react-dom';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="/" component={App}/>
        <Route path="/Main" element={<Main />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Photos/:id" element={<Photos />}/>
        <Route path="/About" element={<About />}/>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(AppRoutes, document.getElementById('root'));

export default AppRoutes;
