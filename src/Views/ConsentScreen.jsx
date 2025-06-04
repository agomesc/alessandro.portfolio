import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";

const ConsentScreen = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Verifica se o usuário já aceitou
    const consent = localStorage.getItem("userConsent");
    if (consent !== "accepted") {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("userConsent", "accepted");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      aria-labelledby="consent-dialog-title"
      aria-describedby="consent-dialog-description"
    >
      <DialogTitle id="consent-dialog-title" sx={{ fontWeight: "bold" }}>
        Bem-vindo ao OlhoFotográfico!
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="consent-dialog-description" component="div">
          <Typography variant="body1" gutterBottom>
            Utilizamos cookies para melhorar sua experiência e respeitamos sua privacidade.
          </Typography>
          <Typography variant="body1">
            Ao continuar, você aceita nossos termos e políticas.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleAccept}
          variant="contained"
          color="primary"
          fullWidth={fullScreen}
        >
          Aceitar e Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentScreen;
