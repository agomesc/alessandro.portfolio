import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

const Back = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const backButtonStyle = {
        position: "fixed",
        bottom: "70px",
        right: "20px",
        zIndex: 1000,
        backgroundColor: "#78884c",
        color: "#ffffff",
    };

    const goBack = () => {
        if (location.key) {
            navigate(-1);
        } else {
            navigate("/"); // Altere "/" para o caminho que você deseja como fallback.
        }
    };

    return (
        <IconButton onClick={goBack} style={backButtonStyle}>
            <ArrowBackIosNewOutlinedIcon />
        </IconButton>
    );
};

export default React.memo(Back);