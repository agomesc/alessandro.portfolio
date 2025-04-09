import React, { lazy } from "react";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { FaFlickr } from "react-icons/fa";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

const StarComponent = lazy(() => import("./StarComponent"));
const ImageComponent = lazy(() => import("./ImageComponent"));

const PhotoDashboard = ({ photoData }) => {
  return (
    <Card>
      <CardHeader
        title={
          <Typography component="div" variant="h4">
            {photoData.title}
          </Typography>
        }
      />

      <ImageComponent
        src={photoData.url}
        alt={photoData.title}
        width="100%"
        height="auto"
        style={{
          objectFit: "cover",
          objectPosition: "center",
          display: "block"
        }}
      />

      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }} aria-label="photo specifications">
            <TableBody>
              {[
                ["Title", photoData.title],
                ["Description", photoData.description],
                ["Location", photoData.location],
                ["Take", photoData.taken],
                ["Views", photoData.views],
                ["Camera", photoData.camera],
                ["Lens", photoData.lens],
                ["Range", photoData.range],
                ["ColorSpace", photoData.colorSpace],
                ["Iso", photoData.iso],
                ["Exposure", photoData.exposure],
                ["Focal", photoData.focal],
                ["Aperture", photoData.aperture],
              ].map(([label, value]) => (
                <TableRow key={label}>
                  <TableCell component="th" scope="row">{label}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <CardActions>
        <StarComponent id={photoData.id} />
        <Link target="_blank" to={photoData.photopage}>
          <IconButton>
            <FaFlickr />
          </IconButton>
        </Link>
      </CardActions>
    </Card>
  );
};

export default React.memo(PhotoDashboard);
