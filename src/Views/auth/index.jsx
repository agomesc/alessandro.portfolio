import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Snackbar } from "@mui/material";
import Alert from '@mui/material/Alert';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from '../../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Login() {

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado
        setUser(user);
      } else {
        // Usuário está deslogado
        setUser(null);
      }
    });

    // Limpar a inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // O token de acesso do Google pode ser acessado aqui, se necessário
        //const credential = GoogleAuthProvider.credentialFromResult(result);
        //const token = credential.accessToken;

        // As informações do usuário logado
        const user = result.user;
        setUser(user);
        console.log(user);
        setMessage('Login realizado com sucesso!');
        setSeverity('success');
        setOpen(true);
        window.history.back();

      })
      .catch((error) => {
        // Lidar com erros aqui
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
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
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
