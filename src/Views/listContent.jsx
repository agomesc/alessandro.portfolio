import { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import {
  Grid, Paper, IconButton, Button, Snackbar, Alert, Typography, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

const LinkPreview = lazy(() => import("../Components/LinkPreview"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));

const ListContent = () => {
  const [ads, setAds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(6); // define quantos cards por página

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
    try {
      await deleteDoc(doc(db, 'content', id));
      setAds(prev => prev.filter(ad => ad.id !== id));
      setSnackbarMessage('Conteúdo deletado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Erro ao deletar conteúdo: ' + error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAddNew = () => {
    navigate('/FormContent');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const paginatedAds = ads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleNextPage = () => {
    if ((page + 1) * rowsPerPage < ads.length) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  return (
    <Box sx={{ p: 2, maxWidth: "1200px", margin: "0 auto" }}>
      <Suspense fallback={<CustomSkeleton />}>
        <Typography variant="subtitle1" sx={{ mt: 10, mb: 3 }}>
          Seu Guia Afiliado para as Melhores Compras Online!
        </Typography>
      </Suspense>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={handleAddNew}
      >
        Adicionar Novo
      </Button>

      <Grid container spacing={2}>
        {paginatedAds.map(ad => (
          <Grid item xs={12} sm={6} key={ad.id}>
            <Suspense fallback={<CustomSkeleton />}>
              <Paper sx={{ p: 2, position: 'relative' }}>
                <IconButton
                  onClick={() => handleDelete(ad.id)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
                {ad.isLink ? (
                  <LinkPreview url={ad.text} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: ad.text }} />
                )}
                <Typography variant="caption" color="text.secondary">
                  {ad.createdAt}
                </Typography>
              </Paper>
            </Suspense>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button disabled={page === 0} onClick={handlePrevPage}>
          Página anterior
        </Button>
        <Button disabled={(page + 1) * rowsPerPage >= ads.length} onClick={handleNextPage}>
          Próxima página
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListContent;
