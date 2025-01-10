import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { Box, Button, TextField, Paper } from '@mui/material';

const ArticleForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                const docRef = doc(db, 'articles', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTitle(docSnap.data().title);
                    setContent(docSnap.data().content);
                }
            };

            fetchArticle();
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const articleData = { title, content, createdAt: new Date() };

        try {
            if (id) {
                await setDoc(doc(db, 'articles', id), articleData);
            } else {
                await addDoc(collection(db, 'articles'), articleData);
            }
            history.push('/');
        } catch (error) {
            console.error('Erro ao salvar o artigo:', error);
        }
    };

    return (
        <Box sx={{ pt: 4, width: "80%", margin: "0 auto" }}>
            <Paper style={{ padding: '20px', margin: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Conteúdo"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {id ? 'Atualizar' : 'Criar'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ArticleForm;
