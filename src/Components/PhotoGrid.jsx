import React, { lazy } from 'react';
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import Masonry from '@mui/lab/Masonry';

const StarComponent = lazy(() => import("../Components/StarComponent"));

const PhotoGrid = ({ itemData = [] }) => {
  return (
    <>
      {itemData.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
          {itemData.map((item) => (
            <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="auto"
                image={item.url}
                alt={item.title || "Imagem sem descrição"}
                loading="lazy"
              />
              <CardContent>
                <Typography component="div" variant="subtitle1" sx={{ padding: 1, m: 0 }}>{item.title} </Typography>
                <StarComponent sx={{ padding: 1, m: 0 }} id={item.id} />
              </CardContent>
            </Card>
          ))}
        </Masonry>
      ) : (
        <Typography component="div" variant="h4" align="center" sx={{ mt: 4 }}>
          Nenhuma imagem disponível
        </Typography>
      )}

    </>
  );
};

export default React.memo(PhotoGrid);
