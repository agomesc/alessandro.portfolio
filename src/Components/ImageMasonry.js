import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import FlickrService from "../shared/FlickrService";

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

const itemData = [];

const ImageMasonry = () => {
  return (
    <Box sx={{ width: 1024, minHeight: 829 }}>
      <Masonry columns={3} spacing={2}>
        {itemData.map((item, index) => (
          <div key={index}>
            <Label>{item.title}</Label>
            <a href={`/DetalhesItem/${item.id}`}>
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
            </a>
            
          </div>
        ))}
      </Masonry>
    </Box>
  );
}

async function GetGallery() {
  let apiKey = "099c9a89c04c78ec7592650af1d25a7a";
  var flickrService = new FlickrService(apiKey);
  var data = await flickrService.listarAlbuns("186526131@N04");
  data.forEach(function (album) {
    itemData.push({
      img: `https://farm${album.farm}.staticflickr.com/${album.server}/${album.primary}_${album.secret}_w.jpg`,
      title: album.title._content,
      id: album.id,
    });
  });
}

await GetGallery();

export default  ImageMasonry;