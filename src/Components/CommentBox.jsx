
import React, { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    deleteDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import {
    Button,
    Snackbar,
    Alert,
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Avatar,
    IconButton,
    FormHelperText,
    FormControl,
    TextField,
    LinearProgress, // Manter LinearProgress, mas o progresso será para o redimensionamento/leitura
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import Editor from './Editor';
import { resizeImage } from '../shared/Util'; 
import { logUserAction } from '../shared/firebase-logger'; 

const TypographyTitle = lazy(() => import('./TypographyTitle'));

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '').trim();

const DEFAULT_ANONYMOUS_AVATAR = '/images/default-avatar.png';

const validateEmail = (email) => {
    if (!email) return true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

function CommentBox({ itemID }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('BR');
    const [comment, setComment] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [image, setImage] = useState(null); // Armazenará a Base64 URL
    const [currentUser, setCurrentUser] = useState(null);
    const [emailError, setEmailError] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0); // Renomeado para progresso de processamento local
    const [isProcessingImage, setIsProcessingImage] = useState(false); // Renomeado para indicar processamento local da imagem

    const editorRef = useRef(null);
    const commentFormRef = useRef(null);
    const fileInputRef = useRef(null);

    const showMessage = useCallback((msg, type) => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    }, []);

    const handleClose = useCallback((_, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    }, []);

    useEffect(() => {
        if (replyingTo && commentFormRef.current) {
            commentFormRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [replyingTo]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            if (user) {
                if (!name && user.displayName) setName(user.displayName);
                if (!email && user.email) setEmail(user.email);
            } else {
                if (currentUser && currentUser.uid) {
                    setName('');
                    setEmail('');
                }
            }
        });

        return () => unsubscribe();
    }, [currentUser, name, email]);

    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setIpAddress(data.ip);
            } catch (error) {
                console.error('Erro ao obter o endereço IP:', error);
                setIpAddress(null);
            }
        };
        fetchIpAddress();
    }, []);

    useEffect(() => {
        if (replyingTo && editorRef.current) {
            if (editorRef.current.editor && typeof editorRef.current.editor.focus === 'function') {
                editorRef.current.editor.focus();
            }
        }
    }, [replyingTo]);

    const groupComments = useCallback((list) => {
        const map = {};
        list.forEach(c => (map[c.id] = { ...c, replies: [] }));
        const roots = [];
        list.forEach(c => {
            if (c.parentId && map[c.parentId]) {
                map[c.parentId].replies.push(map[c.id]);
            } else {
                roots.push(map[c.id]);
            }
        });
        Object.values(map).forEach(comment => {
            if (comment.replies) {
                comment.replies.sort((a, b) => a.timestamp - b.timestamp);
            }
        });
        return roots.sort((a, b) => b.timestamp - a.timestamp);
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, 'comments'),
            where('itemID', '==', itemID),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(groupComments(fetched));
        });

        return unsubscribe;
    }, [itemID, groupComments]);

    const clearEditor = useCallback(() => {
        if (editorRef.current && editorRef.current.editor) {
            editorRef.current.editor.setText('');
            editorRef.current.editor.setContents([{ insert: '\n' }]);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email && !validateEmail(email)) {
            setEmailError(true);
            showMessage('Por favor, insira um endereço de e-mail válido.', 'error');
            return;
        } else {
            setEmailError(false);
        }

        if (!name.trim() || !country.trim() || !stripHtml(comment)) {
            showMessage('Por favor, preencha o nome, selecione o país e digite seu comentário.', 'warning');
            return;
        }

        if (image && !currentUser) {
            showMessage('Você precisa estar logado para enviar uma imagem.', 'warning');
            return;
        }

        // isProcessingImage agora cobre tanto o carregamento da imagem quanto a submissão
        setIsProcessingImage(true); 

        try {
            const commentData = {
                name: name.trim(),
                email: email.trim() || null,
                country,
                text: comment.trim(),
                timestamp: serverTimestamp(),
                itemID,
                userPhoto: currentUser?.photoURL || DEFAULT_ANONYMOUS_AVATAR,
                ip: ipAddress,
                userId: currentUser?.uid || null,
                image: image || null, 
            };

            await addDoc(collection(db, 'comments'), commentData);

             logUserAction('Comentários', { elementId: itemID, 
                            details: commentData
                         });

            // Limpa os campos do formulário após o envio
            if (!currentUser) {
                setName('');
                setEmail('');
            }
            setCountry('BR');
            setComment('');
            setImage(null); // Limpa a Base64 URL da imagem
            setReplyingTo(null);
            setProcessingProgress(0); // Reseta o progresso
            setIsProcessingImage(false); // Libera o formulário

            clearEditor();

            if (fileInputRef.current) {
                fileInputRef.current.value = null; // Limpa o input de arquivo
            }

            showMessage('Comentário adicionado com sucesso!', 'success');
        } catch (err) {
            console.error("Erro ao adicionar comentário:", err);
            // Mensagem de erro mais específica para o caso de documento muito grande
            if (err.code === 'resource-exhausted') {
                 showMessage('Erro: Imagem muito grande para ser salva. Por favor, escolha uma imagem menor.', 'error');
            } else {
                 showMessage('Erro ao adicionar comentário: ' + err.message, 'error');
            }
            setIsProcessingImage(false); // Em caso de erro, libera o formulário
        }
    };

   const handleDelete = async (id) => {
        if (!currentUser) {
            showMessage('Você precisa estar logado para remover comentários.', 'warning');
            return;
        }
        try {
            const commentToDelete = comments.find(c => c.id === id);
            if (!commentToDelete) {
                showMessage('Comentário não encontrado.', 'error');
                return;
            }

            const isAdmin = currentUser.uid === process.env.REACT_APP_ADMIN_UID;
            const isAuthor = currentUser.uid === commentToDelete.userId;

            if (isAuthor || isAdmin) { // This is where the rule is applied
                if (window.confirm("Tem certeza que deseja remover este comentário?")) {
                    await deleteDoc(doc(db, 'comments', id));
                    showMessage('Comentário removido com sucesso!', 'success');
                }
            } else {
                showMessage('Você não tem permissão para remover este comentário.', 'warning');
            }
        } catch (err) {
            console.error("Erro ao remover comentário:", err);
            showMessage('Erro ao remover comentário: ' + err.message, 'error');
        }
    };
    
    const renderComment = (comment) => (
        <Card key={comment.id} sx={{ mb: 2, mt: 2, p: 1, ml: comment.parentId ? 4 : 0 }} id={comment.id}>
            <CardHeader
                avatar={comment.userPhoto ? <Avatar src={comment.userPhoto} /> : <Avatar><AccountCircle /></Avatar>}
                title={`${comment.name} (${comment.country})${comment.ip ? ` - IP: ${comment.ip}` : ''}`}
                subheader={new Date(comment.timestamp?.toDate ? comment.timestamp.toDate() : comment.timestamp).toLocaleString('pt-BR')} 
                action={
                    currentUser && (comment.userId === currentUser.uid || currentUser.uid === process.env.REACT_APP_ADMIN_UID) && (
                        <IconButton onClick={() => handleDelete(comment.id)} color="error">
                            <DeleteIcon />
                        </IconButton>
                    )
                }
            />
            <CardContent>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    <span dangerouslySetInnerHTML={{ __html: comment.text }} />
                </Typography>
                {comment.image && (
                    <img
                        src={comment.image} // Aqui vai a Base64 URL
                        alt="Comentário com imagem"
                        style={{
                            maxWidth: '240px',
                            height: 'auto',
                            marginTop: '10px',
                            borderRadius: '6px',
                            display: 'block'
                        }}
                    />
                )}
                <Box mt={1}>
                    <Button size="small" onClick={() => setReplyingTo(comment)}>Responder</Button>
                </Box>
                <Box sx={{ ml: 2 }}>
                    {comment.replies.sort((a, b) => a.timestamp?.toDate ? a.timestamp.toDate() - b.timestamp.toDate() : a.timestamp - b.timestamp).map(renderComment)}
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ width: { xs: '100%', sm: '90%', md: '80%', lg: '70%', xl: '80%' }, m: '0 auto', p: '0 20px', mt: 10 }}>
            <Suspense fallback={<Skeleton variant="text" height={100} />}>
                <TypographyTitle src="Comentários" />
            </Suspense>

            {replyingTo && (
                <Box mb={2}>
                    <Typography component="div" variant="body2">Respondendo a: <strong>{replyingTo.name}</strong></Typography>
                    <Button size="small" onClick={() => {
                        setReplyingTo(null);
                        setComment('');
                        clearEditor();
                    }}>Cancelar</Button>
                </Box>
            )}

            <form onSubmit={handleSubmit} ref={commentFormRef}>
                <TextField
                    label="Nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    disabled={!!currentUser || isProcessingImage} // Desabilita se logado ou durante o processamento
                />
                <TextField
                    label="E-mail (opcional)"
                    type="email"
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(false);
                    }}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={!!currentUser || isProcessingImage} // Desabilita se logado ou durante o processamento
                    error={emailError}
                    helperText={emailError ? "Endereço de e-mail inválido" : ""}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <ReactFlagsSelect
                        selected={country}
                        onSelect={code => setCountry(code)}
                        countries={["BR", "US", "FR", "DE", "IN"]}
                        customLabels={{ BR: "Brasil", US: "EUA", FR: "França", DE: "Alemanha", IN: "Índia" }}
                        showSelectedLabel
                        showOptionLabel
                        placeholder="Selecione o país"
                        disabled={isProcessingImage} // Desabilita durante o processamento
                    />
                    <FormHelperText>Selecione o país</FormHelperText>
                </FormControl>

                <Box sx={{ mb: 2 }}>
                    <Editor
                        onContentChange={setComment}
                        defaultValue={comment}
                        height="250px"
                        editorRef={editorRef}
                        key={replyingTo ? `editor-${replyingTo.id}` : 'editor-new-comment'}
                        readOnly={isProcessingImage} // Desabilita durante o processamento
                    />
                </Box>

                <Box sx={{ position: "relative", mb: 2 }}>
                    <input
                        ref={fileInputRef}
                        accept="image/*"
                        type="file"
                        onChange={async (e) => {
                            if (!currentUser) {
                                showMessage('Você precisa estar logado para enviar uma imagem.', 'warning');
                                e.target.value = null;
                                return;
                            }
                            const file = e.target.files[0];
                            if (!file) return;

                            setIsProcessingImage(true); // Inicia o estado de processamento
                            setProcessingProgress(50); // Simula algum progresso para o redimensionamento/leitura

                            try {
                                // CHAMA SUA FUNÇÃO resizeImage (QUE RETORNA BASE64)
                                // Você pode ajustar maxWidth, maxHeight e quality aqui se quiser
                                const base64Image = await resizeImage(file, 800, 600, 0.7); 
                                setImage(base64Image); // Define a Base64 URL no estado
                                showMessage('Imagem carregada e processada!', 'success');
                            } catch (error) {
                                console.error("Erro ao processar a imagem:", error);
                                showMessage("Erro ao processar a imagem. Tente novamente.", "error");
                                e.target.value = null; // Limpa o input de arquivo
                                setImage(null); // Garante que o estado da imagem é limpo
                            } finally {
                                setIsProcessingImage(false); // Finaliza o estado de processamento
                                setProcessingProgress(0); // Reseta o progresso
                            }
                        }}
                        disabled={isProcessingImage} // Desabilita o input de arquivo durante o processamento
                    />
                    {isProcessingImage && ( // Mostra a barra de progresso apenas se isProcessingImage for true
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress variant="determinate" value={processingProgress} />
                            <Typography variant="caption" color="text.secondary">{processingProgress}%</Typography>
                        </Box>
                    )}
                    {image && !isProcessingImage && ( // Mostra a pré-visualização e o botão "Remover"
                        <Box sx={{ mt: 1 }}>
                            <img
                                src={image} // Pré-visualização da imagem Base64
                                alt="Pré-visualização"
                                style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', marginRight: '10px' }}
                            />
                            <Typography variant="caption">Imagem selecionada ({Math.floor(image.length / 1024)} KB)</Typography>
                            <Button size="small" onClick={() => { setImage(null); if(fileInputRef.current) fileInputRef.current.value = null; }}>Remover Imagem</Button>
                        </Box>
                    )}
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: '#78884c' }}
                    // O botão é desabilitado durante o processamento/submissão, ou se campos obrigatórios estão vazios/inválidos
                    disabled={isProcessingImage || !name.trim() || !country.trim() || !stripHtml(comment) || emailError}
                >
                    {isProcessingImage ? 'Processando...' : 'Enviar comentário'}
                </Button>
            </form>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

            {comments.map(renderComment)}
        </Box>
    );
}

export default React.memo(CommentBox);