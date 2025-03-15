import React, { lazy } from 'react';
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

import Masonry from '@mui/lab/Masonry';
import { NavLink } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
const StarComponent = lazy(() => import("../Components/StarComponent"));

const ImageMasonry = ({ data = [] }) => {
  const isPortrait = useMediaQuery("(orientation: portrait)");

  return (
    <>
      {data.length > 0 ? (
        isPortrait ? (
          data.map((item) => (
            <Card key={item.id} sx={{ display: "flex", mb: 2, boxShadow: 3, width: { xs: "100%", sm: "90%" } }}>
              <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 120, objectFit: "cover" }}
                  image={item.img}
                  alt={item.title}
                />
              </NavLink>
              <CardContent>
                <Typography component="div" variant="subtitle1" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography component="div" variant="body2" color="text.secondary">
                  {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                  <StarComponent id={item.id} />
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
            {data.map((item) => (

              <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
                  <CardMedia
                    component="img"
                    height="auto"
                    image={item.img}
                    alt={item.title}
                    loading="lazy"
                  />
                </NavLink>
                <CardContent>
                  <Typography component="div" variant="caption">{item.title}<StarComponent id={item.id} /></Typography>
                </CardContent>
              </Card>

            ))}
          </Masonry>
        )
      ) : (
        <Typography variant="h4" align="center" component="div" sx={{ mt: 4 }}>
          Nenhuma imagem disponível
        </Typography>
      )}
    </>
  );
};

export default React.memo(ImageMasonry);
