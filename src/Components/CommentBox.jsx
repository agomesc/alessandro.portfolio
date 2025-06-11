import React, { useState, useEffect, lazy, Suspense } from 'react';
import ReactFlagsSelect from 'react-flags-select';
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
  Snackbar,
  Alert,
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  FormHelperText,
  FormControl,
  TextField,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebaseConfig';
import { getAuth } from "firebase/auth";
import Editor from './Editor'; // ⬅️ ajuste o caminho se necessário
const TypographyTitle = lazy(() => import("./TypographyTitle"));

// Remove tags HTML para validação do conteúdo
const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '').trim();

function CommentBox({ itemID }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('BR');
  const [comment, setComment] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setCountry('BR');
    }
  }, [currentUser]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress(""));

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

    if (!name.trim() || !country.trim() || !stripHtml(comment)) {
      setMessage('Preencha nome, país e comentário.');
      setSeverity('warning');
      setOpen(true);
      return;
    }

    try {
      await addDoc(collection(db, 'comments'), {
        name: name.trim(),
        email: email.trim() || null,
        country,
        text: comment.trim(),
        timestamp: Date.now(),
        itemID,
        userPhoto: currentUser?.photoURL || null,
        ip: ipAddress,
        userId: currentUser?.uid || null,
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
        <TextField
          label="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={Boolean(currentUser)}
        />
        <TextField
          label="E-mail (opcional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          disabled={Boolean(currentUser)}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <ReactFlagsSelect
            selected={country}
            onSelect={code => setCountry(code)}
            countries={["BR", "US", "FR", "DE", "IN"]}
            customLabels={{ BR: "Brasil", US: "EUA", FR: "França", DE: "Alemanha", IN: "Índia" }}
            showSelectedLabel={true}
            showOptionLabel={true}
            placeholder="Selecione o país"
            disabled={Boolean(currentUser)}
          />
          <FormHelperText>Selecione o país</FormHelperText>
        </FormControl>

        <Box sx={{ mb: 2 }}>
          <Editor
            onContentChange={setComment}
            defaultValue={comment}
            height="200px"
          />
        </Box>

        <Button type="submit" variant="contained" sx={{ backgroundColor: "#78884c" }}>
          Enviar comentário
        </Button>
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
              comment.userPhoto ? (
                <Avatar src={comment.userPhoto} alt={comment.name} />
              ) : (
                <Avatar>
                  <AccountCircle />
                </Avatar>
              )
            }
            title={`${comment.name} (${comment.country})`}
            subheader={new Date(comment.timestamp).toLocaleString('pt-BR')}
            action={
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
              {/* Exibe HTML do Quill como texto simples (seguro) */}
              <span dangerouslySetInnerHTML={{ __html: comment.text }} />
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default React.memo(CommentBox);
