import React, { useMemo, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import { auth, db } from '../firebaseConfig';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import LazyImage from "./LazyImage"; // Assuming LazyImage handles actual <img> tag rendering and lazy loading

const App = () => {
  const [images, setImages] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

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
      if (authUnsubscribe) {
        authUnsubscribe();
      }
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
        width: '100%',
        height: { xs: '200px', md: '400px', lg: '600px', xl: '800px' },
        position: 'relative',
        overflow: 'hidden',
        mt: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        cursor: 'default',
      }}
    >
      {randomPhoto ? (
        <LazyImage
          src={randomPhoto.imageUrl}
          alt={randomPhoto.description || 'Imagem aleatória'} // Assuming a description field, or provide a default alt text
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', 
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      ) : (
        <Typography variant="h6">Nenhuma imagem disponível.</Typography>
      )}
    </Box>
  );
};

export default React.memo(App);