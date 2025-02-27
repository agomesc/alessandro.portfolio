import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Snackbar, Alert } from "@mui/material";
import { auth, provider } from '../../firebaseConfig';
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

function Login() {

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        setMessage('Login realizado com sucesso!');
        setSeverity('success');
        setOpen(true);
        window.history.back();

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Erro ao fazer login com o Google: ${errorCode} ${errorMessage}`);
        setMessage(`Erro ao fazer login com o Google: ${errorCode} ${errorMessage}`);
        setSeverity('error');
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Box
      sx={{
        p: 0,
        width: "30%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <Typography sx={{ mt: 10, mb: 3 }} variant="subtitle1">
        {user ? "Bem-vindo!" : "Login"}
      </Typography>

      {user ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            auth.signOut();
            setUser(null);
          }}
        >
          Logoff
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoogleLogin}
        >
          Entrar com Google
        </Button>
      )}

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
