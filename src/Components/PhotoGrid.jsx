import React, { lazy, Suspense } from 'react';
import { Card, CardContent, Typography } from "@mui/material";
import Masonry from '@mui/lab/Masonry';

const StarComponent = lazy(() => import("../Components/StarComponent"));
const ImageComponent = lazy(() => import("../Components/ImageComponent"));

const PhotoGrid = ({ itemData = [] }) => {
  return (
    <>
      {itemData.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
          {itemData.map((item) => (
            <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Suspense fallback={<div>Carregando imagem...</div>}>
                <ImageComponent
                  src={item.url}
                  alt={item.title}
                  width="320"
                  height="240"
                  style={{ padding: 8, borderRadius: 20 }}
                />
              </Suspense>
              <CardContent>
                <Typography component="div" variant="subtitle1" sx={{ padding: 1, m: 0 }}>
                  {item.title}
                </Typography>
                <Suspense fallback={<div>Carregando estrela...</div>}>
                  <StarComponent sx={{ padding: 1, m: 0 }} id={item.id} />
                </Suspense>
              </CardContent>
            </Card>
          ))}
        </Masonry>
      ) : (
        <Typography component="div" variant="caption" align="center" sx={{ mt: 4 }}>
          Nenhuma imagem disponível
        </Typography>
      )}
    </>
  );
};

export default React.memo(PhotoGrid);
