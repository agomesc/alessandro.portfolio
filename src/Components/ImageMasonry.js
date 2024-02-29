import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import FlickrApp from "../shared/FlickrApp";
import { Modal } from "@mui/material";
import PhotoGallery from "../PhotoGallery";

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

const ImageMasonry = () => {
  const [galleryData, setGalleryData] = useState([]);
  const apiKey = "099c9a89c04c78ec7592650af1d25a7a";
  const [open, setOpen] = useState(false);
  const [getID, setID] = useState(false);

  const handleOpen = (id) => {
    debugger;
    setID(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = <PhotoGallery id={getID} />;

  useEffect(() => {
    async function fetchData() {
      const flickrApp = new FlickrApp(apiKey);
      const data = await flickrApp.GetGallery();
      setGalleryData(data);
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Masonry columns={3} spacing={2}>
        {galleryData.map((item, index) => (
          <div key={index}>
            <Label>{item.title}</Label>
            <button type="button" onClick={() => handleOpen(item.id)}>
              <img
                srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
                src={`${item.img}?w=162&auto=format`}
                alt={item.title}
                loading="lazy"
                style={{
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  display: "block",
                  width: "100%",
                }}
              />
            </button>
          </div>
        ))}
      </Masonry>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            height: "89vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {body}
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageMasonry;
