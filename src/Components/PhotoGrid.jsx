import React, { lazy } from 'react';
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Masonry from '@mui/lab/Masonry';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const PhotoGrid = ({ itemData }) => {
  return (

    <Box
      sx={{
        p: 0,
        width: "100%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <TypographyTitle src="Atualizações" />

      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
        {itemData.map((item) => (
          <Card key={item.id}>
            <CardMedia
              component="img"
              height="auto"
              image={item.url}
              alt={item.title}
            />
            <CardContent>
              <Typography variant="subtitle1">{item.title}</Typography>
            </CardContent>
          </Card>
        ))}
      </Masonry>
    </Box>

  );
};

export default React.memo(PhotoGrid);
