import React, { useState, useEffect, lazy } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar
} from '@mui/material';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";


const TypographyTitle = lazy(() => import("./TypographyTitle"));

function CommentBox({ itemID }) {
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [comments, setComments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('itemID', '==', itemID),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map(doc => doc.data());
      setComments(fetchedComments);
    });

    return unsubscribe;
  }, [itemID]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

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

      setTimeout(() => navigate('/Login'), 3000);
      return;
    }

    if (!comment.trim()) {
      setMessage('O campo de comentário não pode estar vazio.');
      setSeverity('warning');
      setOpen(true);
      return;
    }

    try {
      await addDoc(collection(db, 'comments'), {
        text: comment,
        userId: user.uid,
        timestamp: Date.now(),
        itemID: itemID,
        userName: user.displayName,
        userPhoto: user.photoURL,
      });

      setMessage('Comentário adicionado com sucesso!');
      setSeverity('success');
      setOpen(true);
      setComment('');
    } catch (error) {
      setMessage('Erro ao adicionar comentário: ' + error.message);
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Box
      sx={{
        p: 0,
        width: {
          xs: "100%", // Para telas extra pequenas (mobile)
          sm: "90%",  // Para telas pequenas
          md: "80%",  // Para telas médias
          lg: "70%",  // Para telas grandes
          xl: "80%"   // Para telas extra grandes
        },
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: "0 20px",
        mt: 10
      }}
    >
      <TypographyTitle src="Comentários" />

      <form onSubmit={handleSubmit}>
        <TextField
          value={comment}
          onChange={handleCommentChange}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          disabled={!isLoggedIn}
          placeholder={
            !isLoggedIn
              ? 'Caro visitante, sua opinião é muito importante para nós! Faça login para comentar.'
              : ''
          }
        />
        {!isLoggedIn && (
          <Link to="/Login">
            <IconButton size="large" sx={{ color: "#78884c" }}>
              <AccountCircle fontSize="medium" />
            </IconButton>
          </Link>
        )}
        <Button
          sx={{ mb: 2, mt: 2, backgroundColor: "#78884c" }}
          type="submit"
          disabled={!isLoggedIn}
          variant="contained"
        >
          Enviar comentário
        </Button>
      </form>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {comments.map((comment, index) => (
        <Card key={index} sx={{ mb: 2, mt: 2, p: 1 }}>
          <CardHeader
            avatar={<Avatar alt={comment.userName} src={comment.userPhoto} />}
            title={comment.userName}
            subheader={new Date(comment.timestamp).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
          <CardContent>
            <Typography
              component="div"
              variant="body1"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {comment.text}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default CommentBox;
