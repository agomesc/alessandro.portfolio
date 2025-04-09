import React, { lazy } from "react";
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

const StarComponent = lazy(() => import("./StarComponent"));

const PhotoDashboard = ({ photoData }) => {
  return (<>
    <Card>
      <CardHeader
        title={
          <Typography component="div" variant="h4">
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
          <Table sx={{ width: "100%" }} aria-label="photo specifications">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Title
                </TableCell>
                <TableCell>{photoData.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Description
                </TableCell>
                <TableCell>{photoData.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Location
                </TableCell>
                <TableCell>{photoData.location}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Take
                </TableCell>
                <TableCell>{photoData.taken}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Views
                </TableCell>
                <TableCell>{photoData.views}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Camera
                </TableCell>
                <TableCell>{photoData.camera}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Lens
                </TableCell>
                <TableCell>{photoData.lens}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Range
                </TableCell>
                <TableCell>{photoData.range}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  ColorSpace
                </TableCell>
                <TableCell>{photoData.colorSpace}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Iso
                </TableCell>
                <TableCell>{photoData.iso}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Exposure
                </TableCell>
                <TableCell>{photoData.exposure}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Focal
                </TableCell>
                <TableCell>{photoData.focal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Aperture
                </TableCell>
                <TableCell>{photoData.aperture}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <CardActions><StarComponent id={photoData.id} /></CardActions>
      <Link target="_new" to={photoData.photopage}>
        <IconButton>
          <FaFlickr />
        </IconButton>
      </Link>
    </Card>
  </>
  );
};

export default React.memo(PhotoDashboard);
