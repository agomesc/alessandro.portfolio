import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.key) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const goHome = () => {
    navigate("/");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buttonStyle = {
    position: "fixed",
    zIndex: 1000,
    bgcolor: "#78884c",
    color: "#ffffff",
    "&:hover": { bgcolor: "#6a7a42" },
  };

  return (
    <>
      <Tooltip title="Voltar">
        <IconButton
          onClick={goBack}
          aria-label="Voltar"
          sx={{ ...buttonStyle, bottom: 70, right: 20 }}
        >
          <ArrowBackIosNewOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Início">
        <IconButton
          onClick={goHome}
          aria-label="Ir para a home"
          sx={{ ...buttonStyle, bottom: 130, right: 20 }}
        >
          <HomeOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Topo da página">
        <IconButton
          onClick={scrollToTop}
          aria-label="Subir para o topo"
          sx={{ ...buttonStyle, bottom: 190, right: 20 }}
        >
          <KeyboardArrowUpOutlinedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default NavigationButtons;
