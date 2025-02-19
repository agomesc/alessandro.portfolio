import React from "react";
import IconButton from "@mui/material/IconButton";
import { FaFlickr, Fa500Px, FaTwitter } from "react-icons/fa";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const Footer = () => {
    return (
        <AppBar position="fixed" color="inherit" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar sx={{ justifyContent: "center", backgroundColor: 'white' }}>
                <IconButton href="https://www.flickr.com/agomesc" target="_blank" sx={{ color: 'black' }}>
                    <FaFlickr />
                </IconButton>
                <IconButton
                    href="https://500px.com/p/alessandrogomescunha?view=photos"
                    target="_blank"
                    sx={{ color: 'black' }}
                >
                    <Fa500Px />
                </IconButton>
                <IconButton
                    href="https://twitter.com/AlePortolio"
                    target="_blank"
                    sx={{ color: 'black' }}
                >
                    <FaTwitter />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default React.memo(Footer);
