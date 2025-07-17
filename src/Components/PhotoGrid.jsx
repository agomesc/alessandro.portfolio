import React, { lazy } from 'react';
import { Box, Typography } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import { NavLink } from "react-router-dom";
import LazyImage from "../Components/LazyImage";

const StarComponent = lazy(() => import("../Components/StarComponent"));

const overlayStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  boxSizing: "border-box",
  zIndex: 1,
};

const PhotoGrid = ({ itemData = [] }) => {
  return (
    
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={2}>
          {itemData.length > 0 ? (
            itemData.map((item) => (
              <Box
                key={item.id}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.03)",
                    transition: "transform 0.3s ease",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <NavLink
                  to={`/PhotoInfo/${item.id}`}
                  style={{ textDecoration: "none", display: "block" }}
                  aria-label={`Detalhes da foto: ${item.title}`}
                >
                  <LazyImage
                    dataSrc={item.url}
                    alt={item.title}
                    style={{
                      width: "100%",
                      display: "block",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </NavLink>

                <Box
                  sx={{
                    ...overlayStyle,
                    opacity: 1,
                    transform: "translateY(0)",
                  }}
                >
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{
                        color: "white",
                        textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 1 }}>
                      <StarComponent id={item.id} />
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            // Render a placeholder or message directly inside Masonry if itemData is empty
            // Ensure this doesn't break Masonry's internal layout expectations
            <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 5, width: '100%' }}>
              Nenhuma imagem disponível para exibir.
            </Typography>
          )}
        </Masonry>
      </Box>
  );
};

export default React.memo(PhotoGrid);