import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import Box from "@mui/material/Box";
import { Paper, Typography, Button } from '@mui/material';

const ArticleDetaiList = () => {
    const { id } = useParams();
    const history = useHistory();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            const docRef = doc(db, 'articles', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setArticle({ id: docSnap.id, ...docSnap.data() });
            }
        };

        fetchArticle();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'articles', id));
            history.push('/');
        } catch (error) {
            console.error('Erro ao deletar o artigo:', error);
        }
    };

    return (
        <Box sx={{ pt: 4, width: "80%", margin: "0 auto" }}>
            {article ? (
                <Paper style={{ padding: '20px', margin: '20px' }}>
                    <Typography variant="h6">{article.title}</Typography>
                    <Typography variant="body1">{article.content}</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                        style={{ marginTop: '20px' }}
                    >
                        Deletar
                    </Button>
                </Paper>
            ) : (
                <Typography variant="body1">Carregando artigo...</Typography>
            )}
        </Box>
    );
};

export default ArticleDetaiList;
