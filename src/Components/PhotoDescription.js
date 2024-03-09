// PhotoDescription.js
import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const PhotoDescription = ({ imageUrl, description }) => {
  return (
    <Grid>
      <Grid item>
        <Typography sx={{ mt: 3, mb: 3 }} variant="h4">
          Sobre?
        </Typography>
        <Card
          style={{ display: "flex", alignItems: "flex-start", padding: "10px" }}
        >
          <img
            src={imageUrl}
            alt="Foto"
            style={{ width: "100px", marginRight: "20px" }}
          />
          <Typography variant="body" style={{ textAlign: "justify" }}>
            {description}
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PhotoDescription;
