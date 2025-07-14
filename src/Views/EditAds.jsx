import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
    TextField, Button, Box, Typography, Switch, FormControlLabel, Snackbar, Alert
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAuth } from 'firebase/auth';
import { resizeImage } from '../shared/Util';

const App = () => {
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
                navigate('/listAds');
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
                    setImagePreview(data.image || null); // Inicializa preview com a imagem existente
                    setLink(data.link || '');
                    setIsActive(data.isActive || false);
                } else {
                    showSnackbar('Galeria não encontrada!', 'error');
                    navigate('/listAds');
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
                // Chama resizeImage sem passar maxWidth e maxHeight, pois agora são fixos na função
                const resizedBase64 = await resizeImage(file);
                setNewImageBase64(resizedBase64); // Guarda a nova imagem em Base64
                setImagePreview(resizedBase64); // Atualiza a pré-visualização
                // Opcional: Log para verificar o tamanho da imagem em KB
                console.log('Tamanho da nova imagem Base64:', (resizedBase64.length / 1024).toFixed(2), 'KB');
            } catch (error) {
                console.error('Erro ao redimensionar imagem:', error);
                showSnackbar('Erro ao processar imagem. Tente novamente.', 'error');
                setNewImageBase64(null);
                setImagePreview(originalImageUrl || null); // Reverte para a imagem original no erro
            }
        } else {
            // Se nenhum arquivo for selecionado (e.g., usuário cancela a seleção no diálogo),
            // a pré-visualização deve voltar para a imagem original (se houver)
            // e newImageBase64 deve ser limpo.
            setNewImageBase64(null);
            setImagePreview(originalImageUrl || null);
        }
    };

    // Handle image removal
    const handleRemoveImage = () => {
        setNewImageBase64(null); // Limpa qualquer nova imagem selecionada
        setOriginalImageUrl(null); // Limpa a imagem original (Base64 do Firestore)
        setImagePreview(null); // Limpa a pré-visualização
        // Limpa o input file visualmente para que o usuário possa selecionar o mesmo arquivo novamente, se quiser
        const fileInput = document.getElementById('gallery-image-input');
        if (fileInput) fileInput.value = '';
        showSnackbar('Imagem removida com sucesso!', 'info');
    };

    // Handle form submission for update
    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!currentUser) {
            showSnackbar('Você precisa estar logado para atualizar a galeria.', 'warning');
            return;
        }

        try {
            const docRef = doc(db, 'galleries', id);

            // Determina qual imagem será salva:
            // 1. Se uma nova imagem foi selecionada, use newImageBase64.
            // 2. Se nenhuma nova imagem foi selecionada, mas havia uma original, use originalImageUrl.
            // 3. Se a imagem foi removida (ambos null), salve null.
            const imageToSave = newImageBase64 !== null ? newImageBase64 : originalImageUrl;

            await updateDoc(docRef, {
                title,
                text,
                image: imageToSave, // Salva a string Base64 ou null diretamente
                link,
                isActive,
            });

            showSnackbar('Dados da galeria atualizados com sucesso!', 'success');
            setTimeout(() => navigate('/listAds'), 1500);

        } catch (error) {
            console.error('Erro geral ao tentar atualizar galeria:', error);
            let userMessage = 'Erro ao atualizar dados da galeria.';
            // Mensagem de erro mais útil se for um problema de tamanho/rede
            if (error.message && error.message.includes('Function Document.prototype.update() called with invalid data.')) {
                userMessage = 'Erro: A imagem pode ser muito grande ou os dados são inválidos. Tente uma imagem menor.';
            } else if (error.message) {
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
        <Box
            sx={(theme) => ({
                p: 0,
                width: {
                    xs: "100%",
                    sm: "90%",
                    md: "80%",
                    lg: "70%",
                    xl: "80%",
                },
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
                padding: theme.customSpacing.pagePadding,
                mt: theme.customSpacing.sectionMarginTop,
            })}
        >
            <Typography component="div" variant="h5" sx={{ mb: 3 }}>Editar Galeria</Typography>

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
                    <Typography component="div" variant="subtitle1" sx={{ mb: 1 }}>Descrição</Typography>
                    <ReactQuill value={text} onChange={setText} />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography component="div" variant="subtitle1" sx={{ mb: 1 }}>Atualizar Imagem (Max. 640x640)</Typography>
                    <input
                        id="gallery-image-input" // Adicione um ID para referenciar no handleRemoveImage
                        accept="image/*"
                        type="file"
                        onChange={handleImageChange}
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <Box mt={2}>
                            <Typography component="div" variant="body2">Pré-visualização:</Typography>
                            <img
                                src={imagePreview} // Será a string Base64
                                alt="Pré-visualização"
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #ddd' }}
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

export default React.memo(App);