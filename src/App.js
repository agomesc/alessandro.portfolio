import React from 'react';
import Main from './Components/main';
import Menu from './Components/menu';
import ImageMasonry  from './Components/ImageMasonry'
import PhotoGallery from './PhotoGallery'

const App = () => {
  return (
    <div>
      <Menu />
      <Main />
      <ImageMasonry />
      <PhotoGallery/>
    </div>
  );
};

export default App;
