import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';

const MessageSnackbar = ({ message, severity }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default React.memo(MessageSnackbar);
