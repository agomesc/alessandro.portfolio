import React, { useState, useEffect } from 'react';
import { TextField, Button, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from '../firebaseConfig'; // Import storage
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

const ImageUploadForm = () => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
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

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
            setImageUrl('');
        }
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

        let downloadURL = '';
        if (selectedFile) {
            const storageRef = ref(storage, `images/${selectedFile.name}`);
            try {
                await uploadBytes(storageRef, selectedFile);
                downloadURL = await getDownloadURL(storageRef);
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error);
                setMessage(`Erro ao fazer upload da imagem: ${error.message}`);
                setSeverity('error');
                setOpen(true);
                return; // Stop further processing if image upload fails
            }
        }

        try {
            const docData = {
                title,
                text,
                createdAt: serverTimestamp(),
                isActive,
                isLink: false, // Always false for this component as it's for image upload
                imageUrl: downloadURL,
                userId: user.uid, // Assuming you want to store the user who uploaded
            };
            await addDoc(collection(db, 'galleries'), docData); // Save to a different collection 'galleries'

            setTitle('');
            setText('');
            setIsActive(true);
            setSelectedFile(null);
            setImageUrl('');
            setMessage('Imagem e informações adicionadas com sucesso!');
            setSeverity('success');
            setOpen(true);
            navigate('/ListGalleries'); // Assuming you'll create a ListGalleries component
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
                Upload de Imagem
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
                <TextField
                    label="Descrição"
                    variant="outlined"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                    margin="normal"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ margin: '16px 0' }}
                />
                {imageUrl && (
                    <Box mt={2}>
                        <Typography variant="caption">Imagem selecionada:</Typography>
                        <img src={imageUrl} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', display: 'block', marginTop: '8px' }} />
                    </Box>
                )}
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                        label="Ativo"
                    />
                </FormGroup>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Salvar Imagem
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

export default ImageUploadForm;