import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const MessageSnackbar = ({
  open = true,
  message = "",
  severity = "info",
  autoHideDuration = 6000,
  onClose = () => { },
}) => {
  const [show, setShow] = useState(open);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (open && message) {
      if (show) {
        // Se já estiver exibindo uma, adiciona na fila
        setQueue((prev) => [...prev, { message, severity }]);
      } else {
        setShow(true);
      }
    }
  }, [open, message]);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setShow(false);
    onClose();

    // Após o fechamento, mostra a próxima da fila (se houver)
    if (queue.length > 0) {
      setTimeout(() => {
        const next = queue[0];
        setQueue((prev) => prev.slice(1));
        setShow(true);
      }, 500);
    }
  };

  return (
    <Snackbar
      open={show}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={handleClose}
        sx={{ width: "100%", minWidth: 300, justifyContent: "center" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default React.memo(MessageSnackbar);
