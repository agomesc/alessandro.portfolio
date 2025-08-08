import React from "react";
import IconButton from "@mui/material/IconButton";
import { FaFlickr, Fa500Px, FaTwitter, FaFileAlt, FaLock } from "react-icons/fa";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const Footer = () => {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        top: 'auto',
        bottom: 0,
        backgroundColor: 'var(--background-color)',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
        <IconButton
          href="https://www.flickr.com/agomesc"
          target="_blank"
          title="Flickr"
          sx={{
            color: 'var(--primary-color)',
            transition: 'color 0.3s',
            '&:hover': { color: 'var(--secondary-color)' }
          }}
        >
          <FaFlickr />
        </IconButton>
        <IconButton
          href="https://500px.com/p/alessandrogomescunha?view=photos"
          target="_blank"
          title="500px"
          sx={{
            color: 'var(--primary-color)',
            transition: 'color 0.3s',
            '&:hover': { color: 'var(--secondary-color)' }
          }}
        >
          <Fa500Px />
        </IconButton>
        <IconButton
          href="https://x.com/olhotofografico"
          target="_blank"
          title="Twitter"
          sx={{
            color: 'var(--primary-color)',
            transition: 'color 0.3s',
            '&:hover': { color: 'var(--secondary-color)' }
          }}
        >
          <FaTwitter />
        </IconButton>
        <IconButton
          href="/privacidade"
          title="Política de Privacidade"
          sx={{
            color: 'var(--primary-color)',
            transition: 'color 0.3s',
            '&:hover': { color: 'var(--secondary-color)' }
          }}
        >
          <FaLock />
        </IconButton>
        <IconButton
          href="/transparencia"
          title="Transparência"
          sx={{
            color: 'var(--primary-color)',
            transition: 'color 0.3s',
            '&:hover': { color: 'var(--secondary-color)' }
          }}
        >
          <FaFileAlt />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;