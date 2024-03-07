// PhotoDescription.js
import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const PhotoDescription = ({ imageUrl, description }) => {
  return (
    <>
      <Typography variant="h4" style={{ marginBottom: '30px' }}>Sobre?</Typography>
      <Card
        style={{ display: "flex", alignItems: "flex-start", padding: "20px" }}
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
    </>
  );
};

export default PhotoDescription;
