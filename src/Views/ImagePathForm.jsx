import React, { useState,Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { TextField, Button, Box, Typography, Switch, FormControlLabel, Snackbar, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Skeleton from '@mui/material/Skeleton';

const CreateGallery = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [link, setLink] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleCreate = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, 'galleries'), {
                title,
                text,
                imagePath,
                link,
                isActive,
            });

            setSnackbarMessage('Galeria criada com sucesso!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate('/list');
            }, 1500);
        } catch (error) {
            setSnackbarMessage(`Erro ao criar galeria: ${error.message}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
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
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
                padding: "0 20px",
                mt: 10
            }}
        >
            <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
                <Typography variant="h5" sx={{ mb: 3 }}>Criar Galeria</Typography>
            </Suspense>

            <form onSubmit={handleCreate}>
                <TextField label="Título" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1">Descrição</Typography>
                    <ReactQuill value={text} onChange={setText} />
                </Box>
                <TextField label="Caminho da Imagem" variant="outlined" value={imagePath} onChange={(e) => setImagePath(e.target.value)} fullWidth margin="normal" />
                <TextField label="Link" variant="outlined" value={link} onChange={(e) => setLink(e.target.value)} fullWidth margin="normal" />
                <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Ativo" />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Criar
                </Button>
            </form>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default React.memo(CreateGallery);
