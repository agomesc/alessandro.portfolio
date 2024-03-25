import React, { useState, useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const backButtonStyle = {
    position: "fixed",
    bottom: "120px",
    right: "20px",
    zIndex: 1000,
  };

  // Mostrar botão quando a página é rolada para baixo 100vh
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.innerHeight !== 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Rolar para o topo suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    isVisible && (
      <nav>
        <Link onClick={scrollToTop} style={backButtonStyle}>
          <IconButton>
            <ExpandLessIcon fontSize="large" />
          </IconButton>
        </Link>
      </nav>
    )
  );
}
