import React, { lazy, useState, Suspense } from "react";
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
import InfoIcon from "@mui/icons-material/Info"; // Importar InfoIcon
import Tooltip from "@mui/material/Tooltip"; // Importar Tooltip
import Skeleton from "@mui/material/Skeleton"; // Importar Skeleton

const StarComponent = lazy(() => import("./StarComponent"));
const ViewComponent = lazy(() => import("./ViewComponent"));

const PhotoDashboard = ({ photoData, onImageLoad, showAdditionalInfo, onShowAdditionalInfo, loadingExif }) => {
  const [openFullscreen, setOpenFullscreen] = useState(false);

  const handleImageClick = () => {
    setOpenFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setOpenFullscreen(false);
  };

  // Lista de dados para a tabela, filtrando para mostrar apenas se a info adicional for solicitada
  const tableRows = [
    ["Title", photoData.title],
    ["Description", photoData.description],
    ["Location", photoData.location],
    ["Take", photoData.taken],
    ["Views", photoData.views],
  ];

  // Adiciona os dados EXIF à lista da tabela SOMENTE se showAdditionalInfo for true
  if (showAdditionalInfo && !loadingExif) { // Também só se não estiver carregando
    tableRows.push(
      ["Camera", photoData.camera],
      ["Lens", photoData.lens],
      ["Range", photoData.range],
      ["ColorSpace", photoData.colorSpace],
      ["Iso", photoData.iso],
      ["Exposure", photoData.exposure],
      ["Focal", photoData.focal],
      ["Aperture", photoData.aperture]
    );
  }

  return (
    <Card sx={{ width: "100%" }}>
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
          style={{
            display: "flex",
            width: "100%",
            height: "auto",
            objectFit: "cover",
            transition: "transform 0.3s ease-in-out",
            maxWidth: "1024px",
            margin: "0 auto",
          }}
        />
      </div>

      <CardContent>
        <TableContainer sx={{ width: "100%" }}>
          <Table aria-label="photo specifications" size="small">
            <TableBody>
              {tableRows.map(([label, value]) => (
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
                    {value || "N/A"} {/* Adiciona "N/A" para valores nulos/indefinidos */}
                  </TableCell>
                </TableRow>
              ))}
              {loadingExif && showAdditionalInfo && ( // Mostrar skeleton para EXIF enquanto carrega
                <>
                  <TableRow key="skeleton-1"> {/* Adicionado key única */}
                    <TableCell colSpan={2}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  </TableRow>
                  <TableRow key="skeleton-2"> {/* Adicionado key única */}
                    <TableCell colSpan={2}>
                      <Skeleton variant="text" width="60%" />
                    </TableCell>
                  </TableRow>
                  <TableRow key="skeleton-3"> {/* Adicionado key única */}
                    <TableCell colSpan={2}>
                      <Skeleton variant="text" width="70%" />
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Suspense fallback={<div>Loading Stars...</div>}>
            <StarComponent id={photoData.id} />
          </Suspense>
          <Suspense fallback={<div>Loading Views...</div>}>
            <ViewComponent id={photoData.id} />
          </Suspense>
          <Link target="_blank" to={photoData.photopage}>
            <IconButton>
              <FaFlickr />
            </IconButton>
          </Link>
        </div>
        <div>
          <Tooltip title={showAdditionalInfo ? "Ocultar detalhes" : "Mostrar detalhes da foto"}>
            <IconButton
              aria-label="Mostrar informações adicionais"
              onClick={onShowAdditionalInfo}
              color="primary"
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>
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

            {showAdditionalInfo && !loadingExif && photoData.exposure && (
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
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
                  textAlign: "right",
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
            )}
            {loadingExif && showAdditionalInfo && (
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  zIndex: 10001,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  pointerEvents: "none",
                }}
              >
                <Skeleton variant="text" width={100} sx={{ bgcolor: 'grey.700' }} />
                <Skeleton variant="text" width={80} sx={{ bgcolor: 'grey.700' }} />
                <Skeleton variant="text" width={70} sx={{ bgcolor: 'grey.700' }} />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default React.memo(PhotoDashboard);