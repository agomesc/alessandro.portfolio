import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  TextField, Button, Box, Typography, Snackbar, Alert, CircularProgress,
  Card, CardContent, CardMedia, Grid
} from '@mui/material';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Definição da configuração do Firebase diretamente no componente
// Isto substitui o import de '../firebaseConfig' para resolver o erro de "Could not resolve"
const firebaseAppConfig = {
  apiKey: "AIzaSyAl75-7cxK0okEbOEnpEABmzmEJr_aQv-I",
  authDomain: "alessandro-portfolio.firebaseapp.com",
  databaseURL: "https://alessandro-portfolio-default-rtdb.firebaseio.com",
  projectId: "alessandro-portfolio",
  storageBucket: "alessandro-portfolio.firebasestorage.app",
  messagingSenderId: "1077155633264",
  appId: "1:1077155633264:web:176463c5c50b9a28427cb5",
  measurementId: "G-WG3E4CSVFR"
};

/**
 * Função utilitária para redimensionar uma imagem (File ou Blob) para um Blob redimensionado.
 * Mantém a proporção e garante que a maior dimensão não exceda maxWidth/maxHeight.
 * @param {File | Blob} file - O ficheiro de imagem a ser redimensionado.
 * @param {number} maxWidth - Largura máxima desejada para a imagem.
 * @param {number} maxHeight - Altura máxima desejada para a imagem.
 * @returns {Promise<Blob>} Um Blob da imagem redimensionada.
 */
