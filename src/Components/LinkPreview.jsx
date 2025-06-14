import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LoadingMessage from "./LoadingMessage";
import MessageSnackbar from "./MessageSnackbar";
import LazyImage from "../Components/LazyImage";

const LinkPreview = ({ url }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!url) return;

    const timeout = (ms) =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite excedido")), ms)
      );

    const fetchData = async () => {
      if (!process.env.REACT_APP_LINK_PREVIEW) {
        setMessage("Configuração do servidor de preview não encontrada.");
        setShowMessage(true);
        setHasError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await Promise.race([
          fetch(
            `${process.env.REACT_APP_LINK_PREVIEW}/api/preview?src=${encodeURIComponent(url)}`
          ),
          timeout(10000)
        ]);

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        if (data) {
          setPreviewData(data);
          setHasError(false);
        } else {
          setHasError(true);
        }
      } catch (error) {
        setMessage("Erro ao buscar prévia do link.");
        setShowMessage(true);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) return <LoadingMessage />;

  if (hasError || !previewData) {
    return (
      <>
        <MessageSnackbar
          open={showMessage}
          message={message}
          severity="error"
          onClose={() => setShowMessage(false)}
        />
        <Typography component="div" variant="body2" align="center" color="text.secondary">
          Não foi possível carregar a pré-visualização.
        </Typography>
      </>
    );
  }

  return (
    <>
      <MessageSnackbar
        open={showMessage}
        message={message}
        severity="error"
        onClose={() => setShowMessage(false)}
      />
      <Box sx={{ p: 0, mt: 0, width: "90%", margin: "0 auto" }}>
        <Card sx={{ p: 2, margin: "0 auto", boxShadow: 0 }}>
          {previewData.image && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <LazyImage
                src={previewData.image}
                alt={previewData.description || "Imagem da prévia"}
                width={160}
                height="auto"
              />
            </Box>
          )}
          <CardContent>
            <Typography component="div"  variant="caption" align="center" sx={{ color: "red" }}>
              Publicidade / Seleção de Ofertas
            </Typography>
            <Typography component="div"  variant="body1" align="center" fontWeight="bold" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {previewData.title}
              <OpenInNewIcon sx={{ ml: 0.5, fontSize: "small" }} aria-hidden="true" />
            </Typography>
            <Typography component="div" variant="body2" align="center">
              {previewData.description}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

LinkPreview.propTypes = {
  url: PropTypes.string.isRequired,
};

export default React.memo(LinkPreview);
