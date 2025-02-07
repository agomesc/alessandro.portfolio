import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Box from "@mui/material/Box";
import { Paper, Typography } from '@mui/material';

const ArticleDetail = () => {
    const { id } = useParams();
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

    return (
        <Box sx={{ pt: 4, width: "100%", margin: "0 auto" }}>
            {article ? (
                <Paper style={{ padding: '20px', margin: '20px' }}>
                    <Typography variant="h6">{article.title}</Typography>
                    <Typography variant="body1">{article.content}</Typography>
                </Paper>
            ) : (
                <Typography variant="body1">Carregando artigo...</Typography>
            )}
        </Box>
    );
};

export default ArticleDetail;
