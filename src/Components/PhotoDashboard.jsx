import { React } from "react";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { FaFlickr } from "react-icons/fa";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

const PhotoDashboard = ({ photoData }) => {
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h3" component="div">
            {photoData.title}
          </Typography>
        }
      />

      <CardMedia
        component="img"
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "crop",
          objectPosition: "center",
        }}
        image={photoData.url}
        lazy="load"
        title={photoData.title}
      />

      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="photo specifications">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Titulo
                </TableCell>
                <TableCell>{photoData.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Descrição
                </TableCell>
                <TableCell>{photoData.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Localização
                </TableCell>
                <TableCell>{photoData.location}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Data da Foto
                </TableCell>
                <TableCell>{photoData.taken}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Visualizações
                </TableCell>
                <TableCell>{photoData.views}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Equipamento
                </TableCell>
                <TableCell>{photoData.equipment}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Lente
                </TableCell>
                <TableCell>{photoData.lens}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Distância Focal
                </TableCell>
                <TableCell>{photoData.range}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
