import { React, Suspense, lazy } from "react";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { FaFlickr } from "react-icons/fa";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from '@mui/material/CardHeader';
import Box from "@mui/material/Box";
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import LoadingMessage from "../Components/LoadingMessage";
import { Helmet  } from 'react-helmet';

const SocialMetaTags = lazy(() => import("./SocialMetaTags"));

const PhotoDashboard = ({ photoData }) => {

  const title = photoData.title;

  return (
    <>
      <Suspense fallback={<LoadingMessage />}>
        <Helmet>
          <SocialMetaTags title={title} description={title} image={photoData.url} url={window.location.href} />
        </Helmet>
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
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                  !
                </Avatar>
              }></CardHeader>
            <CardMedia
              component="img"
              sx={{ display: "flex", objectFit: "contain" }}
              image={photoData.url}
              lazy="load"
              maxWidth="100%"
              height="auto"
              title={photoData.title}
            />
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Titulo: {photoData.title}
              </Typography>
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
            </CardContent>
            <CardActions></CardActions>
            <Link target="_new" to={photoData.photopage}>
              <IconButton>
                <FaFlickr />
              </IconButton>
            </Link>
          </Card>
        </Box>
      </Suspense>
    </>
  );
};

export default PhotoDashboard;
