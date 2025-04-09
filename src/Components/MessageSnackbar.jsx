import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const MessageSnackbar = ({
  open = true,
  message = "",
  severity = "info",
  autoHideDuration = 6000,
  onClose = () => { },
}) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    onClose(); // permite controle externo
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default React.memo(MessageSnackbar);
