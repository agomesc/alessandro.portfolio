import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Masonry from '@mui/lab/Masonry';

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
        <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
          Atualizações
        </Typography>
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
