import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  deleteDoc,
  doc
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
  Avatar,
  IconButton
} from '@mui/material';
import { db } from '../firebaseConfig';
import Skeleton from '@mui/material/Skeleton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAuth } from "firebase/auth";

const TypographyTitle = lazy(() => import("./TypographyTitle"));

function CommentBox({ itemID }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [comment, setComment] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  // Agora armazenamos também o id do documento Firestore
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Buscar IP
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress(""));

    // Buscar comentários
    const q = query(
      collection(db, 'comments'),
      where('itemID', '==', itemID),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(fetchedComments);
    });

    return unsubscribe;
  }, [itemID]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !country.trim() || !comment.trim()) {
      setMessage('Preencha nome, país e comentário.');
      setSeverity('warning');
      setOpen(true);
      return;
    }

    try {
      await addDoc(collection(db, 'comments'), {
        name: name.trim(),
        email: email.trim() || null,
        country: country.trim(),
        text: comment.trim(),
        timestamp: Date.now(),
        itemID,
        userPhoto: null,
        ip: ipAddress,
        userId: currentUser?.uid || null,  // Salva uid ou null
      });

      setMessage('Comentário adicionado com sucesso!');
      setSeverity('success');
      setOpen(true);

      // Limpar campos
      setName('');
      setEmail('');
      setCountry('');
      setComment('');
    } catch (error) {
      setMessage('Erro ao adicionar comentário: ' + error.message);
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleDelete = async (commentId) => {
    if (!currentUser) {
      setMessage('Você precisa estar logado para remover comentários.');
      setSeverity('warning');
      setOpen(true);
      return;
    }

    try {
      await deleteDoc(doc(db, 'comments', commentId));
      setMessage('Comentário removido com sucesso!');
      setSeverity('success');
      setOpen(true);
    } catch (error) {
      setMessage('Erro ao remover comentário: ' + error.message);
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Box sx={{ width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%" }, margin: "0 auto", padding: "0 20px", mt: 10 }}>
      <Suspense fallback={<Skeleton variant="text" height={100} />}>
        <TypographyTitle src="Comentários" />
      </Suspense>

      <form onSubmit={handleSubmit}>
        <TextField label="Nome" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
        <TextField label="E-mail (opcional)" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="País" value={country} onChange={e => setCountry(e.target.value)} fullWidth required sx={{ mb: 2 }} />
        <TextField label="Comentário" value={comment} onChange={e => setComment(e.target.value)} multiline rows={4} fullWidth required sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" sx={{ backgroundColor: "#78884c" }}>Enviar comentário</Button>
      </form>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {comments.map((comment) => (
        <Card key={comment.id} sx={{ mb: 2, mt: 2, p: 1 }}>
          <CardHeader
            avatar={
              <Avatar>
                <AccountCircle />
              </Avatar>
            }
            title={`${comment.name} (${comment.country})`}
            subheader={new Date(comment.timestamp).toLocaleString('pt-BR')}
            action={
              // Mostrar botão de remover só se userId do comentário == currentUser.uid
              currentUser && comment.userId === currentUser.uid ? (
                <IconButton
                  aria-label="Remover comentário"
                  onClick={() => handleDelete(comment.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              ) : null
            }
          />
          <CardContent>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {comment.text}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default React.memo(CommentBox);
