import React, { lazy, Suspense } from 'react';
import { Box, Typography } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import { NavLink } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import LazyImage from "../Components/LazyImage";

const StarComponent = lazy(() => import("../Components/StarComponent"));

const PhotoGrid = ({ itemData = [] }) => {
  return (
    <>
      {itemData.length > 0 ? (
        <div className="fade-container">
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }} spacing={2}>
            {itemData.map((item) => (
              <div
                key={item.id}
                className="card-anim"
              >
                <NavLink to={`/PhotoInfo/${item.id}`} style={{ textDecoration: "none" }}>
                  <LazyImage
                    dataSrc={item.url}
                    alt={item.title}
                    style={{
                      width: "100%",
                      display: "block",
                      borderRadius: "16px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                    }}
                  />
                </NavLink>

                {/* Título sobreposto */}
                <div className="slide-up fade-delay-1">
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.9rem',
                      maxWidth: "calc(100% - 80px)",
                      zIndex: 2,
                    }}
                  >
                    <Typography variant="subtitle2" component="div" noWrap>
                      {item.title}
                    </Typography>
                  </Box>
                </div>

                {/* Estrela sobreposta */}
                <div className="slide-down fade-delay-2">
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 2,
                    }}
                  >
                    <Suspense fallback={<Skeleton variant="circular" width={24} height={24} />}>
                      <StarComponent id={item.id} />
                    </Suspense>
                  </Box>
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      ) : (
        <Suspense fallback={<Skeleton variant="text" />}>
          <Typography component="div" variant="caption" align="center" sx={{ mt: 10 }}>
            Nenhuma imagem disponível
          </Typography>
        </Suspense>
      )}
    </>
  );
};

export default React.memo(PhotoGrid);
