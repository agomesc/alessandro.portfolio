import React, { useState, useEffect, lazy } from 'react';
import { Button, Box, Snackbar } from "@mui/material";
import Alert from '@mui/material/Alert';
import { auth, provider } from '../../firebaseConfig';
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
const TypographyTitle = lazy(() => import("../../Components/TypographyTitle"));

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
        width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" },
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: "0 10px",
        marginTop: 5
      }}
    >
      <TypographyTitle src={user ? "Bem-vindo!" : "Login"} style={{ mt: 50 }}></TypographyTitle>
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
          sx={{ mb: 2, mt: 2, backgroundColor: "#78884c", display: "-ms-flexbox" }}
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
