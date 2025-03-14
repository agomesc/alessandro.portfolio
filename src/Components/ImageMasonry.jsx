import React from 'react';
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

import Masonry from '@mui/lab/Masonry';
import { NavLink } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

const ImageMasonry = ({ data = [] }) => {
  const isPortrait = useMediaQuery("(orientation: portrait)");

  return (
    <>
      {data.length > 0 ? (
        isPortrait ? (
          data.map((item) => (
            <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
              <Card sx={{ display: "flex", mb: 2, boxShadow: 3, width: { xs: "100%", sm: "90%" } }}>
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
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
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
    </>
  );
};

export default React.memo(ImageMasonry);
