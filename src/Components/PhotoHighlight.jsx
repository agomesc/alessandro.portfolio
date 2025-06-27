import React, { useMemo, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { auth, db } from '../firebaseConfig';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// Componente LazyImage movido para dentro do mesmo arquivo para resolver o erro de resolução de módulo
const LazyImage = ({ src, alt, width, height, sx, showLoaderAndError = true }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reinicia o estado se o 'src' mudar
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  // Exibe um placeholder se o 'src' não for fornecido
  if (!src) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: width,
          height: height,
          backgroundColor: '#e0e0e0',
          color: 'text.secondary',
          ...sx,
        }}
      >
        <Typography component="div" variant="caption">Sem Imagem</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Mostra um indicador de carregamento enquanto a imagem não está carregada e não há erro */}
      {showLoaderAndError && !loaded && !error && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: width,
            height: height,
            backgroundColor: '#f0f0f0',
            ...sx,
          }}
        >
          <CircularProgress size={30} />
        </Box>
      )}
      {/* A imagem em si, visível apenas quando carregada e sem erros */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: width,
          height: height,
          objectFit: 'cover', // Garante que a imagem cubra a área sem distorção
          display: loaded && !error ? 'block' : 'none', // Oculta até carregar ou se houver erro
          ...sx,
        }}
      />
      {/* Mostra uma mensagem de erro se o carregamento da imagem falhar */}
      {showLoaderAndError && error && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: width,
            height: height,
            backgroundColor: '#ffdddd',
            color: 'error.main',
            ...sx,
          }}
        >
          <Typography variant="caption">Erro ao carregar imagem</Typography>
        </Box>
      )}
    </>
  );
};

// Componente para exibir uma única foto aleatória em destaque
const App = () => {
  const [images, setImages] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false); // State for popup visibility

  // 1. Autenticação Firebase e Configuração do Listener
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
            setUserId(crypto.randomUUID()); // Fallback UUID
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

  // 2. Escuta por mudanças nas imagens do Firestore
  useEffect(() => {
    if (!isAuthReady || !userId) {
      return;
    }

    const imagesCollectionRef = collection(db, 'images');
    const q = query(
      imagesCollectionRef,
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imageList);
    }, (error) => {
      console.error("Erro ao buscar imagens:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthReady, userId]);

  // Usa useMemo para selecionar uma foto aleatória apenas uma vez por renderização
  const randomPhoto = useMemo(() => {
    if (!images || images.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }, [images]);

  // Handler to open the popup
  const handleOpenPopup = () => {
    if (randomPhoto) {
      setOpenPopup(true);
    }
  };

  // Handler to close the popup
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  // Exibe um carregador enquanto a autenticação e os dados não estão prontos
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
        maxWidth: '2048px',
        margin: '0 auto',
        height: '600px',
        position: 'relative',
        overflow: 'hidden',
        mt: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: randomPhoto ? `url(${randomPhoto.imageUrl})` : 'none',
        cursor: randomPhoto ? 'pointer' : 'default', // Add pointer cursor if there's a photo
      }}
      onClick={handleOpenPopup} // Add click handler to the main box
    >
      {randomPhoto ? (
        <>
          <LazyImage
            src={randomPhoto.imageUrl}
            alt={randomPhoto.title || "Foto em Destaque"}
            width="100%"
            height="100%"
            sx={{
              // This image tag is primarily for preloading and error state.
              // Its 'display' style is controlled internally by LazyImage based on loaded state.
              // You might want to remove it entirely if you rely solely on background-image.
            }}
            showLoaderAndError={false} // Prevents LazyImage from showing its own loader/error directly on top
          />

          {/* Camada de sobreposição para o título e a descrição */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              color: 'white',
              p: 2,
              zIndex: 1,
            }}
          >
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {randomPhoto.title}
            </Typography>
            <Typography variant="body2">
              {randomPhoto.description}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography component="div" variant="h6" color="text.secondary">
          Nenhuma foto disponível para destaque.
        </Typography>
      )}

      {/* Popup Dialog for displaying the image */}
      {randomPhoto && (
        <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {randomPhoto.title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClosePopup}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
                // Z-index mais alto e fundo para garantir que o 'X' seja clicável
                zIndex: 100,
                backgroundColor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
                borderRadius: '50%',
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={randomPhoto.imageUrl}
              alt={randomPhoto.title || "Foto em Destaque"}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh', // Limit height to 80% of viewport height
                height: 'auto',
                width: 'auto',
                display: 'block',
                objectFit: 'contain', // Ensures the entire image is visible within the bounds
              }}
            />
          </DialogContent>
          {randomPhoto.description && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1">
                {randomPhoto.description}
              </Typography>
            </Box>
          )}
        </Dialog>
      )}
    </Box>
  );
};

export default React.memo(App);