import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { TextField, Button, Box, Typography, Switch, FormControlLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditGallery = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [link, setLink] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, 'galleries', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTitle(data.title || '');
                setText(data.text || ''); // Atualiza o estado de texto
                setImagePath(data.imagePath || '');
                setLink(data.link || '');
                setIsActive(data.isActive || false);
            } else {
                console.error('Nenhum documento encontrado!');
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const docRef = doc(db, 'galleries', id);
            await updateDoc(docRef, {
                title,
                text, // Inclui o texto formatado
                imagePath,
                link,
                isActive,
            });
            alert('Dados atualizados com sucesso!');
            navigate('/list');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error.message);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
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
                    <Typography variant="subtitle1">Descrição</Typography>
                    <ReactQuill value={text} onChange={setText} />
                </Box>
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
                <FormControlLabel
                    control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                    label="Ativo"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Salvar Alterações
                </Button>
            </form>
        </Box>
    );
};

export default React.memo(EditGallery);