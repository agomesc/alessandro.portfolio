import React from "react";
import IconButton from "@mui/material/IconButton";
import { FaFlickr, Fa500Px, FaTwitter } from "react-icons/fa";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const Footer = ({ darkMode }) => {
    return (
        <AppBar
            position="fixed"
            color="inherit"
            sx={{
                top: 'auto',
                bottom: 0,
                backgroundColor: darkMode ? '#121212' : 'white',
            }}
        >
            <Toolbar sx={{ justifyContent: "center" }}>
                <IconButton
                    href="https://www.flickr.com/agomesc"
                    target="_blank"
                    sx={{
                        color: darkMode ? '#bbb' : '#78884c',
                        transition: 'color 0.3s',
                        '&:hover': { color: '#000' }
                    }}
                >
                    <FaFlickr />
                </IconButton>
                <IconButton
                    href="https://500px.com/p/alessandrogomescunha?view=photos"
                    target="_blank"
                    sx={{
                        color: darkMode ? '#bbb' : '#78884c',
                        transition: 'color 0.3s',
                        '&:hover': { color: '#000' }
                    }}
                >
                    <Fa500Px />
                </IconButton>
                <IconButton
                    href="https://x.com/olhotofografico"
                    target="_blank"
                    sx={{
                        color: darkMode ? '#bbb' : '#78884c',
                        transition: 'color 0.3s',
                        '&:hover': { color: '#000' }
                    }}
                >
                    <FaTwitter />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};


export default Footer;
