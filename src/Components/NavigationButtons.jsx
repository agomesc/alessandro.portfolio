import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const NavigationButtons = () => {
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);

  const goBack = () => navigate(-1);
  const goHome = () => navigate("/");
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const hasScrolledPastViewport = window.scrollY > window.innerHeight;
      setShowButtons(hasScrolledPastViewport);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const buttonStyle = {
    position: "fixed",
    zIndex: 1000,
    bgcolor: "var(--primary-color)",
    color: "#ffffff",
    "&:hover": {
      bgcolor: "var(--secondary-color)",
    },
    boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
  };

  if (!showButtons) return null;

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
