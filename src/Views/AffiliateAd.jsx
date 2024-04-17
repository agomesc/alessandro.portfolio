import React, { useState, useEffect } from 'react';
import { TextField, Button, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const AffiliateAd = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [open, setOpen] = useState(false);

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


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setMessage('Por favor, faça login para comentar.');
      setSeverity('warning');
      setOpen(true);
      window.location.href = '/Login';
    }

    try {
      await addDoc(collection(db, 'AffiliateAd'), {
        title,
        text,
        createdAt: serverTimestamp(),
        isActive
      });
      console.log('Documento adicionado com sucesso!');
      // Limpar o formulário após o envio
      setTitle('');
      setText('');
      setIsActive(false);
    } catch (error) {
      console.error('Erro ao adicionar documento: ', error);
    }
  };

  return (
    <Box sx={{ p: 0, width: "80%", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
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
        </FormGroup>
        <Button type="submit" variant="contained" color="primary">
          Salvar
        </Button>
      </form>
    </Box>
  );
};

export default AffiliateAd;


