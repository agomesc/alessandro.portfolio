import { useEffect, useState, useMemo, useCallback, lazy } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Skeleton from '@mui/material/Skeleton';
import { motion } from "framer-motion"; // 'motion' is imported but not used in the provided JSX. Consider removing if not used.

import {
    AppBar, Toolbar, IconButton, Typography, Box, Drawer, Divider,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Collapse, Avatar
} from "@mui/material";

import {
    Menu as MenuIcon,
    Info as InfoIcon,
    PhotoLibrary as PhotoLibraryIcon,
    ArtTrack as ArtTrackIcon,
    DynamicFeed as DynamicFeedIcon,
    Policy as PolicyIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Home as HomeIcon,
    ExpandMore as ExpandMoreIcon,
    ShoppingCart as ShoppingCartIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    Calculate as CalculateIcon,
    ContactMail as ContactMailIcon,
    Brush as BrushIcon // Changed from BrushIcon as Working to Brush for standard naming
} from "@mui/icons-material";

import { signInWithPopup, signOut } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";

import CreateFlickrApp from "../shared/CreateFlickrApp";

const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));
const ContactForm = lazy(() => import('./ContactForm')); // This import isn't used in the provided code, so it can likely be removed if not needed elsewhere.

const TemporaryDrawer = ({ darkMode, toggleTheme }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [openSub, setOpenSub] = useState(false); // Controls the "Minhas Galerias" collapse
    const [openEquipamentos, setOpenEquipamentos] = useState(false); // Controls the "Equipamentos" collapse
    const [galleryData, setGalleryData] = useState([]);
    const instance = useMemo(() => CreateFlickrApp(), []);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [user, setUser] = useState(null);

    // Fetch gallery data on component mount
    useEffect(() => {
        if (galleryData.length === 0) {
            instance.getGallery()
                .then(setGalleryData)
                .catch((error) => {
                    setSnackbarMessage("Erro ao carregar as galerias: " + error.message);
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                });
        }
    }, [galleryData, instance]);

    // Firebase authentication state listener
    useEffect(() => {
        const unsubscribe = firebaseConfig.auth.onAuthStateChanged((usr) => {
            if (usr) {
                setUser(usr);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Memoized callback to toggle the main drawer
    const toggleDrawer = useCallback((newOpen) => () => {
        setOpen(newOpen);
    }, []);

    // Close snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Handle user login with Firebase
    const handleLogin = () => {
        signInWithPopup(firebaseConfig.auth, firebaseConfig.provider)
            .then((result) => {
                const usr = result.user;
                setUser(usr);
                setSnackbarMessage(`Bem-vindo, ${usr.displayName || "usuário"}!`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                // Close all drawers/collapses after login for a cleaner UX
                setOpen(false);
                setOpenEquipamentos(false);
                setOpenSub(false);

                // Reload window after a short delay to reflect login state, if necessary
                window.setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
            .catch((error) => {
                setSnackbarMessage("Erro ao fazer login: " + error.message);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    // Handle user logout with Firebase
    const handleLogout = () => {
        signOut(firebaseConfig.auth)
            .then(() => {
                setUser(null);
                setSnackbarMessage("Desconectado com sucesso.");
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
                // Reload window after a short delay, if necessary
                window.setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
            .catch((error) => {
                setSnackbarMessage("Erro ao desconectar: " + error.message);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    // Memoized list of navigation items
    const items = useMemo(() => {
        const baseItems = [
            { route: "/Home", description: "Home", isChild: false, icon: <HomeIcon /> },
            { route: "JavaScript:void(0);", description: "Minhas Galerias", isChild: false, icon: <PhotoLibraryIcon />, isParentGallery: true }
        ];

        const galleryItems = galleryData.map((item) => ({
            route: `/Photos/${item.id}?`,
            description: item.title,
            isChild: true,
            icon: <ArtTrackIcon />,
            parent: "Minhas Galerias"
        }));

        const equipamentosGroup = [
            { route: "JavaScript:void(0);", description: "Equipamentos", isChild: false, icon: <AdminPanelSettingsIcon />, isEquipamentos: true },
            { route: "/EquipmentValueCalculator", description: "Calcular valor de equipamentos usados", isChild: true, icon: <CalculateIcon />, parent: "Equipamentos" },
        ];

        const additionalItems = [
            { route: "/LatestPhotos", description: "Atualizações", isChild: false, icon: <DynamicFeedIcon /> },
            { route: "/latestPhotosWorks", description: "Atualizações Trabalhos", isChild: false, icon: <BrushIcon /> },
            { route: "/ListContentWithPagination", description: "Seleção de Ofertas", isChild: false, icon: <ShoppingCartIcon /> },
            { route: "/Privacidade", description: "Política de Privacidade", isChild: false, icon: <PolicyIcon /> },
            { route: "/Transparencia", description: "Transparência", isChild: false, icon: <AdminPanelSettingsIcon /> },
            { route: "/About", description: "Sobre", isChild: false, icon: <InfoIcon /> },
            { route: "/contactForm", description: "Contato", isChild: false, icon: <ContactMailIcon /> },
        ];

        return [...baseItems, ...galleryItems, ...equipamentosGroup, ...additionalItems];
    }, [galleryData]);

    const DrawerList = (
        <Box sx={{ width: 250, bgcolor: theme.palette.background.default, color: theme.palette.text.primary }} role="presentation">
            <Divider />
            <nav>
                <List>
                    {items.map((item, index) => {
                        const isChild = item.isChild;
                        // Determine if the current item is a parent of the "Minhas Galerias" section
                        const isParentOfGalleries = item.isParentGallery;
                        const isEquipamentosParent = item.isEquipamentos;

                        if (!isChild) {
                            return (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        component={item.route.startsWith("JavaScript") ? "div" : Link}
                                        to={item.route.startsWith("JavaScript") ? undefined : item.route}
                                        onClick={(event) => {
                                            if (item.route.startsWith("JavaScript")) {
                                                event.preventDefault(); // Prevent default link behavior for parent items
                                            }
                                            if (isEquipamentosParent) {
                                                setOpenEquipamentos(!openEquipamentos);
                                            } else if (isParentOfGalleries) {
                                                setOpenSub(!openSub);
                                            } else {
                                                setOpen(false); // Close drawer if it's a regular link
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.description} />
                                        {(isEquipamentosParent || isParentOfGalleries) && (
                                            <ExpandMoreIcon
                                                sx={{
                                                    transform: isEquipamentosParent ? (openEquipamentos ? 'rotate(180deg)' : 'rotate(0deg)') : (openSub ? 'rotate(180deg)' : 'rotate(0deg)'),
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            );
                        } else {
                            const openChild = item.parent === "Equipamentos" ? openEquipamentos : openSub;
                            return (
                                <Collapse in={openChild} timeout="auto" unmountOnExit key={index}>
                                    <List component="div" disablePadding>
                                        <ListItemButton sx={{ pl: 4 }} component={Link} to={item.route} onClick={() => setOpen(false)}>
                                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.description} />
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            );
                        }
                    })}

                    {/* Theme Toggle Button */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={toggleTheme}>
                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                            </ListItemIcon>
                            <ListItemText primary={darkMode ? "Modo Claro" : "Modo Escuro"} />
                        </ListItemButton>
                    </ListItem>

                    {/* Login/Logout for Drawer */}
                    {!user ? (
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogin}>
                                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                    <AdminPanelSettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemIcon>
                                    <Avatar src={user.photoURL} alt={user.displayName || "Usuário"} />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </nav>
            <Divider />
        </Box>
    );

    // Show skeleton loader while gallery data is being fetched
    if (!galleryData.length) return <Skeleton variant="rectangular" height="auto" width="100%" />;

    return (
        <div>
            {/* AppBar is always present and handles drawer toggle and theme toggle */}
            <AppBar position="fixed" sx={{ top: 0, bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, display: 'flex' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        sx={{ color: theme.palette.primary.main, mr: 2 }}
                        aria-label="Abrir menu de navegação"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {/* You can add a title or logo here if desired */}
                    </Typography>
                    <IconButton
                        size="large"
                        onClick={toggleTheme}
                        sx={{
                            bgcolor: theme.palette.action.hover,
                            color: theme.palette.text.primary,
                            borderRadius: '50%',
                        }}
                        aria-label="Alternar tema"
                    >
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer (now the only navigation method) */}
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>

            {/* Snackbar for messages */}
            <MessageSnackbar
                message={snackbarMessage}
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
            />
        </div>
    );
};

export default TemporaryDrawer;