const resizeImageToBlob = (file, maxWidth = 2048, maxHeight = 2048) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcula as novas dimensões para se ajustar ao maxWidth/maxHeight, mantendo a proporção.
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Converte o canvas para um Blob JPEG com qualidade de 90%.
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Falha ao criar Blob da imagem redimensionada.'));
          }
        }, 'image/jpeg', 0.9);
      };
      img.onerror = (error) => reject(error);
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ImageUploaderGallery = () => {
  // Inicializa as instâncias do Firebase dentro do componente, usando a configuração definida acima.
  const app = initializeApp(firebaseAppConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // Para indicar que a autenticação inicial foi concluída
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Função para exibir mensagens na Snackbar
  const showSnackbar = useCallback((msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  // Efeito para inicializar autenticação e escutar mudanças de estado
  useEffect(() => {
    let authUnsubscribe;

    const initAuth = async () => {
      console.log('Iniciando autenticação...');
      
      // Tenta fazer login com token customizado se disponível e não houver utilizador logado
      // Acessa __initial_auth_token através de window para clareza (ajuda no linting)
      if (!auth.currentUser && typeof window.__initial_auth_token !== 'undefined') {
        try {
          console.log('Tentando signInWithCustomToken...');
          await signInWithCustomToken(auth, window.__initial_auth_token);
          console.log('signInWithCustomToken bem-sucedido.');
        } catch (error) {
          console.error('Erro ao tentar login com token customizado:', error);
          showSnackbar(`Erro de autenticação (Token): ${error.message}. Verifique as configurações do seu Firebase.`, 'error');
          // onAuthStateChanged abaixo tratará o estado nulo do utilizador e tentará o login anónimo
        }
      } else {
        console.log('__initial_auth_token não definido ou utilizador já logado.');
      }

      // Configura o listener onAuthStateChanged
      authUnsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log('Utilizador logado:', user.uid);
          setUserId(user.uid);
        } else {
          console.log('Nenhum utilizador logado após as verificações iniciais. Tentando login anónimo...');
          // Se não houver utilizador logado após a tentativa de token personalizado, tenta login anónimo
          try {
            await signInAnonymously(auth);
            const currentUser = auth.currentUser;
            if (currentUser) {
              console.log('Login anónimo bem-sucedido:', currentUser.uid);
              setUserId(currentUser.uid);
            } else {
              // Último recurso: gerar um UUID se signInAnonymously não retornar um UID imediatamente
              const newUuid = crypto.randomUUID();
              console.warn('signInAnonymously não retornou UID imediatamente. Usando UUID gerado:', newUuid);
              setUserId(newUuid);
            }
          } catch (anonError) {
            console.error('Erro ao tentar login anónimo:', anonError);
            showSnackbar(`Erro de autenticação (Anónimo): ${anonError.message}. Certifique-se de que a autenticação anónima está ativada no Firebase.`, 'error');
            // Se o login anónimo também falhar, gerar um UUID como último recurso
            const newUuid = crypto.randomUUID();
            console.error('Falha na autenticação. Usando UUID gerado como fallback:', newUuid);
            setUserId(newUuid);
          }
        }
        setIsAuthReady(true); // Autenticação inicial concluída
        console.log('isAuthReady definido como true.');
      });
    };

    initAuth();

    return () => {
      if (authUnsubscribe) {
        console.log('Limpando listener onAuthStateChanged.');
        authUnsubscribe(); // Limpa o listener ao desmontar o componente
      }
    };
  }, [auth, showSnackbar]);

  // Efeito para buscar e escutar imagens do Firestore
  useEffect(() => {
    // Só tenta buscar imagens se a autenticação estiver pronta e houver um userId
    if (!isAuthReady || !userId) {
      console.log('Não está pronto para buscar imagens:', { isAuthReady, userId });
      return;
    }

    console.log('A buscar imagens para o utilizador:', userId);
    // Define o caminho da coleção. Assumindo 'images' diretamente para um portfólio.
    const imagesCollectionRef = collection(db, 'images');
    
    // Cria uma query para buscar imagens do utilizador logado, ordenada por timestamp (decrescente)
    const q = query(
      imagesCollectionRef,
      where('userId', '==', userId), // Filtra as imagens para mostrar apenas as do utilizador logado
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Imagens carregadas:', imageList.length);
      setImages(imageList);
    }, (error) => {
      console.error("Erro ao buscar imagens:", error);
      showSnackbar(`Erro ao carregar imagens: ${error.message}`, 'error');
    });

    return () => {
      console.log('Limpando listener onSnapshot.');
      unsubscribe(); // Limpa o listener ao desmontar o componente
    };
  }, [isAuthReady, userId, db, showSnackbar]);

  // Manipulador de seleção de ficheiro
  const handleFileChange = useCallback((e) => {
    if (e.target.files[0]) {
      console.log('Ficheiro selecionado:', e.target.files[0].name);
      setImageFile(e.target.files[0]);
      setUploadProgress(0); // Reinicia o progresso ao selecionar novo ficheiro
    } else {
      console.log('Nenhum ficheiro selecionado.');
      setImageFile(null);
    }
  }, []);

  // Manipulador de upload
  const handleUpload = useCallback(async () => {
    if (!imageFile || !title || !userId) {
      showSnackbar('Por favor, selecione uma imagem, adicione um título e certifique-se de estar autenticado.', 'warning');
      return;
    }

    setIsUploading(true);
    console.log('Iniciando upload...');
    try {
      // Redimensionar a imagem antes de fazer o upload para o Firebase Storage
      const resizedBlob = await resizeImageToBlob(imageFile);
      console.log('Imagem redimensionada para Blob.');

      // Cria uma referência única no Firebase Storage dentro da pasta do utilizador
      const storageRef = ref(storage, `images/${userId}/${imageFile.name}-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, resizedBlob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Progresso do upload: ${progress.toFixed(2)}%`);
        },
        (error) => {
          console.error("Erro no upload:", error);
          showSnackbar(`Erro ao enviar imagem: ${error.message}`, 'error');
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Upload concluído. URL da imagem:', downloadURL);
          
          // Salvar metadados no Cloud Firestore
          await addDoc(collection(db, 'images'), { // Salva na coleção 'images' diretamente
            userId: userId, // Adiciona o ID do utilizador que fez o upload
            title: title,
            description: description,
            imageUrl: downloadURL,
            timestamp: new Date(), // Adiciona um timestamp para ordenação
          });
          console.log('Metadados guardados no Firestore.');
          showSnackbar('Imagem enviada com sucesso!', 'success');
          // Limpa os campos após o upload bem-sucedido
          setImageFile(null);
          setTitle('');
          setDescription('');
          setUploadProgress(0);
          setIsUploading(false);
          // Limpa o input file visualmente para que o utilizador possa selecionar o mesmo ficheiro novamente
          const fileInput = document.getElementById('image-upload-input');
          if (fileInput) fileInput.value = '';
        }
      );
    } catch (error) {
      console.error('Erro ao redimensionar ou fazer upload:', error);
      showSnackbar(`Erro ao processar imagem: ${error.message}`, 'error');
      setIsUploading(false);
    }
  }, [imageFile, title, description, userId, storage, db, showSnackbar]);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  // Exibe um carregador enquanto a autenticação está a ser preparada
  if (!isAuthReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>A carregar autenticação...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 0,
      width: {
        xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%"
      },
      margin: "0 auto",
      padding: "0 20px",
      mt: 4, // Ajustado para não colidir com o topo
      mb: 4
    }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Minha Galeria de Fotografia
      </Typography>

      <Box sx={{ mb: 5, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Fazer Upload de Nova Imagem
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          O seu ID de Utilizador: <strong>{userId || 'N/A'}</strong>
          <br/>
          (Este ID identifica as suas imagens no sistema.)
        </Typography>
        <input
          id="image-upload-input"
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          style={{ marginBottom: '16px', display: 'block' }}
        />
        <TextField
          label="Título da Imagem"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descrição da Imagem"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isUploading || !imageFile || !title}
          sx={{ mt: 2 }}
        >
          {isUploading ? (
            <>
              <CircularProgress size={24} color="inherit" />
              <Box sx={{ ml: 1 }}>A enviar... {uploadProgress.toFixed(0)}%</Box>
            </>
          ) : (
            'Enviar Imagem'
          )}
        </Button>
        {isUploading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Progresso: {uploadProgress.toFixed(2)}%
            </Typography>
          </Box>
        )}
      </Box>

      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 6, mb: 4 }}>
        As Minhas Imagens Enviadas
      </Typography>

      {images.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Nenhuma imagem encontrada. Faça um upload para começar!
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {images.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={img.imageUrl}
                  alt={img.title}
                  sx={{ objectFit: 'cover', borderBottom: '1px solid #eee' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {img.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {img.description}
                  </Typography>
                  {/* Opcional: Mostrar timestamp formatado */}
                  {img.timestamp && (
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                      Enviado em: {new Date(img.timestamp.toDate()).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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

export default memo(ImageUploaderGallery);
