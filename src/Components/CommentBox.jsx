import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    deleteDoc,
    doc
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
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import Editor from './Editor'; // Assuming Editor can be controlled or reset via ref
import { resizeImage } from '../shared/Util';

const TypographyTitle = lazy(() => import('./TypographyTitle'));

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '').trim();

function CommentBox({ itemID }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('BR');
    const [comment, setComment] = useState(''); // This holds the HTML content from the editor
    const [ipAddress, setIpAddress] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [image, setImage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const editorRef = useRef(null);
    const commentFormRef = useRef(null);
    const fileInputRef = useRef(null); // Ref para input file

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
                if (!name) setName(user.displayName || '');
                if (!email) setEmail(user.email || '');
            } else {
                setName('');
                setEmail('');
            }
        });

        return () => unsubscribe();
    }, []);

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
            if (typeof editorRef.current.focus === 'function') {
                editorRef.current.focus();
            } else if (editorRef.current.editor && typeof editorRef.current.editor.focus === 'function') {
                editorRef.current.editor.focus();
            }
        }
    }, [replyingTo]);

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
    }, [itemID]);

    const groupComments = (list) => {
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
        return roots.sort((a, b) => b.timestamp - a.timestamp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !country.trim() || !stripHtml(comment)) {
            showMessage('Por favor, preencha o nome, selecione o país e digite seu comentário.', 'warning');
            return;
        }

        if (image && !currentUser) {
            showMessage('Você precisa estar logado para enviar uma imagem.', 'warning');
            return;
        }

        try {
            await addDoc(collection(db, 'comments'), {
                name: name.trim(),
                email: email.trim() || null,
                country,
                text: comment.trim(),
                timestamp: Date.now(),
                itemID,
                userPhoto: currentUser?.photoURL || null,
                ip: ipAddress,
                userId: currentUser?.uid || null,
                parentId: replyingTo?.id || null,
                image: image || null,
            });

            // Limpa os campos após enviar
            setName('');          // Limpa nome
            setEmail('');         // Limpa email
            setCountry('BR');     // Reseta país para BR
            setComment('');       // Limpa conteúdo do editor
            setImage(null);       // Limpa imagem
            setReplyingTo(null);  // Limpa reply

            // Limpa editor via ref
            if (editorRef.current && editorRef.current.editor) {
                editorRef.current.editor.setText('');
            }

            // Limpa input de arquivo via ref
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

            showMessage('Comentário adicionado com sucesso!', 'success');
        } catch (err) {
            console.error("Erro ao adicionar comentário:", err);
            showMessage('Erro ao adicionar comentário: ' + err.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!currentUser) {
            showMessage('Você precisa estar logado para remover comentários.', 'warning');
            return;
        }
        try {
            if (window.confirm("Tem certeza que deseja remover este comentário?")) {
                await deleteDoc(doc(db, 'comments', id));
                showMessage('Comentário removido com sucesso!', 'success');
            }
        } catch (err) {
            console.error("Erro ao remover comentário:", err);
            showMessage('Erro ao remover comentário: ' + err.message, 'error');
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const renderComment = (comment) => (
        <Card key={comment.id} sx={{ mb: 2, mt: 2, p: 1, ml: comment.parentId ? 4 : 0 }}>
            <CardHeader
                avatar={comment.userPhoto ? <Avatar src={comment.userPhoto} /> : <Avatar><AccountCircle /></Avatar>}
                title={`${comment.name} (${comment.country})`}
                subheader={new Date(comment.timestamp).toLocaleString('pt-BR')}
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
                    {comment.replies.sort((a, b) => a.timestamp - b.timestamp).map(renderComment)}
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
                        if (editorRef.current && editorRef.current.editor) {
                            editorRef.current.editor.setText('');
                        }
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
                />
                <TextField
                    label="E-mail (opcional)"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
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
                                return;
                            }
                            const file = e.target.files[0];
                            if (!file) return;
                            const resized = await resizeImage(file);
                            setImage(resized);
                        }}
                    />
                    {image && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption">Imagem selecionada: {image.substring(0, 30)}...</Typography>
                            <Button size="small" onClick={() => setImage(null)}>Remover Imagem</Button>
                        </Box>
                    )}
                </Box>

                <Button type="submit" variant="contained" sx={{ backgroundColor: '#78884c' }}>
                    Enviar comentário
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
