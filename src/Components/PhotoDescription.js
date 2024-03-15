// PhotoDescription.js
import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

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
      <Grid>
        <Grid item>
          <Card
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "10px",
            }}
          >
            <img
              src={imageUrl}
              alt="Foto"
              loading="lazy"
              style={{ width: "100px", marginRight: "20px" }}
            />
            <Typography variant="body2" style={{ textAlign: "justify" }}>
              {description}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PhotoDescription;
