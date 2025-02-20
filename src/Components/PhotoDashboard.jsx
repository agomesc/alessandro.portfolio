import { React } from "react";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { FaFlickr } from "react-icons/fa";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { yellow } from '@mui/material/colors';

const PhotoDashboard = ({ photoData }) => {
  return (
    <Card sx={{ maxWidth: "xl" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: yellow[500] }} aria-label="recipe">
            !
          </Avatar>
        }
      >
      {photoData.title}
      </CardHeader>

      <CardMedia
        component="img"
        sx={{ 
          width: "100%",
          height: "auto",
          objectFit: "cover",
          objectPosition: "center",
        }}
        image={photoData.url}
        lazy="load"
        title={photoData.title}
      />
      <CardContent>
        <Typography variant="body1" gutterBottom>
          Titulo: {photoData.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Descrição: {photoData.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Localização: {photoData.location}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Data da Foto: {photoData.taken}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Visualizações: {photoData.views}
        </Typography>
      </CardContent>
      <CardActions></CardActions>
      <Link target="_new" to={photoData.photopage}>
        <IconButton>
          <FaFlickr />
        </IconButton>
      </Link>
    </Card>
  );
};

export default PhotoDashboard;
