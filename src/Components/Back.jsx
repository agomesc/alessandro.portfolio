import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link } from "react-router-dom";


const Back = () => {
	const backButtonStyle = {
		position: "fixed",
		bottom: "70px",
		right: "20px",
		zIndex: 1000,
	};

	const goBack = () => {
		window.history.back();
	}

	return (
		<nav>
			<Link onClick={goBack} style={backButtonStyle}>
				<IconButton>
					<ArrowBackIosNewOutlinedIcon />
				</IconButton>
			</Link>
		</nav>
	);
};

export default React.memo(Back);
