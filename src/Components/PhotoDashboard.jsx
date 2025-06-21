import React, { lazy, useState } from "react";
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
import LazyImage from "./LazyImage";
import CloseIcon from "@mui/icons-material/Close";

const StarComponent = lazy(() => import("./StarComponent"));
const ViewComponent = lazy(() => import("./ViewComponent"));

const PhotoDashboard = ({ photoData, onImageLoad }) => {
  const [openFullscreen, setOpenFullscreen] = useState(false);

  const handleImageClick = () => {
    setOpenFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setOpenFullscreen(false);
  };

  return (
    <Card>
      <CardHeader
        title={
          <Typography component="div" variant="h6">
            {photoData.title}
          </Typography>
        }
      />

      <div
        onClick={handleImageClick}
        style={{ cursor: "pointer", overflow: "hidden" }}
      >
        <LazyImage
          src={photoData.url}
          alt={photoData.title}
          width="100%"
          height="auto"
          onLoad={onImageLoad}
        />
      </div>

      <CardContent>
        <TableContainer sx={{ width: "100%" }}>
          <Table aria-label="photo specifications" size="small">
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
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}
                  >
                    {label}
                  </TableCell>
                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <CardActions>
        <StarComponent id={photoData.id} />
        <ViewComponent id={photoData.id} />
        <Link target="_blank" to={photoData.photopage}>
          <IconButton>
            <FaFlickr />
          </IconButton>
        </Link>
      </CardActions>

      {openFullscreen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
          onClick={handleCloseFullscreen}
        >
          {/* Botão de Fechar "X" */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              cursor: "pointer",
              zIndex: 10000,
            }}
            onClick={handleCloseFullscreen}
          >
            <CloseIcon style={{ color: "white", fontSize: "36px" }} />
          </div>

          {/* Container para a imagem e seu texto sobreposto */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "calc(100% - 40px)",
              maxHeight: "calc(100% - 40px)",
              border: "10px solid white",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <LazyImage
              src={photoData.url}
              alt={photoData.title}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />

            {/* Sobreposição para Exposure, Aperture e ISO */}
            <div
              style={{
                position: "absolute",
                bottom: "10px", // Ajuste conforme necessário
                right: "10px", // ALINHADO À DIREITA
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "1rem",
                zIndex: 10001,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                pointerEvents: "none",
                textAlign: "right", // ALINHA O TEXTO INTERNO À DIREITA
              }}
            >
              {photoData.exposure && (
                <Typography variant="body2" sx={{ color: "white" }}>
                  **Velocidade (Exposure):** {photoData.exposure}
                </Typography>
              )}
              {photoData.aperture && (
                <Typography variant="body2" sx={{ color: "white" }}>
                  **Abertura (Aperture):** {photoData.aperture}
                </Typography>
              )}
              {photoData.iso && (
                <Typography variant="body2" sx={{ color: "white" }}>
                  **ISO:** {photoData.iso}
                </Typography>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default React.memo(PhotoDashboard);