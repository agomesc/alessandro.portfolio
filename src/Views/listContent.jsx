import React, { useState, useEffect, lazy } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

const LinkPreview = lazy(() => import("../Components/LinkPreview"));

const ListContent = () => {
    const [ads, setAds] = useState([]);
    const navigate = useNavigate();

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

    const handleDelete = async (id) => {
        const docRef = doc(db, 'content', id);
        await deleteDoc(docRef);
        setAds(ads.filter((ad) => ad.id !== id));
        setTimeout(() => {
            navigate('/ListContent'); // Alterar para a rota correta de ListContent
        }, 1000);
    };

    const handleAddNew = () => {
        navigate('/FormContent'); // Certifique-se de que essa rota está configurada corretamente
    };

    return (
        <Box sx={{ p: 0, width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" }, height: "auto", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
            <Typography component="div" sx={{ mt: 10, mb: 3 }} variant="subtitle1">
                Seu Guia Afiliado para as Melhores Compras Online!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 3 }}
                onClick={handleAddNew}
            >
                Adicionar Novo
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ad Content</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ads.map((ad) => (
                            <TableRow key={ad.id}>
                                <TableCell component="th" scope="row">
                                    {ad.isLink ? (
                                        <LinkPreview url={ad.text} />
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: ad.text }} />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleDelete(ad.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ListContent;