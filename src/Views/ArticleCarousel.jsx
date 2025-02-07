import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import Box from "@mui/material/Box";
import { Paper, Typography } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ArticleCarousel = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            const querySnapshot = await getDocs(collection(db, 'articles'));
            const articlesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toLocaleString()
            }));
            setArticles(articlesData);
        };

        fetchArticles();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Box sx={{ pt: 4, width: "100%", margin: "0 auto" }}>
            <Slider {...settings}>
                {articles.map((article) => (
                    <Box key={article.id} sx={{ p: 2 }}>
                        <Link to={`/article/${article.id}`} style={{ textDecoration: 'none' }}>
                            <Paper style={{ padding: '20px', margin: '20px' }}>
                                <Typography variant="h6">{article.title}</Typography>
                                <Typography variant="body1">{article.content}</Typography>
                            </Paper>
                        </Link>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default ArticleCarousel;
