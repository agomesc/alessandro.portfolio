import React, { lazy, Suspense } from 'react';
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Masonry from '@mui/lab/Masonry';
import { NavLink } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const ImageMasonry = ({ data = [] }) => {
  const isPortrait = useMediaQuery("(orientation: portrait)");

  return (
    <Box sx={{ p: 2, maxWidth: "1200px", mx: "auto" }}>
      <Suspense fallback={<Typography variant="h6">Carregando...</Typography>}>
        <TypographyTitle src="Galeria de Fotos" />
      </Suspense>

      {data.length > 0 ? (
        isPortrait ? (
          // Layout para modo retrato (lista vertical)
          data.map((item) => (
            <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
              <Card sx={{ display: "flex", mb: 2, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 120, objectFit: "cover" }}
                  image={item.img}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                  </Typography>
                </CardContent>
              </Card>
            </NavLink>
          ))
        ) : (
          // Layout para modo paisagem (grade com Masonry)
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {data.map((item) => (
              <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="auto"
                    image={item.img}
                    alt={item.title}
                    loading="lazy"
                  />
                  <CardContent>
                    <Typography variant="subtitle1">{item.title}</Typography>
                  </CardContent>
                </Card>
              </NavLink>
            ))}
          </Masonry>
        )
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Nenhuma imagem disponível
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(ImageMasonry);
