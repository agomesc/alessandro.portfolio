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
    LinearProgress,
} from '@mui/material';

import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import Editor from './Editor';
import { resizeImage } from '../shared/Util';
import { logUserAction } from '../shared/firebase-logger';

const TypographyTitle = lazy(() => import('./TypographyTitle'));

const stripHtml = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

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
    const [image, setImage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [emailError, setEmailError] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [isProcessingImage, setIsProcessingImage] = useState(false);

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
                setName(prev => prev || user.displayName || '');
                setEmail(prev => prev || user.email || '');
            } else {
                setName('');
                setEmail('');
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setIpAddress(data.ip);
            } catch {
                setIpAddress(null);
            }
        };
        fetchIpAddress();
    }, []);

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
                comment.replies = [...comment.replies].sort((a, b) => a.timestamp - b.timestamp);
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
        if (editorRef.current?.editor) {
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
        }
        if (!name.trim() || !country.trim() || !stripHtml(comment)) {
            showMessage('Por favor, preencha o nome, selecione o país e digite seu comentário.', 'warning');
            return;
        }
        if (image && !currentUser) {
            showMessage('Você precisa estar logado para enviar uma imagem.', 'warning');
            return;
        }
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
            logUserAction('Comentários', { elementId: itemID, details: commentData });
            if (!currentUser) {
                setName('');
                setEmail('');
            }
            setCountry('BR');
            setComment('');
            setImage(null);
            setReplyingTo(null);
            setProcessingProgress(0);
            setIsProcessingImage(false);
            clearEditor();
            if (fileInputRef.current) fileInputRef.current.value = null;
            showMessage('Comentário adicionado com sucesso!', 'success');
        } catch (err) {
            showMessage('Erro ao adicionar comentário: ' + err.message, 'error');
            setIsProcessingImage(false);
        }
    };

    const handleDelete = useCallback(async (id) => {
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
            if (isAuthor || isAdmin) {
                if (window.confirm("Tem certeza que deseja remover este comentário?")) {
                    await deleteDoc(doc(db, 'comments', id));
                    showMessage('Comentário removido com sucesso!', 'success');
                }
            } else {
                showMessage('Você não tem permissão para remover este comentário.', 'warning');
            }
        } catch (err) {
            showMessage('Erro ao remover comentário: ' + err.message, 'error');
        }
    }, [comments, currentUser, showMessage]);

    const renderComment = useCallback((comment) => (
        <Suspense key={comment.id} fallback={null}>
            <Card sx={{ mb: 2, mt: 2, p: 1, ml: comment.parentId ? 4 : 0 }} id={comment.id}>
                <CardHeader
                    avatar={comment.userPhoto ? <Avatar src={comment.userPhoto} /> : <Avatar><AccountCircle /></Avatar>}
                    title={`${comment.name} (${comment.country})`}
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
                            src={comment.image}
                            alt="Comentário com imagem"
                            style={{ maxWidth: '240px', height: 'auto', marginTop: '10px', borderRadius: '6px', display: 'block' }}
                        />
                    )}
                    <Box mt={1}>
                        <Button size="small" onClick={() => setReplyingTo(comment)}>Responder</Button>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                        {[...comment.replies].sort((a, b) => a.timestamp - b.timestamp).map(renderComment)}
                    </Box>
                </CardContent>
            </Card>
        </Suspense>
    ), [currentUser, handleDelete]);

    return (
        <Suspense fallback={null}>
            <Box sx={{ width: { xs: '100%', sm: '90%', md: '80%', lg: '70%', xl: '80%' }, m: '0 auto', p: '0 20px', mt: 10 }}>
                <TypographyTitle src="Comentários" />
                {replyingTo && (
                    <Box mb={2}>
                        <Typography variant="body2">Respondendo a: <strong>{replyingTo.name}</strong></Typography>
                        <Button size="small" onClick={() => { setReplyingTo(null); setComment(''); clearEditor(); }}>Cancelar</Button>
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
                        disabled={!!currentUser || isProcessingImage}
                    />
                    <TextField
                        label="E-mail (opcional)"
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
                        fullWidth
                        sx={{ mb: 2 }}
                        disabled={!!currentUser || isProcessingImage}
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
                            disabled={isProcessingImage}
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
                            readOnly={isProcessingImage}
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
                                setIsProcessingImage(true);
                                setProcessingProgress(50);
                                try {
                                    const base64Image = await resizeImage(file, 800, 600, 0.7);
                                    setImage(base64Image);
                                    showMessage('Imagem carregada e processada!', 'success');
                                } catch {
                                    showMessage("Erro ao processar a imagem. Tente novamente.", "error");
                                    e.target.value = null;
                                    setImage(null);
                                } finally {
                                    setIsProcessingImage(false);
                                    setProcessingProgress(0);
                                }
                            }}
                            disabled={isProcessingImage}
                        />
                        {isProcessingImage && (
                            <Box sx={{ width: '100%', mt: 1 }}>
                                <LinearProgress variant="determinate" value={processingProgress} />
                                <Typography variant="caption" color="text.secondary">{processingProgress}%</Typography>
                            </Box>
                        )}
                        {image && !isProcessingImage && (
                            <Box sx={{ mt: 1 }}>
                                <img src={image} alt="Pré-visualização" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', marginRight: '10px' }} />
                                <Typography variant="caption">Imagem selecionada ({Math.floor(image.length / 1024)} KB)</Typography>
                                <Button size="small" onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = null; }}>Remover Imagem</Button>
                            </Box>
                        )}
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ backgroundColor: "var(--primary-color)", color: "var(--text-color)", '&:hover': { backgroundColor: 'var(--secondary-color)' } }}
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
        </Suspense>
    );
}

export default React.memo(CommentBox);
