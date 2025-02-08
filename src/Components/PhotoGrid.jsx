import React, { Suspense } from "react";
import { Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import LoadingMessage from "./LoadingMessage";

const PhotoGrid = ({ itemData }) => {

  return (
    <Suspense fallback={<LoadingMessage />}>
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
        <Grid container spacing={2}>
          {itemData.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.url}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="subtitle1">
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Suspense>
  );
};

export default React.memo(PhotoGrid);
