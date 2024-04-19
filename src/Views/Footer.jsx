// Footer.js
import React from "react";
import IconButton from "@mui/material/IconButton";
import { FaInstagram, FaFlickr, Fa500Px, FaTwitter } from "react-icons/fa"; //
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const Footer = () => {
	return (
		<AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
			<Toolbar sx={{ justifyContent: "center", b: 0 }}>
				<IconButton
					href="https://www.instagram.com/alessandro.portfolio"
					target="_blank"
				>
					<FaInstagram />
				</IconButton>
				<IconButton href="https://www.flickr.com/agomesc" target="_blank">
					<FaFlickr /> 
				</IconButton>
				<IconButton
					href="https://500px.com/p/alessandrogomescunha?view=photos"
					target="_blank"
				>
					<Fa500Px /> 
				</IconButton>
				<IconButton
					href="https://twitter.com/AlePortolio"
					target="_blank"
				>
					<FaTwitter />
				</IconButton>

				
			</Toolbar>
		</AppBar>
	);
};

export default Footer;
