import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const GalleryList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(db, 'galleries'));
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setItems(data);
        };
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'galleries', id));
            setItems(items.filter((item) => item.id !== id));
            alert('Item deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar item:', error.message);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Lista de Galerias</Typography>
            {items.map((item) => (
                <Box key={item.id} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2">{item.text}</Typography>
                    {item.imagePath && (
                        <Typography variant="body2">
                            <a href={item.imagePath} target="_blank" rel="noopener noreferrer">Ver Imagem</a>
                        </Typography>
                    )}
                    {item.link && (
                        <Typography variant="body2">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">Acessar Link</a>
                        </Typography>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" color="primary" component={Link} to={`/edit/${item.id}`}>
                            Editar
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleDelete(item.id)} sx={{ ml: 2 }}>
                            Excluir
                        </Button>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default GalleryList;