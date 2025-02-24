import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinkPreview from '../Components/LinkPreview';

const ListContent = () => {
    const [ads, setAds] = useState([]);

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
        // Atualiza o estado local após a exclusão
        setAds(ads.filter((ad) => ad.id !== id));
    };

    return (
        <Box sx={{ p: 0, width: "80%", height: "auto", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
            <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
                Seu Guia Afiliado para as Melhores Compras Online!
            </Typography>
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
