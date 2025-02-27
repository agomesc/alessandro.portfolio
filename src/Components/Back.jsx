import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const Back = () => {
    const backButtonStyle = {
        position: "fixed",
        bottom: "70px",
        right: "20px",
        zIndex: 1000,
        backgroundColor: "#c0810d",
        color: "#ffffff",
    };

    const goBack = () => {
        window.history.back();
    }

    return (
        <IconButton onClick={goBack} style={backButtonStyle}>
            <ArrowBackIosNewOutlinedIcon />
        </IconButton>
    );
};

export default React.memo(Back);
