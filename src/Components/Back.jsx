import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

const Back = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const goBack = () => {
        if (location.key) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return (
        <IconButton
            aria-label="Voltar"
            onClick={goBack}
            sx={{
                position: "fixed",
                bottom: 70,
                right: 20,
                zIndex: 1000,
                bgcolor: "#78884c",
                color: "#ffffff",
                "&:hover": {
                    bgcolor: "#6a7a42",
                },
            }}
        >
            <ArrowBackIosNewOutlinedIcon />
        </IconButton>
    );
};

export default Back;
