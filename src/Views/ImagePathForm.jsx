import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { TextField, Button, Box, Typography, Switch, FormControlLabel, Snackbar, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAuth } from 'firebase/auth';

// --- Função auxiliar para redimensionar a imagem e convertê-la para Base64 ---
// Ajustado para redimensionar a 240x240 e usar qualidade JPEG 0.5
const resizeImage = (file) => { // Removi os parâmetros maxWidth e maxHeight daqui, pois serão fixos
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                let width = img.width;
                let height = img.height;

                // Definindo as dimensões máximas fixas
                const maxWidth = 240;
                const maxHeight = 240;

                // Calcula as novas dimensões mantendo a proporção, sem exceder 240x240
                if (width > maxWidth || height > maxHeight) {
                    const scale = Math.min(maxWidth / width, maxHeight / height);
                    width *= scale;
                    height *= scale;
                }

                // Cria um canvas e desenha a imagem redimensionada
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Converte o canvas para uma string Base64 (JPEG com qualidade 0.5)
                // Uma qualidade menor (0.5) ajuda a reduzir o tamanho do arquivo
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.5); // Qualidade ajustada
                resolve(resizedBase64);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const CreateGallery = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [imageBase64, setImageBase64] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [link, setLink] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const showSnackbar = (msg, severity) => {
        setSnackbarMessage(msg);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    // Lida com a mudança no input de arquivo, redimensionando e convertendo para Base64
    const handleImageChange = async (e) => {
        if (!currentUser) {
            showSnackbar('Você precisa estar logado para enviar uma imagem.', 'warning');
            e.target.value = '';
            return;
        }

        const file = e.target.files[0];
        if (file) {
            try {
                // Chama resizeImage sem passar maxWidth e maxHeight, pois agora são fixos na função
                const resizedBase64 = await resizeImage(file);
                setImageBase64(resizedBase64);
                setImagePreview(resizedBase64);
                // Opcional: Log para verificar o tamanho da imagem em KB
                console.log('Tamanho da imagem Base64:', (resizedBase64.length / 1024).toFixed(2), 'KB');
            } catch (error) {
                console.error('Erro ao processar imagem:', error);
                showSnackbar('Erro ao processar imagem. Tente novamente.', 'error');
                setImageBase64(null);
                setImagePreview(null);
            }
        } else {
            setImageBase64(null);
            setImagePreview(null);
        }
    };

    const handleCreate = async (event) => {
        event.preventDefault();

        if (!currentUser) {
            showSnackbar('Você precisa estar logado para criar uma galeria.', 'warning');
            return;
        }

        try {
            await addDoc(collection(db, 'galleries'), {
                title,
                text,
                image: imageBase64,
                link,
                isActive,
                createdAt: serverTimestamp()
            });

            showSnackbar('Galeria criada com sucesso!', 'success');

            setTimeout(() => {
                navigate('/list');
            }, 1500);
        } catch (error) {
            console.error('Erro ao criar galeria:', error);
            // Mensagem de erro mais útil se for um problema de tamanho/rede
            showSnackbar(`Erro ao criar galeria: ${error.message}. A imagem pode ser muito grande.`, 'error');
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
                margin: "0 auto",
                padding: "0 20px",
                mt: 10
            }}
        >
            <Typography variant="h5" sx={{ mb: 3 }}>Criar Galeria</Typography>

            <form onSubmit={handleCreate}>
                <TextField
                    label="Título"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Descrição</Typography>
                    <ReactQuill value={text} onChange={setText} />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Carregar Imagem (Max. 240x240)</Typography>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <Box mt={2}>
                            <Typography variant="body2">Pré-visualização da imagem:</Typography>
                            <img src={imagePreview} alt="Pré-visualização" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </Box>
                    )}
                </Box>

                <TextField
                    label="Link Opcional"
                    variant="outlined"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <FormControlLabel
                    control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                    label="Ativo"
                />

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Criar Galeria
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