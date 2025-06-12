import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // 'storage' removido
import { TextField, Button, Box, Typography, Switch, FormControlLabel, Snackbar, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAuth } from 'firebase/auth';

// Função auxiliar para redimensionar a imagem e convertê-la para Base64
// Esta função é a mesma que você usa no CommentBox e EditGallery
const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                let width = img.width;
                let height = img.height;

                // Calcula as novas dimensões mantendo a proporção
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

                // Converte o canvas para uma string Base64 (JPEG com qualidade 0.8)
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(resizedBase64);
            };
            img.onerror = reject; // Trata erros ao carregar a imagem
            img.src = event.target.result; // Define a fonte da imagem como o resultado da leitura do arquivo
        };
        reader.onerror = reject; // Trata erros ao ler o arquivo
        reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados (Base64)
    });
};

const CreateGallery = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    // Agora 'imageBase64' armazenará a string Base64 da imagem selecionada
    const [imageBase64, setImageBase64] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // Para pré-visualização da imagem
    const [link, setLink] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Função para exibir as mensagens no Snackbar
    const showSnackbar = (msg, severity) => {
        setSnackbarMessage(msg);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    // Lida com a mudança no input de arquivo, redimensionando e convertendo para Base64
    const handleImageChange = async (e) => {
        if (!currentUser) {
            showSnackbar('Você precisa estar logado para enviar uma imagem.', 'warning');
            e.target.value = ''; // Limpa o input de arquivo
            return;
        }

        const file = e.target.files[0];
        if (file) {
            try {
                // Redimensiona e converte para Base64 imediatamente
                // Ajuste maxWidth e maxHeight conforme a necessidade do seu projeto
                const resizedBase64 = await resizeImage(file, 600, 400);
                setImageBase64(resizedBase64); // Armazena a string Base64
                setImagePreview(resizedBase64); // Atualiza a pré-visualização
            } catch (error) {
                console.error('Erro ao processar imagem:', error);
                showSnackbar('Erro ao processar imagem. Tente novamente.', 'error');
                setImageBase64(null);
                setImagePreview(null);
            }
        } else {
            // Se nenhum arquivo for selecionado (e.g., usuário cancela a seleção), limpa os estados da imagem
            setImageBase64(null);
            setImagePreview(null);
        }
    };

    // Lida com o envio do formulário
    const handleCreate = async (event) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        // Verifica se o usuário está logado
        if (!currentUser) {
            showSnackbar('Você precisa estar logado para criar uma galeria.', 'warning');
            return;
        }

        try {
            // Adiciona os dados da galeria ao Firestore
            // A imagem (string Base64) é salva diretamente no campo 'image'
            await addDoc(collection(db, 'galleries'), {
                title,
                text,
                image: imageBase64, // 'imageBase64' já contém a imagem redimensionada ou null
                link,
                isActive,
                createdAt: serverTimestamp() // Usa o timestamp do servidor para consistência
            });

            showSnackbar('Galeria criada com sucesso!', 'success');

            // Navega para a página de lista após um pequeno atraso
            setTimeout(() => {
                navigate('/list');
            }, 1500);
        } catch (error) {
            console.error('Erro ao criar galeria:', error);
            showSnackbar(`Erro ao criar galeria: ${error.message}`, 'error');
        }
    };

    // Lida com o fechamento do Snackbar
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
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Carregar Imagem</Typography>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleImageChange} // Usa o handler que converte para Base64
                    />
                    {imagePreview && (
                        <Box mt={2}>
                            <Typography variant="body2">Pré-visualização da imagem:</Typography>
                            <img src={imagePreview} alt="Pré-visualização" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
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
