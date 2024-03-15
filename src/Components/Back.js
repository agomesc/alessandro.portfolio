import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";


const Back = () => {
  const backButtonStyle = {
    position: "fixed",
    bottom: "70px",
    right: "20px",
    zIndex: 1000,
  };

  const goBack =() => {
    window.history.back();
  }

  return (
    <Link onClick={goBack} style={backButtonStyle}>
      <IconButton>
        <ArrowBackIosIcon />
      </IconButton>
    </Link>
  );
};

export default Back;
