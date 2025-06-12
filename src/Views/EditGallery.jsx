import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Não precisamos mais do 'storage'
import {
    TextField, Button, Box, Typography, Switch, FormControlLabel, Snackbar, Alert
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAuth } from 'firebase/auth';

// Adicione a função resizeImage aqui (ou importe-a de um arquivo de utilidades)
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

const EditGallery = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    // originalImageUrl agora guarda a string Base64 do Firestore
    const [originalImageUrl, setOriginalImageUrl] = useState(null);
    // newImageBase64 guarda a string Base64 da nova imagem selecionada
    const [newImageBase64, setNewImageBase64] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // Para pré-visualização
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

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                showSnackbar('ID da galeria ausente na URL.', 'error');
                navigate('/list');
                return;
            }
            try {
                const docRef = doc(db, 'galleries', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title || '');
                    setText(data.text || '');
                    setOriginalImageUrl(data.image || null); // Agora será uma string Base64 ou null
                    setImagePreview(data.image || null); // Initialize preview with existing Base64 image
                    setLink(data.link || '');
                    setIsActive(data.isActive || false);
                } else {
                    showSnackbar('Galeria não encontrada!', 'error');
                    navigate('/list');
                }
            } catch (error) {
                console.error('Erro ao buscar galeria:', error.message);
                showSnackbar(`Erro ao carregar galeria: ${error.message}`, 'error');
            }
        };
        fetchData();
    }, [id, navigate]);

    // Handle new image file selection and resize to Base64
    const handleImageChange = async (e) => {
        if (!currentUser) {
            showSnackbar('Você precisa estar logado para enviar uma imagem.', 'warning');
            e.target.value = '';
            return;
        }

        const file = e.target.files[0];
        if (file) {
            try {
                // Redimensiona e converte para Base64 imediatamente
                const resizedBase64 = await resizeImage(file, 600, 400); // Ajuste max width/height conforme necessário
                setNewImageBase64(resizedBase64); // Guarda a nova imagem em Base64
                setImagePreview(resizedBase64); // Atualiza a pré-visualização
            } catch (error) {
                console.error('Erro ao redimensionar imagem:', error);
                showSnackbar('Erro ao processar imagem. Tente novamente.', 'error');
                setNewImageBase64(null);
                setImagePreview(originalImageUrl || null);
            }
        } else {
            setNewImageBase64(null);
            setImagePreview(originalImageUrl || null); // Reverte para a imagem original se a seleção for cancelada
        }
    };

    // Handle image removal
    const handleRemoveImage = () => {
        setNewImageBase64(null); // Clear any newly selected Base64 image
        setOriginalImageUrl(null); // Clear the original Base64 image URL from state
        setImagePreview(null); // Clear the preview
        // Se precisar limpar o input file visualmente:
        const fileInput = document.getElementById('gallery-image-input');
        if (fileInput) fileInput.value = '';
    };

    // Handle form submission for update
    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!currentUser) {
            showSnackbar('Você precisa estar logado para atualizar a galeria.', 'warning');
            return;
        }

        try {
            // finalImageUrl será a nova Base64, a original Base64 ou null
            let finalImageUrl = newImageBase64 !== null ? newImageBase64 : originalImageUrl;

            // Se o usuário clicou em remover E não selecionou uma nova imagem, finalImageUrl deve ser null
            if (newImageBase64 === null && originalImageUrl === null) {
                finalImageUrl = null;
            }

            const docRef = doc(db, 'galleries', id);

            await updateDoc(docRef, {
                title,
                text,
                image: finalImageUrl, // Salva a string Base64 ou null diretamente
                link,
                isActive,
            });

            showSnackbar('Dados da galeria atualizados com sucesso!', 'success');
            setTimeout(() => navigate('/list'), 1500);

        } catch (error) {
            console.error('Erro geral ao tentar atualizar galeria:', error);
            let userMessage = 'Erro ao atualizar dados da galeria.';
            if (error.message) {
                userMessage = `Erro ao atualizar dados: ${error.message}`;
            }
            showSnackbar(userMessage, 'error');
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{
            p: 0,
            width: {
                xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%"
            },
            margin: "0 auto",
            padding: "0 20px",
            mt: 10
        }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Editar Galeria</Typography>

            <form onSubmit={handleUpdate}>
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
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Atualizar Imagem</Typography>
                    <input
                        id="gallery-image-input" // Adicione um ID para referenciar no handleRemoveImage
                        accept="image/*"
                        type="file"
                        onChange={handleImageChange} // Use o novo handler
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <Box mt={2}>
                            <Typography variant="body2">Pré-visualização:</Typography>
                            <img
                                src={imagePreview} // Será a string Base64
                                alt="Pré-visualização"
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                        </Box>
                    )}

                    {/* Remove Image Button - show if there's any image to remove */}
                    {(newImageBase64 || originalImageUrl) && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleRemoveImage}
                            sx={{ mt: 1 }}
                        >
                            Remover Imagem
                        </Button>
                    )}
                </Box>

                <TextField
                    label="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <FormControlLabel
                    control={
                        <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    }
                    label="Ativo"
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Salvar Alterações
                </Button>
            </form>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default React.memo(EditGallery);