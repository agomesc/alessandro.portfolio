import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';
import { Card } from '@mui/material';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebaseConfig';

function CommentBox({ itemID }) {
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [comments, setComments] = useState([]);
  const [getiID, setID] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    setID(itemID);

    const q = query(collection(db, 'comments'), where('itemID', '==', getiID),
      orderBy('timestamp', 'desc'));
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
  }, [getiID, itemID]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado
        setUser(user);
        setIsLoggedIn(true);
      } else {
        // Usuário está deslogado
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    // Limpar a inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setMessage('Por favor, faça login para comentar.');
      setSeverity('warning');
      setOpen(true);
      window.location.href = '/Login';
    }

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        text: comment,
        userId: user.uid,
        timestamp: Date.now(),
        itemID: itemID,
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
        marginBottom: 30
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
          disabled={!isLoggedIn}
          placeholder={!isLoggedIn ? 'Caro visitante, Sua opinião é muito importante para nós! Convidamos você a compartilhar seus pensamentos ou experiências relacionadas à sua visita. Por favor, faça login através do ícone do usuário no menu superior para deixar seu comentário. Agradecemos por dedicar um momento para nos ajudar a melhorar!' : ''}
        />
        <Button sx={{ mb: 2, mt: 2 }} type="submit" disabled={!isLoggedIn} variant="contained" color="primary">Enviar comentário</Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </MuiAlert>
      </Snackbar>

      {comments.map((comment, index) => (
        <Card key={index} sx={{ mb: 2, mt: 2, p: 1 }}>
          <CardHeader avatar={<Avatar alt={comment.userName} src={comment.userPhoto} />}
            title={comment.userName}
            subheader={new Date(comment.timestamp).toLocaleString()}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {comment.text}
            </Typography>
          </CardContent>
        </Card>
      ))}

    </Box>
  );
}

export default CommentBox;
