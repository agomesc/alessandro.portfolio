import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  TextField, Button, Box, Typography, Snackbar, Alert, CircularProgress,
  Card, CardContent, CardMedia, Grid
} from '@mui/material';

// Import Firebase instances from your firebaseConfig.js
import { auth, db, storage } from '../firebaseConfig'; // Adjust the path if firebaseConfig.js is not in the same directory

// Firebase imports specific to methods, not the app config
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
      img.onerror = (error) => reject(new Error(`Erro ao carregar imagem para redimensionamento: ${error.message || error}`));
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(new Error(`Erro ao ler ficheiro para redimensionamento: ${error.message || error}`));
    reader.readAsDataURL(file);
  });
};

const ImageUploaderGallery = () => {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Novo estado para exibir erros no formulário de upload
  const [uploadError, setUploadError] = useState(null);

  const showSnackbar = useCallback((msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  useEffect(() => {
    let authUnsubscribe;

    const initAuth = async () => {
      console.log('Iniciando autenticação...');
      setUploadError(null); // Limpa qualquer erro anterior ao iniciar a autenticação

      if (!auth.currentUser && typeof window.__initial_auth_token !== 'undefined') {
        try {
          console.log('Tentando signInWithCustomToken...');
          await signInWithCustomToken(auth, window.__initial_auth_token);
          console.log('signInWithCustomToken bem-sucedido.');
        } catch (error) {
          console.error('Erro ao tentar login com token customizado:', error);
          showSnackbar(`Erro de autenticação (Token): ${error.message}. Verifique as configurações do seu Firebase.`, 'error');
          setUploadError(`Erro de autenticação: ${error.message}`);
        }
      } else {
        console.log('__initial_auth_token não definido ou utilizador já logado.');
      }

      authUnsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log('Utilizador logado:', user.uid);
          setUserId(user.uid);
        } else {
          console.log('Nenhum utilizador logado após as verificações iniciais. Tentando login anónimo...');
          try {
            await signInAnonymously(auth);
            const currentUser = auth.currentUser;
            if (currentUser) {
              console.log('Login anónimo bem-sucedido:', currentUser.uid);
              setUserId(currentUser.uid);
            } else {
              // Fallback para um UUID se signInAnonymously não retornar um UID imediatamente (caso de Edge)
              const newUuid = crypto.randomUUID();
              console.warn('signInAnonymously não retornou UID imediatamente. Usando UUID gerado:', newUuid);
              setUserId(newUuid);
            }
          } catch (anonError) {
            console.error('Erro ao tentar login anónimo:', anonError);
            showSnackbar(`Erro de autenticação (Anónimo): ${anonError.message}. Certifique-se de que a autenticação anónima está ativada no Firebase.`, 'error');
            setUploadError(`Erro de autenticação anónima: ${anonError.message}`);
            // Fallback para um UUID mesmo em caso de falha de autenticação total
            const newUuid = crypto.randomUUID();
            console.error('Falha na autenticação. Usando UUID gerado como fallback para operações não-autenticadas:', newUuid);
            setUserId(newUuid); // Permite que o componente continue, mas as operações autenticadas falharão
          }
        }
        setIsAuthReady(true);
        console.log('isAuthReady definido como true.');
      });
    };

    initAuth();

    return () => {
      if (authUnsubscribe) {
        console.log('Limpando listener onAuthStateChanged.');
        authUnsubscribe();
      }
    };
  }, [showSnackbar]);

  useEffect(() => {
    if (!isAuthReady || !userId) {
      console.log('Não está pronto para buscar imagens:', { isAuthReady, userId });
      return;
    }

    console.log('A buscar imagens para o utilizador:', userId);
    const imagesCollectionRef = collection(db, 'images');

    const q = query(
      imagesCollectionRef,
      where('userId', '==', userId),
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
      unsubscribe();
    };
  }, [isAuthReady, userId, showSnackbar]);

  const handleFileChange = useCallback((e) => {
    if (e.target.files[0]) {
      console.log('Ficheiro selecionado:', e.target.files[0].name);
      setImageFile(e.target.files[0]);
      setUploadProgress(0);
      setUploadError(null); // Limpa erro ao selecionar novo arquivo
    } else {
      console.log('Nenhum ficheiro selecionado.');
      setImageFile(null);
      setUploadError('Nenhum ficheiro selecionado.');
    }
  }, []);

  const handleUpload = useCallback(async () => {
    setUploadError(null); // Limpa erros anteriores do upload
    if (!imageFile) {
      setUploadError('Por favor, selecione uma imagem.');
      showSnackbar('Por favor, selecione uma imagem.', 'warning');
      return;
    }
    if (!title.trim()) {
      setUploadError('Por favor, adicione um título para a imagem.');
      showSnackbar('Por favor, adicione um título para a imagem.', 'warning');
      return;
    }
    if (!userId) {
      setUploadError('Utilizador não autenticado. Por favor, aguarde ou recarregue a página.');
      showSnackbar('Erro: Utilizador não autenticado para upload.', 'error');
      return;
    }

    setIsUploading(true);
    console.log('Iniciando upload...');
    try {
      const resizedBlob = await resizeImageToBlob(imageFile);
      console.log('Imagem redimensionada para Blob. Tamanho:', resizedBlob.size, 'bytes');

      if (resizedBlob.size === 0) {
        throw new Error('O ficheiro redimensionado resultou num Blob vazio. Não é possível fazer upload.');
      }

      const storageRef = ref(storage, `images/${userId}/${imageFile.name}-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, resizedBlob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Progresso do upload: ${progress.toFixed(2)}%`);
          // Limpa erro se o progresso começar a subir
          if (progress > 0 && uploadError) {
            setUploadError(null);
          }
        },
        (error) => {
          console.error("Erro no upload Firebase Storage:", error);
          const errorMessage = `Falha no upload: ${error.message || 'Erro desconhecido'}. Código: ${error.code || 'N/A'}`;
          setUploadError(errorMessage);
          showSnackbar(errorMessage, 'error');
          setIsUploading(false);
          setUploadProgress(0); // Reset progress on error
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Upload concluído. URL da imagem:', downloadURL);

            await addDoc(collection(db, 'images'), {
              userId: userId,
              title: title.trim(),
              description: description.trim(),
              imageUrl: downloadURL,
              timestamp: new Date(),
            });
            console.log('Metadados guardados no Firestore.');
            showSnackbar('Imagem enviada com sucesso!', 'success');
            // Limpar estados após sucesso
            setImageFile(null);
            setTitle('');
            setDescription('');
            setUploadProgress(0);
            setIsUploading(false);
            setUploadError(null); // Limpa erros após sucesso
            const fileInput = document.getElementById('image-upload-input');
            if (fileInput) fileInput.value = ''; // Limpa o input de arquivo
          } catch (firestoreError) {
            console.error('Erro ao guardar metadados no Firestore:', firestoreError);
            const errorMessage = `Erro ao guardar metadados: ${firestoreError.message || 'Erro desconhecido'}.`;
            setUploadError(errorMessage);
            showSnackbar(errorMessage, 'error');
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Erro geral ao redimensionar ou iniciar upload:', error);
      const errorMessage = `Erro ao processar imagem para upload: ${error.message || 'Erro desconhecido'}.`;
      setUploadError(errorMessage);
      showSnackbar(errorMessage, 'error');
      setIsUploading(false);
      setUploadProgress(0); // Reset progress on error
    }
  }, [imageFile, title, description, userId, showSnackbar, uploadError]); // Adicionado uploadError para re-renderizar se houver mudança

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

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
      mt: 4,
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
          error={!!uploadError && !title.trim()} // Erro se não houver título e houver erro geral
          helperText={!!uploadError && !title.trim() ? "O título é obrigatório." : ""}
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
        {uploadError && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {uploadError}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isUploading || !imageFile || !title.trim()}
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
        {isUploading && uploadProgress > 0 && ( // Só mostra o progresso detalhado se estiver subindo
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
        autoHideDuration={4000} // Aumentado para dar tempo de ler o erro
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