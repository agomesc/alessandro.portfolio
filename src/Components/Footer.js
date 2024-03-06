// Footer.js
import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { FaInstagram, FaFlickr, Fa500Px } from "react-icons/fa"; //

const Footer = () => {
  return (
    <Box sx={{ pt: 4, display: "flex", justifyContent: "center"  }}>
      <IconButton
        href="https://www.instagram.com/alessandro.portfolio"
        target="_blank"
      >
        <FaInstagram />
      </IconButton>
      <IconButton href="https://www.flickr.com/agomesc" target="_blank">
        <FaFlickr /> {/* Ícone do Flickr */}
      </IconButton>
      <IconButton
        href="https://500px.com/p/alessandrogomescunha?view=photos"
        target="_blank"
      >
        <Fa500Px /> {/* Ícone do 500px */}
      </IconButton>
    </Box>
  );
};

export default Footer;
