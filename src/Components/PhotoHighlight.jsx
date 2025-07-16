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
    navigate('/featuredPhotos');
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
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando a imagem...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        // Adjust width for a wider look, remove horizontal padding from theme
        width: "100%",
        maxWidth: "none", // Remove max-width constraint
        p: 0, // Remove padding to allow content to span wider
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto", // Keep auto margins for centering if maxWidth is applied elsewhere
        // You might want to adjust mt or pt if this section is at the very top
        mt: theme.customSpacing.sectionMarginTop,
      })}
    >
      {randomPhoto ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%', // Ensure it takes full width of its parent
            paddingTop: { xs: '56.25%', md: '42.85%', lg:'30.85%', xl:'20.85%' }, // 16:9 e 21:9 aspect ratios
            borderRadius: 0,
            overflow: 'hidden',
            // --- Highlight effect: subtle box-shadow and a border-top ---
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', // Soft shadow for depth
            borderTop: '5px solid', // A subtle top border for a "highlight"
            borderColor: 'secondary.main', // Using your theme's secondary color
          }}
        >
          {/* Background da imagem */}
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${randomPhoto.imageUrl})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: { xs: 'scroll', md: 'fixed' },
              zIndex: 1,
              transition: 'filter 1s ease-in-out',
              '&:hover': {
                filter: 'blur(0px)',
              },
              aspectRatio: '16 / 9',
            }}
          />

          {/* Overlay escuro */}
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(2, 2, 2, 0.15)',
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
            <Typography component="div" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Destaque da Galeria
            </Typography>
            <Typography component="div" variant="subtitle1" sx={{ mb: 3 }}>
              Uma foto escolhida aleatoriamente para te inspirar.
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
          <Typography component="div" variant="h6" sx={{ ml: 2 }}>Carregando a imagem...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(App);