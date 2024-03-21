import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function CommentBox({itemID}) {
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push(doc.data());
      });
      setComments(comments);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleLogin = async () => {
    debugger
    
        signInWithPopup(auth, provider)
        .then((result) => {
          // O token de acesso do Google pode ser acessado aqui, se necessário
          //const credential = GoogleAuthProvider.credentialFromResult(result);
          //const token = credential.accessToken;
      
          // As informações do usuário logado
          const user = result.user;
          setUser(user);
          console.log(user);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setMessage('Por favor, faça login para comentar.');
      setSeverity('warning');
      setOpen(true);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        text: comment,
        userId: user.uid,
        timestamp: Date.now(),
        itemID:itemID, 
        userName: user.displayName, 
        userPhoto: user.photoURL, 
      });
      console.log('Comentário adicionado com ID: ', docRef.id);
      setMessage('Comentário adicionado com sucesso!');
      setSeverity('success');
      setOpen(true);
      setComment('');
    } catch (error) {
      console.error('Erro ao adicionar comentário: ', error);
      setMessage('Erro ao adicionar comentário: ' + error.message);
      setSeverity('error');
      setOpen(true);
    }
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
        width: "80%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Comentários
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          value={comment}
          onChange={handleCommentChange}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>Login com Google</Button>
        <Button type="submit" variant="contained" color="primary">Enviar comentário</Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </MuiAlert>
      </Snackbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Comentário</TableCell>
              <TableCell align="left">Usuário</TableCell>
              <TableCell align="left">Nome</TableCell>
              <TableCell align="left">Foto</TableCell>
              <TableCell align="left">Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map((comment, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {comment.text}
                </TableCell>
                <TableCell align="left">{comment.userId}</TableCell>
                <TableCell align="left">{comment.userName}</TableCell> 
                
                <TableCell align="left">
                  <Avatar alt={comment.userName} src={comment.userPhoto} /> {/* Exiba a foto do usuário aqui */}
                </TableCell>
                <TableCell align="left">{new Date(comment.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
  );
}

export default CommentBox;
