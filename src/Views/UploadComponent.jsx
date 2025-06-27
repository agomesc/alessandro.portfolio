import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  TextField, Button, Box, Typography, Snackbar, Alert, CircularProgress,
  Card, CardContent, CardMedia, Grid,
  Dialog, DialogContent, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit'; // Importe o ícone de edição
import DeleteIcon from '@mui/icons-material/Delete'; // Opcional: para exclusão

import { auth, db, storage } from '../firebaseConfig';

import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import {
  collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp,
  doc, updateDoc, deleteDoc // Importe updateDoc e deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'; // Importe deleteObject

/**
 * Função utilitária para redimensionar uma imagem (File ou Blob) para um Blob redimensionado.
 * Mantém a proporção e garante que a maior dimensão não exceda maxWidth/maxHeight.
 * @param {File | Blob} file - O ficheiro de imagem a ser redimensionado.
 * @param {number} maxWidth - Largura máxima desejada para a imagem.
 * @param {number} maxHeight - Altura máxima desejada para a imagem.
 * @param {string} mimeType - O tipo MIME de saída para o Blob (padrão 'image/jpeg').
 * @param {number} quality - A qualidade do JPEG/WebP (0 a 1, padrão 0.9).
 * @returns {Promise<Blob>} Um Blob da imagem redimensionada.
 */
const resizeImageToBlob = (file, maxWidth = 2048, maxHeight = 2048, mimeType = 'image/jpeg', quality = 0.9) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width / height > maxWidth / maxHeight) {
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

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Falha ao criar Blob da imagem redimensionada.'));
          }
        }, mimeType, quality);
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

  const [uploadError, setUploadError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  // Estados para edição
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // Para pré-visualização da imagem sendo editada
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState('');

  const showSnackbar = useCallback((msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  useEffect(() => {
    let authUnsubscribe;

    const initAuth = async () => {
      console.log('Iniciando autenticação...');
      setUploadError(null);

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
              const newUuid = crypto.randomUUID();
              console.warn('signInAnonymously não retornou UID imediatamente. Usando UUID gerado:', newUuid);
              setUserId(newUuid);
            }
          } catch (anonError) {
            console.error('Erro ao tentar login anónimo:', anonError);
            showSnackbar(`Erro de autenticação (Anónimo): ${anonError.message}. Certifique-se de que a autenticação anónima está ativada no Firebase.`, 'error');
            setUploadError(`Erro de autenticação anónima: ${anonError.message}`);
            const newUuid = crypto.randomUUID();
            console.error('Falha na autenticação. Usando UUID gerado como fallback para operações não-autenticadas:', newUuid);
            setUserId(newUuid);
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
      setUploadError(null);
      // Limpa as URLs atuais da imagem se um novo arquivo for selecionado para upload/edição
      setCurrentImageUrl('');
      setCurrentThumbnailUrl('');
    } else {
      console.log('Nenhum ficheiro selecionado.');
      setImageFile(null);
      // Se nenhum arquivo for selecionado, mantenha as URLs atuais se estiver em modo de edição
      if (!isEditing) {
        setUploadError('Nenhum ficheiro selecionado.');
      }
    }
  }, [isEditing]);

  const resetForm = useCallback(() => {
    setImageFile(null);
    setTitle('');
    setDescription('');
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setIsEditing(false);
    setCurrentImageId(null);
    setCurrentImageUrl('');
    setCurrentThumbnailUrl('');
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) fileInput.value = '';
  }, []);

  const handleUpload = useCallback(async () => {
    setUploadError(null);
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
      const originalBlob = await resizeImageToBlob(imageFile);
      console.log('Imagem original redimensionada para Blob. Tamanho:', originalBlob.size, 'bytes');

      if (originalBlob.size === 0) {
        throw new Error('O ficheiro redimensionado resultou num Blob vazio. Não é possível fazer upload.');
      }

      const thumbnailBlob = await resizeImageToBlob(imageFile, 320, 240);
      console.log('Thumbnail gerado. Tamanho:', thumbnailBlob.size, 'bytes');

      if (thumbnailBlob.size === 0) {
        throw new Error('O thumbnail gerado resultou num Blob vazio. Não é possível fazer upload.');
      }

      const fileName = `${imageFile.name}-${Date.now()}`;
      const originalStorageRef = ref(storage, `images/${userId}/${fileName}`);
      const thumbnailStorageRef = ref(storage, `thumbnails/${userId}/${fileName}`);

      const uploadOriginalTask = uploadBytesResumable(originalStorageRef, originalBlob);
      const uploadThumbnailTask = uploadBytesResumable(thumbnailStorageRef, thumbnailBlob);

      uploadOriginalTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Progresso do upload da imagem original: ${progress.toFixed(2)}%`);
          if (progress > 0 && uploadError) {
            setUploadError(null);
          }
        },
        (error) => {
          console.error("Erro no upload da imagem original Firebase Storage:", error);
          const errorMessage = `Falha no upload da imagem original: ${error.message || 'Erro desconhecido'}. Código: ${error.code || 'N/A'}`;
          setUploadError(errorMessage);
          showSnackbar(errorMessage, 'error');
          setIsUploading(false);
          setUploadProgress(0);
        },
        async () => {
          try {
            const originalDownloadURL = await getDownloadURL(uploadOriginalTask.snapshot.ref);
            console.log('Upload da imagem original concluído. URL:', originalDownloadURL);

            const thumbnailDownloadURL = await getDownloadURL(uploadThumbnailTask.snapshot.ref);
            console.log('Upload do thumbnail concluído. URL:', thumbnailDownloadURL);

            await addDoc(collection(db, 'images'), {
              userId: userId,
              title: title.trim(),
              description: description.trim(),
              imageUrl: originalDownloadURL,
              thumbnailUrl: thumbnailDownloadURL,
              timestamp: serverTimestamp(),
            });
            console.log('Metadados guardados no Firestore.');
            showSnackbar('Imagem e thumbnail enviados com sucesso!', 'success');
            resetForm();
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
      setUploadProgress(0);
    }
  }, [imageFile, title, description, userId, showSnackbar, uploadError, resetForm]);

  const handleEditClick = useCallback((image) => {
    setIsEditing(true);
    setCurrentImageId(image.id);
    setTitle(image.title);
    setDescription(image.description);
    setCurrentImageUrl(image.imageUrl); // Define a URL da imagem atual para pré-visualização
    setCurrentThumbnailUrl(image.thumbnailUrl);
    setImageFile(null); // Limpa o arquivo selecionado previamente no input file
    setUploadError(null);
    setUploadProgress(0);
    // Limpa o input de arquivo, se houver um arquivo selecionado
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) fileInput.value = '';
  }, []);

  const handleUpdate = useCallback(async () => {
    setUploadError(null);
    if (!title.trim()) {
      setUploadError('Por favor, adicione um título para a imagem.');
      showSnackbar('Por favor, adicione um título para a imagem.', 'warning');
      return;
    }
    if (!userId) {
      setUploadError('Utilizador não autenticado. Por favor, aguarde ou recarregue a página.');
      showSnackbar('Erro: Utilizador não autenticado para atualização.', 'error');
      return;
    }
    if (!currentImageId) {
      setUploadError('Nenhuma imagem selecionada para edição.');
      showSnackbar('Erro: Nenhuma imagem selecionada para edição.', 'error');
      return;
    }

    setIsUploading(true);
    console.log('Iniciando atualização...');
    let newImageUrl = currentImageUrl;
    let newThumbnailUrl = currentThumbnailUrl;

    try {
      if (imageFile) {
        // Se um novo arquivo foi selecionado, faça o upload da nova imagem
        const originalBlob = await resizeImageToBlob(imageFile);
        const thumbnailBlob = await resizeImageToBlob(imageFile, 320, 240);

        if (originalBlob.size === 0 || thumbnailBlob.size === 0) {
            throw new Error('O ficheiro redimensionado resultou num Blob vazio. Não é possível fazer upload.');
        }

        const fileName = `${imageFile.name}-${Date.now()}`;
        const originalStorageRef = ref(storage, `images/${userId}/${fileName}`);
        const thumbnailStorageRef = ref(storage, `thumbnails/${userId}/${fileName}`);

        const uploadOriginalTask = uploadBytesResumable(originalStorageRef, originalBlob);
        const uploadThumbnailTask = uploadBytesResumable(thumbnailStorageRef, thumbnailBlob);

        uploadOriginalTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            console.log(`Progresso do upload da nova imagem: ${progress.toFixed(2)}%`);
          },
          (error) => {
            console.error("Erro no upload da nova imagem para o Storage:", error);
            throw new Error(`Falha no upload da nova imagem: ${error.message}`);
          }
        );

        await uploadOriginalTask;
        await uploadThumbnailTask;

        newImageUrl = await getDownloadURL(uploadOriginalTask.snapshot.ref);
        newThumbnailUrl = await getDownloadURL(uploadThumbnailTask.snapshot.ref);
        console.log('Nova imagem e thumbnail enviados. URLs:', newImageUrl, newThumbnailUrl);

        // Opcional: Excluir a imagem antiga do Storage, se houver
        if (currentImageUrl) {
          try {
            const oldOriginalRef = ref(storage, currentImageUrl);
            await deleteObject(oldOriginalRef);
            console.log('Imagem original antiga excluída do Storage.');
          } catch (deleteError) {
            console.warn('Falha ao excluir imagem original antiga do Storage:', deleteError.message);
            // Não impede a atualização do Firestore, apenas loga o aviso
          }
        }
        if (currentThumbnailUrl) {
          try {
            const oldThumbnailRef = ref(storage, currentThumbnailUrl);
            await deleteObject(oldThumbnailRef);
            console.log('Thumbnail antiga excluída do Storage.');
          } catch (deleteError) {
            console.warn('Falha ao excluir thumbnail antiga do Storage:', deleteError.message);
          }
        }

      } else if (!currentImageUrl) { // Se não tem imageFile e não tem currentImageUrl (caso de falha ou bug)
          setUploadError('Nenhuma imagem associada à edição. Selecione uma nova imagem.');
          showSnackbar('Nenhuma imagem associada à edição. Selecione uma nova imagem.', 'error');
          setIsUploading(false);
          return;
      }


      const imageDocRef = doc(db, 'images', currentImageId);
      await updateDoc(imageDocRef, {
        title: title.trim(),
        description: description.trim(),
        imageUrl: newImageUrl,
        thumbnailUrl: newThumbnailUrl,
        lastUpdated: serverTimestamp(), // Opcional: campo para indicar última atualização
      });
      console.log('Metadados atualizados no Firestore.');
      showSnackbar('Imagem atualizada com sucesso!', 'success');
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      const errorMessage = `Falha ao atualizar imagem: ${error.message || 'Erro desconhecido'}.`;
      setUploadError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [imageFile, title, description, userId, currentImageId, currentImageUrl, currentThumbnailUrl, showSnackbar, resetForm]);

  const handleDelete = useCallback(async (imageToDelete) => {
    if (!window.confirm(`Tem certeza que deseja excluir a imagem "${imageToDelete.title}"?`)) {
      return;
    }

    try {
      setIsUploading(true); // Pode usar este estado para indicar que uma operação está em andamento

      // 1. Excluir do Firebase Storage
      if (imageToDelete.imageUrl) {
        const originalRef = ref(storage, imageToDelete.imageUrl);
        await deleteObject(originalRef);
        console.log('Imagem original excluída do Storage:', imageToDelete.imageUrl);
      }
      if (imageToDelete.thumbnailUrl) {
        const thumbnailRef = ref(storage, imageToDelete.thumbnailUrl);
        await deleteObject(thumbnailRef);
        console.log('Thumbnail excluída do Storage:', imageToDelete.thumbnailUrl);
      }

      // 2. Excluir do Firestore
      const imageDocRef = doc(db, 'images', imageToDelete.id);
      await deleteDoc(imageDocRef);
      console.log('Documento excluído do Firestore:', imageToDelete.id);

      showSnackbar('Imagem excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      const errorMessage = `Falha ao excluir imagem: ${error.message || 'Erro desconhecido'}.`;
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsUploading(false);
    }
  }, [showSnackbar]);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  const handleOpenModal = useCallback((imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedImageUrl('');
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
          {isEditing ? 'Editar Imagem Existente' : 'Fazer Upload de Nova Imagem'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          O seu ID de Utilizador: <strong>{userId || 'N/A'}</strong>
          <br />
          (Este ID identifica as suas imagens no sistema.)
        </Typography>

        {isEditing && currentImageUrl && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Imagem Atual:</Typography>
            <img src={currentThumbnailUrl || currentImageUrl} alt="Preview da Imagem Atual" style={{ maxWidth: '200px', height: 'auto', borderRadius: '4px' }} />
            <Typography variant="caption" display="block" color="text.secondary">
                Selecione um novo arquivo para trocar a imagem.
            </Typography>
          </Box>
        )}

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
          error={!!uploadError && !title.trim()}
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
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={isEditing ? handleUpdate : handleUpload}
            disabled={isUploading || !title.trim() || (!imageFile && !isEditing)}
          >
            {isUploading ? (
              <>
                <CircularProgress size={24} color="inherit" />
                <Box sx={{ ml: 1 }}>{isEditing ? 'A atualizar...' : 'A enviar...'} {uploadProgress.toFixed(0)}%</Box>
              </>
            ) : (
              isEditing ? 'Atualizar Imagem' : 'Enviar Imagem'
            )}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm}
              disabled={isUploading}
            >
              Cancelar Edição
            </Button>
          )}
        </Box>

        {isUploading && uploadProgress > 0 && (
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
                  width={320}
                  height="200"
                  image={img.thumbnailUrl || img.imageUrl}
                  alt={img.title}
                  sx={{ objectFit: 'cover', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => handleOpenModal(img.imageUrl)}
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
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(img)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(img)}
                    >
                      Excluir
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        aria-labelledby="image-modal-title"
      >
        <DialogContent sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 10
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImageUrl && (
            <img
              src={selectedImageUrl}
              alt="Imagem Original"
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default memo(ImageUploaderGallery);