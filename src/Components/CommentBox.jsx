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
import Editor from './Editor';
import { resizeImage } from '../shared/Util';
import { getItemCreatorDetails } from '../utils/itemUtils'; // Import the new helper

const TypographyTitle = lazy(() => import('./TypographyTitle'));

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '').trim();

// Define a default anonymous avatar URL
const DEFAULT_ANONYMOUS_AVATAR = '/path/to/your/default-avatar.png'; // <-- ADJUST THIS PATH

// Basic email validation regex
const validateEmail = (email) => {
    if (!email) return true; // Email is optional, so empty is valid
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
    const [emailError, setEmailError] = useState(false); // New state for email validation

    const editorRef = useRef(null);
    const commentFormRef = useRef(null);
    const fileInputRef = useRef(null);

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
                // Pre-fill name/email only if they aren't already set by the user
                if (!name) setName(user.displayName || '');
                if (!email) setEmail(user.email || '');
            } else {
                // Clear only if the user was previously logged in and now logged out
                // or if the fields were not explicitly filled before logout
                setName('');
                setEmail('');
            }
        });

        return () => unsubscribe();
    }, []); // Removed name, email from dependencies to avoid re-setting if user types

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

        // **Email Validation Check**
        if (email && !validateEmail(email)) {
            setEmailError(true);
            showMessage('Por favor, insira um endereço de e-mail válido.', 'error');
            return;
        } else {
            setEmailError(false);
        }

        // Ensure comment has text and name/country are filled
        if (!name.trim() || !country.trim() || !stripHtml(comment)) {
            showMessage('Por favor, preencha o nome, selecione o país e digite seu comentário.', 'warning');
            return;
        }

        // Only allow image uploads for logged-in users to simplify security/storage logic
        if (image && !currentUser) {
            showMessage('Você precisa estar logado para enviar uma imagem.', 'warning');
            return;
        }

        try {
            const commentDocRef = await addDoc(collection(db, 'comments'), {
                name: name.trim(),
                email: email.trim() || null,
                country,
                text: comment.trim(),
                timestamp: Date.now(),
                itemID,
                userPhoto: currentUser?.photoURL || null, // Storing logged-in user photo or null
                ip: ipAddress,
                userId: currentUser?.uid || null, // Storing logged-in user UID or null for anonymous
                parentId: replyingTo?.id || null,
                image: image || null,
            });

            // --- Notification Logic for Comments ---
            const { creatorId, itemTitle } = await getItemCreatorDetails(itemID);

            // Only send notification if:
            // 1. We found the item's creator.
            // 2. The sender is not the item's creator (avoids self-notifications).
            // 3. The recipientId is valid (i.e., not null).
            if (creatorId && creatorId !== (currentUser?.uid || null)) {
                await addDoc(collection(db, 'notifications'), {
                    recipientId: creatorId, // The user who owns the item being commented on
                    senderId: currentUser?.uid || null, // Sender UID (null if anonymous)
                    senderName: currentUser?.displayName || name.trim() || 'Usuário Anônimo', // Fallback for anonymous
                    senderPhoto: currentUser?.photoURL || DEFAULT_ANONYMOUS_AVATAR, // Fallback for anonymous
                    type: 'comment',
                    itemId: itemID,
                    itemTitle: itemTitle,
                    commentText: stripHtml(comment).substring(0, 100), // Max 100 chars for snippet
                    timestamp: Date.now(),
                    read: false,
                    link: `/item/${itemID}#${commentDocRef.id}`, // Example link: adjust based on your routing
                });
            }
            // --- END Notification ---

            // Clear form fields after submission
            if (!currentUser) { // Only clear name/email if not logged in to preserve pre-filled values
                setName('');
                setEmail('');
            }
            setCountry('BR');
            setComment('');
            setImage(null);
            setReplyingTo(null);

            if (editorRef.current && editorRef.current.editor) {
                editorRef.current.editor.setText('');
            }

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
            // Get the comment data to check if the current user is the author
            const commentToDelete = comments.find(c => c.id === id);
            if (!commentToDelete) {
                showMessage('Comentário não encontrado.', 'error');
                return;
            }

            // Check if current user is the comment author or an admin
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
                    // Allow deletion if current user is the owner or an admin
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
                    // Disable if logged in to prevent user from changing pre-filled name
                    disabled={!!currentUser}
                />
                <TextField
                    label="E-mail (opcional)"
                    type="email" // Changed type to email for better mobile keyboard
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(false); // Clear error on change
                    }}
                    fullWidth
                    sx={{ mb: 2 }}
                    // Disable if logged in to prevent user from changing pre-filled email
                    disabled={!!currentUser}
                    error={emailError} // Apply error style
                    helperText={emailError ? "Endereço de e-mail inválido" : ""} // Show error message
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
                            if (!currentUser) { // Image upload still restricted to logged-in users
                                showMessage('Você precisa estar logado para enviar uma imagem.', 'warning');
                                // Clear the selected file if not allowed
                                e.target.value = null;
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
                            <Button size="small" onClick={() => { setImage(null); if(fileInputRef.current) fileInputRef.current.value = null; }}>Remover Imagem</Button>
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