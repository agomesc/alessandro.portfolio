import React, { useState, useEffect } from 'react';
import { TextField, Button, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

const ImagePathForm = () => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [imagePath, setImagePath] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

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
            navigate('/Login');
            return;
        }

        try {
            const docData = {
                title,
                text,
                createdAt: serverTimestamp(),
                isActive,
                imagePath,
                userId: user.uid,
            };
            await addDoc(collection(db, 'galleries'), docData);

            setTitle('');
            setText('');
            setIsActive(true);
            setImagePath('');
            setMessage('Informações adicionadas com sucesso!');
            setSeverity('success');
            setOpen(true);
            navigate('/ListGalleries');
        } catch (error) {
            console.error('Erro ao adicionar galeria:', error.message);
            setMessage(`Erro ao adicionar galeria: ${error.message}`);
            setSeverity('error');
            setOpen(true);
        }
    };

    return (
        <Box sx={{ p: 0, width: "90%", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
            <Typography sx={{ mt: 10, mb: 3 }} variant="subtitle1">
                Passar Caminho da Imagem
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField label="Título da Imagem" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
                <TextField label="Descrição" variant="outlined" value={text} onChange={(e) => setText(e.target.value)} multiline rows={2} fullWidth margin="normal" />
                <TextField label="Caminho da Imagem" variant="outlined" value={imagePath} onChange={(e) => setImagePath(e.target.value)} fullWidth margin="normal" />
                <FormGroup>
                    <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Ativo" />
                </FormGroup>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Salvar Informações
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

export default ImagePathForm;