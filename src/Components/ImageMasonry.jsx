import React, { lazy } from 'react';
import { Card, CardContent, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // Importa o ícone

import Masonry from '@mui/lab/Masonry';
import { NavLink } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
const StarComponent = lazy(() => import("../Components/StarComponent"));
const ImageComponent = lazy(() => import("../Components/ImageComponent"));

const ImageMasonry = ({ data = [] }) => {
  const isPortrait = useMediaQuery("(orientation: portrait)");

  return (
    <>
      {data.length > 0 ? (
        isPortrait ? (
          data.map((item) => (
            <Card key={item.id} sx={{ display: "flex", mb: 2, boxShadow: 3, width: { xs: "100%", sm: "90%" } }}>
              <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
                <ImageComponent
                  src={item.img}
                  alt={item.title}
                  width={140}
                  height={140}
                  style={{ padding: 70 }}
                />
              </NavLink>
              <CardContent>
                <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
                  <Typography component="div" variant="subtitle1" fontWeight="bold" sx={{ padding: 1, m: 0 }}>
                    {item.title} <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                  </Typography>
                </NavLink>
                <Typography component="div" variant="caption" color="text.secondary" sx={{ padding: 1, m: 0 }}>
                  {item.description.length > 100 ? `${item.description.substring(0, 150)}...` : item.description}
                </Typography>
                <StarComponent id={item.id} sx={{ padding: 1, m: 0 }} />
              </CardContent>
            </Card>
          ))
        ) : (
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 6 }} spacing={1}>
            {data.map((item) => (
              <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 3, width: { xs: "100%", sm: "90%", maxWidth: "320px" } }}>
                <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
                  <ImageComponent
                    src={item.img}
                    alt={item.title}
                    width={352}
                    height="auto"
                    style={{ padding: 8, borderRadius: 20 }}
                  />
                </NavLink>
                <CardContent>
                  <NavLink key={item.id} to={`/Photos/${item.id}`} style={{ textDecoration: "none" }}>
                    <Typography component="div" variant="h5" sx={{ padding: 1, m: 0 }}>{item.title}<OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} /></Typography>
                  </NavLink>
                  <Typography component="div" variant="body1" color="text.secondary" sx={{ padding: 1, m: 0 }}>
                    {item.description.length > 100 ? `${item.description.substring(0, 150)}...` : item.description}
                  </Typography>
                  <StarComponent id={item.id} sx={{ padding: 1, m: 0 }} />
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
