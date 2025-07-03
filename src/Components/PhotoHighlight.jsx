import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import { auth, db } from '../firebaseConfig';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';


const App = () => {
  const [images, setImages] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let authUnsubscribe;

    const initAuth = async () => {
      if (!auth.currentUser && typeof window.__initial_auth_token !== 'undefined') {
        try {
          await signInWithCustomToken(auth, window.__initial_auth_token);
        } catch (error) {
          console.error('Erro ao tentar login com token customizado:', error);
        }
      }

      authUnsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            await signInAnonymously(auth);
            setUserId(auth.currentUser?.uid || crypto.randomUUID());
          } catch (anonError) {
            console.error('Erro ao tentar login anônimo:', anonError);
            setUserId(crypto.randomUUID());
          }
        }
        setIsAuthReady(true);
      });
    };

    initAuth();

    return () => {
      if (authUnsubscribe) authUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthReady || !userId) return;

    const imagesCollectionRef = collection(db, 'images');
    const q = query(imagesCollectionRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imageList);
    }, (error) => {
      console.error("Erro ao buscar imagens:", error);
    });

    return () => unsubscribe();
  }, [isAuthReady, userId]);


   const handleVerMais = () => {
      navigate('/gallery'); // ou qualquer outra rota que você queira
    };

  const randomPhoto = useMemo(() => {
    if (!images || images.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }, [images]);

  if (!isAuthReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', backgroundColor: '#f0f0f0' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>A carregar imagens...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%" },
        margin: "0 auto",
        px: 2,
        mt: 10,
        pb: 5
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#78884c' }}>
        Imagem Aleatória
      </Typography>

      {randomPhoto ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: { xs: '56.25%', md: '42.85%' }, // 16:9 e 21:9
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Background da imagem */}
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${randomPhoto.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: { xs: 'scroll', md: 'fixed' },
              zIndex: 1
            }}
          />

          {/* Overlay escuro */}
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              zIndex: 2
            }}
          />

          {/* Legenda e botão */}
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              textAlign: 'center',
              px: 2,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Destaque da Galeria
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Uma imagem escolhida aleatoriamente para te inspirar
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: '20px', px: 4 }}
              onClick={handleVerMais}
            >
              Ver mais
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', backgroundColor: '#f0f0f0' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>A carregar imagens...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(App);
