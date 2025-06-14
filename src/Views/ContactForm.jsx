import React, { useState, lazy,  Suspense } from 'react';
import LoadingMessage from "../Components/LoadingMessage";
import {
  Box,
  TextField,
  Button,
    Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Certifique-se de que este caminho está correto
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));


function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const isValidEmail = (email) => {
    // Regex simples para validação de e-mail
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setSnackbarMessage('Por favor, preencha todos os campos obrigatórios.');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setSnackbarMessage('Por favor, insira um endereço de e-mail válido.');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'contacts'), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: serverTimestamp(), // Adiciona um timestamp do servidor
        read: false, // Campo para indicar se a mensagem foi lida
      });

      setSnackbarMessage('Mensagem enviada com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Limpar o formulário após o envio
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setSnackbarMessage('Erro ao enviar mensagem. Tente novamente mais tarde.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
       <Box
            sx={{
              p: 0,
              width: {
                xs: "100%",
                sm: "90%",
                md: "80%",
                lg: "70%",
                xl: "80%"
              },
              margin: "0 auto",
              padding: "0 20px",
              mt: 10
            }}
          >
             <Suspense fallback={<LoadingMessage />}>
                      <TypographyTitle src="Contatos" />
                    </Suspense>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Seu Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <TextField
          label="Seu E-mail"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          error={!!email && !isValidEmail(email)}
          helperText={!!email && !isValidEmail(email) ? 'E-mail inválido' : ''}
        />
        <TextField
          label="Sua Mensagem"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, width: 250 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Mensagem'}
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactForm;