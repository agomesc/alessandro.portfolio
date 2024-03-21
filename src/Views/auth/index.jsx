import {  Button, Box, Typography } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Inicialize o Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAl75-7cxK0okEbOEnpEABmzmEJr_aQv-I",
  authDomain: "alessandro-portfolio.firebaseapp.com",
  databaseURL: "https://alessandro-portfolio-default-rtdb.firebaseio.com",
  projectId: "alessandro-portfolio",
  storageBucket: "alessandro-portfolio.appspot.com",
  messagingSenderId: "1077155633264",
  appId: "1:1077155633264:web:176463c5c50b9a28427cb5",
  measurementId: "G-WG3E4CSVFR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Login() {
  const handleGoogleLogin = () => {

  signInWithPopup(auth, provider)
  .then((result) => {
    // O token de acesso do Google pode ser acessado aqui, se necessário
    //const credential = GoogleAuthProvider.credentialFromResult(result);
    //const token = credential.accessToken;

    // As informações do usuário logado
    const user = result.user;
    console.log(user);
  })
  .catch((error) => {
    // Lidar com erros aqui
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Erro ao fazer login com o Google: ${errorCode} ${errorMessage}`);
  });
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
	  Login
	</Typography>
      

        <Button
          fullWidth
          variant="contained"
		  color="primary"
          onClick={handleGoogleLogin}
        >
          Entrar com Google
        </Button>

    </Box>
  );
}

export default Login;
