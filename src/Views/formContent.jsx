import React, { useState, useEffect } from 'react';
import { TextField, Button, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const FormContent = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLink, setIsLink] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setMessage('Por favor, faça login para postar.');
      setSeverity('warning');
      setOpen(true);
      window.location.href = '/Login';
      return;
    }

    try {
      await addDoc(collection(db, 'content'), {
        title,
        text,
        createdAt: serverTimestamp(),
        isActive,
        isLink, // Inclui o novo campo
      });

      setTitle('');
      setText('');
      setIsActive(true);
      setIsLink(false); // Resetar o campo após salvar
      setMessage('Postagem adicionada com sucesso!');
      setSeverity('success');
      setOpen(true);
    } catch (error) {
      console.error('Erro ao adicionar postagem:', error.message);
      setMessage(`Erro ao adicionar postagem: ${error.message}`);
      setSeverity('error');
      setOpen(true);
    }
  };

  return (
    <Box sx={{ p: 0, width: "90%", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
      <Typography sx={{ mt: 10, mb: 3 }} variant="subtitle1">
        Minhas Galerias
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Título"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Texto"
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
            label="Ativo"
          />
          <FormControlLabel
            control={<Switch checked={isLink} onChange={(e) => setIsLink(e.target.checked)} />}
            label="É um link?"
          />
        </FormGroup>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Salvar
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormContent;
