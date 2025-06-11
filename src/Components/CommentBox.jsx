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
import { getAuth } from 'firebase/auth';
import Editor from './Editor';
const TypographyTitle = lazy(() => import('./TypographyTitle'));

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '').trim();

const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width *= scale;
          height *= scale;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(resizedBase64);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
  const [replyingTo, setReplyingTo] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setCountry('BR');
    }
  }, [currentUser]);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('itemID', '==', itemID),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(groupComments(fetched));
    });

    return unsubscribe;
  }, [itemID]);

  const groupComments = (list) => {
    const map = {};
    list.forEach(c => (map[c.id] = { ...c, replies: [] }));
    const roots = [];
    list.forEach(c => {
      if (c.parentId && map[c.parentId]) {
        map[c.parentId].replies.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !country.trim() || !stripHtml(comment)) {
      showMessage('Preencha nome, país e comentário.', 'warning');
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
        parentId: replyingTo?.id || null,
        image: image || null,
      });

      // Limpar os campos após o envio bem-sucedido
      setName('');
      setEmail('');
      setCountry('BR');
      setComment('');
      setReplyingTo(null);
      setImage(null);

      showMessage('Comentário adicionado com sucesso!', 'success');
    } catch (err) {
      showMessage('Erro ao adicionar comentário: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!currentUser) {
      showMessage('Você precisa estar logado para remover comentários.', 'warning');
      return;
    }
    try {
      await deleteDoc(doc(db, 'comments', id));
      showMessage('Comentário removido com sucesso!', 'success');
    } catch (err) {
      showMessage('Erro ao remover comentário: ' + err.message, 'error');
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const renderComment = (comment) => (
    <Card key={comment.id} sx={{ mb: 2, mt: 2, p: 1 }}>
      <CardHeader
        avatar={comment.userPhoto ? <Avatar src={comment.userPhoto} /> : <Avatar><AccountCircle /></Avatar>}
        title={`${comment.name} (${comment.country})`}
        subheader={new Date(comment.timestamp).toLocaleString('pt-BR')}
        action={
          currentUser && comment.userId === currentUser.uid && (
            <IconButton onClick={() => handleDelete(comment.id)} color="error">
              <DeleteIcon />
            </IconButton>
          )
        }
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
          <span dangerouslySetInnerHTML={{ __html: comment.text }} />
        </Typography>
        {comment.image && (
          <img
            src={comment.image}
            alt="comentário"
            style={{
              maxWidth: '240px',
              height: 'auto',
              marginTop: '10px',
              borderRadius: '6px',
              display: 'block'
            }}
          />
        )}
        <Box mt={1}>
          <Button size="small" onClick={() => setReplyingTo(comment)}>Responder</Button>
        </Box>
        <Box sx={{ ml: 4 }}>
          {comment.replies.map(renderComment)}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: { xs: '100%', sm: '90%', md: '80%', lg: '70%', xl: '80%' }, m: '0 auto', p: '0 20px', mt: 10 }}>
      <Suspense fallback={<Skeleton variant="text" height={100} />}>
        <TypographyTitle src="Comentários" />
      </Suspense>

      {replyingTo && (
        <Box mb={2}>
          <Typography variant="body2">Respondendo a: <strong>{replyingTo.name}</strong></Typography>
          <Button size="small" onClick={() => setReplyingTo(null)}>Cancelar</Button>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <TextField label="Nome" value={name} onChange={e => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} disabled={Boolean(currentUser)} />
        <TextField label="E-mail (opcional)" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} disabled={Boolean(currentUser)} />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <ReactFlagsSelect
            selected={country}
            onSelect={code => setCountry(code)}
            countries={["BR", "US", "FR", "DE", "IN"]}
            customLabels={{ BR: "Brasil", US: "EUA", FR: "França", DE: "Alemanha", IN: "Índia" }}
            showSelectedLabel
            showOptionLabel
            placeholder="Selecione o país"
            disabled={Boolean(currentUser)}
          />
          <FormHelperText>Selecione o país</FormHelperText>
        </FormControl>

        <Box sx={{ mb: 2 }}>
          <Editor onContentChange={setComment} defaultValue={comment} height="200px" />
        </Box>

        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*"
            type="file"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const resized = await resizeImage(file, 240, 240);
              setImage(resized);
            }}
          />
        </Box>

        <Button type="submit" variant="contained" sx={{ backgroundColor: '#78884c' }}>
          Enviar comentário
        </Button>
      </form>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {comments.map(renderComment)}
    </Box>
  );
}

export default React.memo(CommentBox);
