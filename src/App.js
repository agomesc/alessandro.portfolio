import React from 'react';
import Main from './Components/main';
import Menu from './Components/menu';
import Container from "@mui/material/Container";
import ImageMasonry  from './Components/ImageMasonry'
import PhotoGallery from './PhotoGallery'

const App = () => {
  return (
    <Container maxWidth={true} disableGutters>
      <Menu />
      <Main />
      <ImageMasonry />
      {/* <PhotoGallery/> */}
    </Container>
  );
};

export default App;
