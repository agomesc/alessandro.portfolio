// PhotoDescription.js
import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const PhotoDescription = ({ imageUrl, description }) => {
  return (
    <>
      <Typography variant="h4">Sobre?</Typography>
      <Card
        style={{ display: "flex", alignItems: "flex-start", padding: "20px" }}
      >
        <img
          src={imageUrl}
          alt="Foto"
          style={{ width: "100px", marginRight: "20px" }}
        />
        <Typography variant="body1" style={{ textAlign: "justify" }}>
          {description}
        </Typography>
      </Card>
    </>
  );
};

export default PhotoDescription;
