import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TextField, Button, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

const Editor = lazy(() => import("../Components/Editor")); // Ajuste do caminho

const ImagePathForm = () => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [text, setText] = useState(''); // Estado para o conteúdo do editor
    const [isActive, setIsActive] = useState(true);
    const [imagePath, setImagePath] = useState('');
    const [link, setLink] = useState(''); // Novo estado para o campo "link"
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
                text, // Agora armazena o texto formatado
                createdAt: serverTimestamp(),
                isActive,
                imagePath,
                link,
                userId: user.uid,
            };
            await addDoc(collection(db, 'galleries'), docData);

            setTitle('');
            setText('');
            setIsActive(true);
            setImagePath('');
            setLink('');
            setMessage('Informações adicionadas com sucesso!');
            setSeverity('success');
            setOpen(true);
            navigate('/list');
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
                Passar Caminho da Imagem e Link
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Título da Imagem"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Suspense fallback={<div>Carregando Editor...</div>}>
                    <Editor onContentChange={(value) => setText(value)} />
                </Suspense>
                <TextField
                    label="Caminho da Imagem"
                    variant="outlined"
                    value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Link"
                    variant="outlined"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                {imagePath && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Link Imagem: <a href={imagePath} target="_blank" rel="noopener noreferrer">{title || "Ver Imagem"}</a>
                        </Typography>
                    </Box>
                )}
                {link && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Link: <a href={link} target="_blank" rel="noopener noreferrer">{title || "Acessar Link"}</a>
                        </Typography>
                    </Box>
                )}
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                        label="Ativo"
                    />
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

export default React.memo(ImagePathForm);