import React, { useState, useEffect, lazy } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Grid, Card, CardContent, Typography, Pagination, Box } from '@mui/material';
import { Link } from "react-router-dom";

const LinkPreview = lazy(() => import('../Components/LinkPreview'));
const TypographyTitle = lazy(() => import('../Components/TypographyTitle'));
const StarComponent = lazy(() => import("../Components/StarComponent"));

const ListContentWithPagination = () => {
    const [ads, setAds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchAds = async () => {
            const querySnapshot = await getDocs(collection(db, 'content'));
            const adsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toLocaleString(),
            }));
            setAds(adsData);
        };

        fetchAds();
    }, []);

    const handlePageChange = (event, value) => {

        event.preventDefault();

        setCurrentPage(value);

    };

    const paginatedAds = ads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Box
            sx={{
                p: 0,
                width: {
                    xs: "100%", // Para telas extra pequenas (mobile)
                    sm: "90%",  // Para telas pequenas
                    md: "80%",  // Para telas médias
                    lg: "70%",  // Para telas grandes
                    xl: "80%"   // Para telas extra grandes
                },
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
                padding: "0 20px",
                mt: 10
            }}
        >
            <TypographyTitle src="Seleção de ofertas"></TypographyTitle>
            <Grid container spacing={3}>
                {paginatedAds.map(ad => (
                    <Grid item xs={12} sm={6} md={3} key={ad.id}>
                        <Card>
                            <CardContent>
                                {ad.isLink ? (
                                    <Link target='_blank' to={ad.text} style={{ textDecoration: 'none' }}>
                                        <LinkPreview url={ad.text} />
                                    </Link>
                                ) : (

                                    <Typography
                                        dangerouslySetInnerHTML={{ __html: ad.text }}
                                        variant="body2"
                                        component="div"
                                    />
                                )}
                                <StarComponent id={ad.id} sx={{ padding: 1, m: 0 }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                    count={Math.ceil(ads.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default ListContentWithPagination;