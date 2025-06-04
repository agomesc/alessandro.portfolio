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
  Box,
} from "@mui/material";

const ConsentScreen = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
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
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          px: fullScreen ? 3 : 4,
          py: fullScreen ? 4 : 3,
        },
      }}
    >
      <DialogTitle
        id="consent-dialog-title"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          fontSize: fullScreen ? "1.5rem" : "1.8rem",
        }}
      >
        Bem-vindo ao OlhoFotográfico!
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="consent-dialog-description" component="div">
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1" align="center" gutterBottom>
              Utilizamos cookies para melhorar sua experiência e respeitamos sua privacidade.
            </Typography>
            <Typography variant="body1" align="center">
              Ao continuar, você aceita nossos termos e políticas.
            </Typography>
          </Box>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: fullScreen ? 3 : 2 }}>
        <Button
          onClick={handleAccept}
          variant="contained"
          color="primary"
          size="large"
          fullWidth={fullScreen}
          sx={{ maxWidth: 300 }}
        >
          Aceitar e Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentScreen;
