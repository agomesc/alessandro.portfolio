import React, { lazy, Suspense } from 'react';
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Masonry from '@mui/lab/Masonry';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const PhotoGrid = ({ itemData = [] }) => {
  return (
    <Box sx={{ p: 2, maxWidth: { xs: "100%", sm: "90%" }, mx: "auto" }}>
      <Suspense fallback={<Typography variant="h6">Carregando...</Typography>}>
        <TypographyTitle src="Atualizações" />
      </Suspense>

      {itemData.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
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
                <Typography variant="subtitle1">{item.title}</Typography>
              </CardContent>
            </Card>
          ))}
        </Masonry>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Nenhuma imagem disponível
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(PhotoGrid);
