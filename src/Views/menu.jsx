import { useEffect, useState, useMemo, useCallback, lazy } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Removed useMediaQuery as it's no longer needed for distinction
import Skeleton from '@mui/material/Skeleton';
import { motion } from "framer-motion";

import {
    AppBar, Toolbar, IconButton, Typography, Box, Drawer, Divider,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Collapse, Avatar // Menu and MenuItem are no longer needed as desktop menu is removed
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
    ContactMail as ContactMailIcon
} from "@mui/icons-material";

import { signInWithPopup, signOut } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";

import CreateFlickrApp from "../shared/CreateFlickrApp";

const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));
const ContactForm = lazy(() => import('./ContactForm')); // This import isn't used in the provided code, but I'll keep it as is.

const TemporaryDrawer = ({ darkMode, toggleTheme }) => {
    const theme = useTheme();
    // Removed isMobile as it's no longer needed
    const [open, setOpen] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [openEquipamentos, setOpenEquipamentos] = useState(false);
    const [galleryData, setGalleryData] = useState([]);
    const instance = useMemo(() => CreateFlickrApp(), []);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    // Removed anchorEl as desktop menu is removed
    const [user, setUser] = useState(null);

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

    const toggleDrawer = useCallback((newOpen) => () => {
        setOpen(newOpen);
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleLogin = () => {
        signInWithPopup(firebaseConfig.auth, firebaseConfig.provider)
            .then((result) => {
                const usr = result.user;
                setUser(usr);
                setSnackbarMessage(`Bem-vindo, ${usr.displayName || "usuário"}!`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                setOpen(false); // Close drawer after login
                setOpenEquipamentos(false);
                setOpenSub(false);
                // Removed setAnchorEl(null);
                window.setTimeout(function () {
                    window.location.reload();
                }, 3000);

            })
            .catch((error) => {
                setSnackbarMessage("Erro ao fazer login: " + error.message);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    const handleLogout = () => {
        signOut(firebaseConfig.auth)
            .then(() => {
                setUser(null);
                setSnackbarMessage("Desconectado com sucesso.");
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
                window.setTimeout(function () {
                    window.location.reload();
                }, 3000);

            })
            .catch((error) => {
                setSnackbarMessage("Erro ao desconectar: " + error.message);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    const items = useMemo(() => {
        const baseItems = [
            { route: "/Home", description: "Home", chid: false, icon: <HomeIcon /> },
            { route: "JavaScript:void(0);", description: "Minhas Galerias", chid: false, icon: <PhotoLibraryIcon /> }
        ];

        const galleryItems = galleryData.map((item) => ({
            route: `/Photos/${item.id}?`,
            description: item.title,
            chid: true,
            icon: <ArtTrackIcon />,
        }));

        const equipamentosGroup = [
            { route: "JavaScript:void(0);", description: "Equipamentos", chid: false, icon: <AdminPanelSettingsIcon />, isEquipamentos: true },
            { route: "/EquipmentValueCalculator", description: "Calcular valor de equipamentos usados", chid: true, icon: <CalculateIcon />, parent: "Equipamentos" },
        ];

        const additionalItems = [
            { route: "/LatestPhotos", description: "Atualizações", chid: false, icon: <DynamicFeedIcon /> },
            { route: "/ListContentWithPagination", description: "Seleção de Ofertas", chid: false, icon: <ShoppingCartIcon /> },
            { route: "/Privacidade", description: "Política de Privacidade", chid: false, icon: <PolicyIcon /> },
            { route: "/Transparencia", description: "Transparência", chid: false, icon: <AdminPanelSettingsIcon /> },
            { route: "/About", description: "Sobre", chid: false, icon: <InfoIcon /> },
            { route: "/contactForm", description: "Contato", chid: false, icon: <ContactMailIcon /> },
        ];

        return [...baseItems, ...galleryItems, ...equipamentosGroup, ...additionalItems];
    }, [galleryData]);

    const DrawerList = (
        <Box sx={{ width: 250, bgcolor: theme.palette.background.default, color: theme.palette.text.primary }} role="presentation">
            <Divider />
            <nav>
                <List>
                    {items.map((item, index) => {
                        const isChild = item.chid;
                        const hasChildren = items[index + 1] && items[index + 1].chid && !items[index + 1].parent;
                        const isEquipamentosChild = item.parent === "Equipamentos";

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
                                            if (item.isEquipamentos) {
                                                setOpenEquipamentos(!openEquipamentos);
                                            } else if (hasChildren) {
                                                setOpenSub(!openSub);
                                            } else {
                                                setOpen(false); // If it's a regular link, close the drawer
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.description} />
                                        {(item.isEquipamentos || hasChildren) && (
                                            <ExpandMoreIcon
                                                sx={{
                                                    transform: item.isEquipamentos ? (openEquipamentos ? 'rotate(180deg)' : 'rotate(0deg)') : (openSub ? 'rotate(180deg)' : 'rotate(0deg)'),
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            );
                        } else {
                            const openChild = isEquipamentosChild ? openEquipamentos : openSub;
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

    if (!galleryData.length) return <Skeleton variant="rectangular" height="auto" width="100%" />;

    return (
        <div>
            {/* AppBar is now always present and handles drawer toggle and theme toggle */}
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
                        Alessandro Cunha | FOTO
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