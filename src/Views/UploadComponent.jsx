import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  TextField, Button, Box, Typography, Snackbar, Alert, CircularProgress,
  Card, CardContent, CardMedia, Grid,
  Dialog, DialogContent, IconButton, DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { auth, db, storage } from '../firebaseConfig';

import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import {
  collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp,
  doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

// >>> NOVO: Importe o componente Cropper e o slider
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider'; // Para controlar o zoom

// >>> NOVO: Importe sua função getCroppedImg
// Certifique-se de que o caminho para getCroppedImg está correto
import getCroppedImg from '../shared/cropImage'; // Ajuste o caminho se necessário

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
const resizeImageToBlob = (file, maxWidth = 2048, maxHeight = 1363, mimeType = 'image/jpeg', quality = 1.0) => {
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
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState('');

  // >>> NOVO: Estados para o Cropper
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null); // URL da imagem para o cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9); // Pode ser 1 / 1 para quadrado, 16 / 9 para widescreen

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

  // >>> MODIFICADO: handleFileChange para abrir o modal de corte
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file); // Guarda o File original, se precisar dele
      setUploadProgress(0);
      setUploadError(null);
      setCurrentImageUrl('');
      setCurrentThumbnailUrl('');

      // Cria uma URL para a imagem selecionada para o cropper
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setCropModalOpen(true); // Abre o modal do cropper
      };
      reader.readAsDataURL(file);
    } else {
      console.log('Nenhum ficheiro selecionado.');
      setImageFile(null);
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
    // >>> NOVO: Resetar estados do cropper
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, []);

  // >>> NOVO: Funções do Cropper
  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = useCallback(async () => {
    if (!imageToCrop || !croppedAreaPixels) {
      showSnackbar('Erro: Imagem ou área de corte não definidas.', 'error');
      return;
    }

    try {
      // Use a função getCroppedImg para obter o Blob da imagem cortada
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      console.log('Imagem cortada para Blob. Tamanho:', croppedBlob.size, 'bytes');

      // Agora, define o imageFile como o croppedBlob
      // Isso substituirá o File original pelo Blob cortado para o upload/edição
      setImageFile(croppedBlob);
      setCropModalOpen(false); // Fecha o modal de corte
      showSnackbar('Imagem cortada com sucesso! Prossiga com o upload.', 'success');
    } catch (e) {
      console.error('Erro ao cortar imagem:', e);
      showSnackbar(`Erro ao cortar imagem: ${e.message}`, 'error');
    }
  }, [imageToCrop, croppedAreaPixels, showSnackbar]);

  // >>> MODIFICADO: handleUpload para usar o imageFile (que agora pode ser o croppedBlob)
  const handleUpload = useCallback(async () => {
    setUploadError(null);
    // Agora imageFile pode ser o File original ou o Blob cortado
    if (!imageFile) {
      setUploadError('Por favor, selecione e corte uma imagem.');
      showSnackbar('Por favor, selecione e corte uma imagem.', 'warning');
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
      // O imageFile já é o BLOB CORTADO, então não precisamos mais do resizeImageToBlob para o original.
      // Apenas o thumbnail ainda pode precisar de um resize menor se o croppedBlob for muito grande.
      const originalBlob = imageFile; // O imageFile já é o blob cortado

      if (originalBlob.size === 0) {
        throw new Error('O ficheiro cortado resultou num Blob vazio. Não é possível fazer upload.');
      }

      // Redimensiona para o thumbnail a partir do originalBlob (que é o cortado)
      const thumbnailBlob = await resizeImageToBlob(originalBlob, 320, 240);
      console.log('Thumbnail gerado. Tamanho:', thumbnailBlob.size, 'bytes');

      if (thumbnailBlob.size === 0) {
        throw new Error('O thumbnail gerado resultou num Blob vazio. Não é possível fazer upload.');
      }

      // O nome do arquivo pode ser um UUID para o blob, ou manter parte do nome original se o imageFile for um File
      const fileName = `${title.replace(/\s/g, '_') || 'image'}-${Date.now()}`;
      const originalStorageRef = ref(storage, `images/${userId}/${fileName}`);
      const thumbnailStorageRef = ref(storage, `thumbnails/${userId}/${fileName}-thumb`); // Nome diferente para thumb

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
    setCurrentImageUrl(image.imageUrl);
    setCurrentThumbnailUrl(image.thumbnailUrl);
    setImageFile(null);
    setUploadError(null);
    setUploadProgress(0);
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) fileInput.value = '';
    // >>> NOVO: Resetar estados do cropper ao entrar em modo de edição
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, []);

  // >>> MODIFICADO: handleUpdate para usar o imageFile (croppedBlob)
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
        // Se um novo arquivo (já cortado e em Blob) foi selecionado
        const originalBlob = imageFile; // Já é o blob cortado
        const thumbnailBlob = await resizeImageToBlob(originalBlob, 320, 240); // Redimensiona para thumbnail

        if (originalBlob.size === 0 || thumbnailBlob.size === 0) {
          throw new Error('O ficheiro redimensionado resultou num Blob vazio. Não é possível fazer upload.');
        }

        const fileName = `${title.replace(/\s/g, '_') || 'image'}-${Date.now()}`;
        const originalStorageRef = ref(storage, `images/${userId}/${fileName}`);
        const thumbnailStorageRef = ref(storage, `thumbnails/${userId}/${fileName}-thumb`);

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

        // Opcional: Excluir a imagem antiga do Storage, se houver e for diferente
        if (currentImageUrl && currentImageUrl !== newImageUrl) {
          try {
            const oldOriginalRef = ref(storage, currentImageUrl);
            await deleteObject(oldOriginalRef);
            console.log('Imagem original antiga excluída do Storage.');
          } catch (deleteError) {
            console.warn('Falha ao excluir imagem original antiga do Storage:', deleteError.message);
          }
        }
        if (currentThumbnailUrl && currentThumbnailUrl !== newThumbnailUrl) {
          try {
            const oldThumbnailRef = ref(storage, currentThumbnailUrl);
            await deleteObject(oldThumbnailRef);
            console.log('Thumbnail antiga excluída do Storage.');
          } catch (deleteError) {
            console.warn('Falha ao excluir thumbnail antiga do Storage:', deleteError.message);
          }
        }
      } else if (!currentImageUrl) {
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
        lastUpdated: serverTimestamp(),
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
      setIsUploading(true);

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
            disabled={isUploading || !title.trim() || (!imageFile && !isEditing)} // Desabilita se não tiver imageFile para upload novo
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

      {/* >>> NOVO: Modal para o Cropper */}
      <Dialog
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)} // Permite fechar sem cortar, mas o arquivo não será definido
        maxWidth="lg"
        fullWidth
        aria-labelledby="crop-image-dialog-title"
      >
        <DialogContent
          dividers
          sx={{
            minHeight: '400px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Typography variant="h6" component="h2" id="crop-image-dialog-title" sx={{ mb: 2 }}>
            Cortar Imagem
          </Typography>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 300, // Altura fixa para o cropper
              background: '#333',
            }}
          >
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
                // Adicione estilos para a área do corte (opcional)
                cropShape="rect" // ou "round"
                showGrid={true}
              />
            )}
          </Box>
          <Box sx={{ width: '80%', mt: 3, mb: 2 }}>
            <Typography gutterBottom>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="zoom-slider"
              onChange={(e, newZoom) => onZoomChange(newZoom)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCropModalOpen(false);
            setImageFile(null); // Limpa o arquivo se o usuário cancelar o corte
            const fileInput = document.getElementById('image-upload-input');
            if (fileInput) fileInput.value = '';
          }} color="error">
            Cancelar
          </Button>
          <Button onClick={handleCropImage} variant="contained" color="primary">
            Cortar e Usar Imagem
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default memo(ImageUploaderGallery);