// PhotoDescription.js
import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ImageComponent from "./ImageComponent";

const PhotoDescription = ({ imageUrl, description }) => {
  return (
    <Box
      sx={{
        p: 0,
        width: "80%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Sobre?
      </Typography>
      <Paper elevation={3}>
        <Grid>
          <Grid item>
            <Card
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "10px",
              }}
            >
              <ImageComponent src={imageUrl} alt={description} ></ImageComponent>
              <Typography variant="body2" style={{ textAlign: "justify" }}>
                {description}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PhotoDescription;
