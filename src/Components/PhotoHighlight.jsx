import React, { useMemo, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import { auth,  db, } from '../firebaseConfig';
import {  signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import {  collection, query, orderBy, onSnapshot } from 'firebase/firestore';


// Componente LazyImage movido para dentro do mesmo arquivo para resolver o erro de resolução de módulo
const LazyImage = ({ src, alt, width, height, sx }) => {
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
      {!loaded && !error && (
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
      {error && (
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

    // 1. Autenticação Firebase e Configuração do Listener
    useEffect(() => {
        let authUnsubscribe;

        const initAuth = async () => {
            if (!auth.currentUser && typeof window.__initial_auth_token !== 'undefined') {
                try {
                    await signInWithCustomToken(auth, window.__initial_auth_token);
                } catch (error) {
                    console.error('Erro ao tentar login com token customizado:', error);
                    // Fallback para login anônimo ou tratamento de erro
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
    }, []); // Executa apenas uma vez na montagem

    // 2. Escuta por mudanças nas imagens do Firestore
    useEffect(() => {
        if (!isAuthReady || !userId) {
            return; // Não busca se a autenticação não estiver pronta ou userId não definido
        }

        const imagesCollectionRef = collection(db, 'images');
        const q = query(
            imagesCollectionRef,
            // Adicione esta condição para filtrar por userId se as suas regras de segurança exigirem
            // Por exemplo: where('userId', '==', userId),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const imageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setImages(imageList);
        }, (error) => {
            console.error("Erro ao buscar imagens:", error);
            // Poderia adicionar um snackbar ou mensagem de erro para o utilizador aqui
        });

        return () => {
            unsubscribe(); // Limpa o listener ao desmontar
        };
    }, [isAuthReady, userId]); // Dependências: isAuthReady e userId

    // Usa useMemo para selecionar uma foto aleatória apenas uma vez por renderização
    // se 'images' não mudar, garantindo que a foto permaneça a mesma
    // até que o componente seja remontado ou 'images' mude.
    const randomPhoto = useMemo(() => {
        if (!images || images.length === 0) {
            return null; // Retorna null se não houver dados
        }
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }, [images]); // Recalcula apenas se 'images' mudar

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
                maxWidth: '2048px', // Largura máxima de 2048px
                margin: '0 auto',   // Centraliza o componente horizontalmente
                height: '600px',    // Altura do banner de destaque
                position: 'relative',
                overflow: 'hidden',
                mt: 4,              // Margem superior
                display: 'flex',    // Para centralizar conteúdo se a imagem não preencher
                alignItems: 'center', // Centraliza itens filhos verticalmente (flexbox)
                justifyContent: 'center', // Centraliza itens filhos horizontalmente (flexbox)
                backgroundColor: '#f0f0f0', // Cor de fundo para quando não houver imagem
            }}
        >
            {randomPhoto ? (
                <>
                    <LazyImage
                        src={randomPhoto.imageUrl} // Pega diretamente o imageUrl do Firestore
                        alt={randomPhoto.title || "Foto em Destaque"}
                        width="100%"
                        height="100%"
                        sx={{
                            objectFit: 'cover', // Garante que a imagem cubra a área sem distorção
                            display: 'block',
                            position: 'absolute', // Permite que o texto fique por cima, preenchendo o contêiner pai
                            top: 0,
                            left: 0,
                        }}
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
        </Box>
    );
};

export default React.memo(App);
