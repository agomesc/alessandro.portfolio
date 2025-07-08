import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
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
import { resizeImage } from '../shared/Util';

const TypographyTitle = lazy(() => import('./TypographyTitle'));

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '').trim();

function CommentBox({ itemID }) {
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
  const [currentUser, setCurrentUser] = useState(null);

  // Create a ref for the Editor component (for focus)
  const editorRef = useRef(null);
  // Create a ref for the comment form section (for scrolling)
  const commentFormRef = useRef(null);

  // Scroll to comment form when replying to a comment
  useEffect(() => {
    if (replyingTo && commentFormRef.current) {
      commentFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [replyingTo]);

  // Effect to manage current user and set default name/email if logged in
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      // Removed automatic population of name/email/country here
      // as per new requirement for fields to always be editable.
      // User can now manually fill or it will be empty if not logged in.
    });

    return () => unsubscribe();
  }, []);

  // Fetch IP address and (optionally) pre-fill user data if logged in
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Erro ao obter o endereço IP:', error);
        setIpAddress(null);
      }
    };

    fetchIpAddress();

    // If currentUser exists, you might want to set initial name/email/country here
    // for convenience, but they remain editable.
    if (currentUser) {
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      // setCountry('BR'); // Optionally pre-fill country, but let's keep it manual
    }
  }, [currentUser]);

  // Effect to focus the editor when replyingTo changes
  useEffect(() => {
    if (replyingTo && editorRef.current) {
      if (editorRef.current.focus) {
        editorRef.current.focus();
      } else if (editorRef.current.editor) {
        editorRef.current.editor.focus();
      }
    }
  }, [replyingTo]);

  // Fetch comments from Firestore
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

  // Function to group comments into a tree structure (for replies)
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

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !country.trim() || !stripHtml(comment)) {
      showMessage('Preencha nome, país e comentário.', 'warning');
      return;
    }

    // Check for image upload only if image is present
    if (image && !currentUser) {
      showMessage('Você precisa estar logado para enviar uma imagem.', 'warning');
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
      setComment('');
      setReplyingTo(null);
      setImage(null);
      showMessage('Comentário adicionado com sucesso!', 'success');
    } catch (err) {
      showMessage('Erro ao adicionar comentário: ' + err.message, 'error');
    }
  };

  // Handle comment deletion
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

  // Show Snackbar message
  const showMessage = (msg, type) => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  // Close Snackbar
  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  // Recursively renders comments and their replies
  const renderComment = (comment) => (
    <Card key={comment.id} sx={{ mb: 2, mt: 2, p: 1 }}>
      <CardHeader
        avatar={comment.userPhoto ? <Avatar src={comment.userPhoto} /> : <Avatar><AccountCircle /></Avatar>}
        title={`${comment.name} (${comment.country})`}
        subheader={new Date(comment.timestamp).toLocaleString('pt-BR')}
        action={
          currentUser && (comment.userId === currentUser.uid || currentUser.uid === process.env.REACT_APP_ADMIN_UID) && (
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
            alt="Comentário com imagem"
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
          <Typography component="div" variant="body2">Respondendo a: **{replyingTo.name}**</Typography>
          <Button size="small" onClick={() => setReplyingTo(null)}>Cancelar</Button>
        </Box>
      )}

      <form onSubmit={handleSubmit} ref={commentFormRef}>
        <TextField
          label="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          // Field is now always enabled
        />
        <TextField
          label="E-mail (opcional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          // Field is now always enabled
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <ReactFlagsSelect
            selected={country}
            onSelect={code => setCountry(code)}
            countries={["BR", "US", "FR", "DE", "IN"]}
            customLabels={{ BR: "Brasil", US: "EUA", FR: "França", DE: "Alemanha", IN: "Índia" }}
            showSelectedLabel
            showOptionLabel
            placeholder="Selecione o país"
            // Field is now always enabled
          />
          <FormHelperText>Selecione o país</FormHelperText>
        </FormControl>

        <Box sx={{ mb: 2 }}>
          <Editor onContentChange={setComment} defaultValue={comment} height="250px" editorRef={editorRef} />
        </Box>

        <Box sx={{ position: "relative", mb: 2 }}>
          <input
            accept="image/*"
            type="file"
            onChange={async (e) => {
              if (!currentUser) {
                showMessage('Você precisa estar logado para enviar uma imagem.', 'warning');
                return;
              }
              const file = e.target.files[0];
              if (!file) return;
              const resized = await resizeImage(file);
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