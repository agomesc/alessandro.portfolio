import React from "react";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FaFlickr } from "react-icons/fa";

const PhotoDashboard = ({ photoData }) => {
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
        Informações da Foto
      </Typography>
      <Paper elevation={3} sx={{ p: 2, position: "relative" }}>
        <img
          src={photoData.url}
          alt={photoData.title}
          media="photo"
          loading="lazy"
          style={{ maxWidth: "100%", position: "flex", margin: "0 auto" }}
        />
      

        <Typography variant="body2" gutterBottom>
          Descrição: {photoData.description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Localização: {photoData.location}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Data da Foto: {photoData.taken}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Visualizações: {photoData.views}
        </Typography>

        <Link target="_new" to={photoData.photopage}>
          <IconButton>
            <FaFlickr />
          </IconButton>
        </Link>
        </Paper>
    </Box>
  );
};

export default PhotoDashboard;
