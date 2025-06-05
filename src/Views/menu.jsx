import React, { useEffect, useState, Suspense, useMemo, useCallback, lazy } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton';
import { motion } from "framer-motion";


import {
    AppBar, Toolbar, IconButton, Typography, Box, Drawer, Divider,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Collapse, Menu, MenuItem, Avatar
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
} from "@mui/icons-material";

import { signInWithPopup, signOut } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";

import CreateFlickrApp from "../shared/CreateFlickrApp";

const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));

const TemporaryDrawer = ({ darkMode, toggleTheme }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [openEquipamentos, setOpenEquipamentos] = useState(false);
    const [galleryData, setGalleryData] = useState([]);
    const instance = useMemo(() => CreateFlickrApp(), []);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [anchorEl, setAnchorEl] = useState(null);

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
                setOpen(false); // Fechar o drawer após o login
                setOpenEquipamentos(false);
                setOpenSub(false);
                setAnchorEl(null);
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
        ];

        return [...baseItems, ...galleryItems, ...equipamentosGroup, ...additionalItems];
    }, [galleryData]);

    const DrawerList = (
        <Suspense fallback={<Skeleton variant="rectangular" height={100} />}>
            <Box sx={{ width: 250, bgcolor: theme.palette.background.default, color: theme.palette.text.primary }} role="presentation">
                <Divider />
                <List>
                    {items.map((item, index) => {
                        const isChild = item.chid;
                        const hasChildren = items[index + 1] && items[index + 1].chid && !items[index + 1].parent; // Check if next item is a child AND not part of "Equipamentos"
                        const isEquipamentosChild = item.parent === "Equipamentos";

                        if (!isChild) {
                            return (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        component={item.route.startsWith("JavaScript") ? "div" : Link}
                                        to={item.route.startsWith("JavaScript") ? undefined : item.route}
                                        onClick={(event) => {
                                            if (item.route.startsWith("JavaScript")) {
                                                event.preventDefault();
                                            }
                                            if (item.isEquipamentos) {
                                                setOpenEquipamentos(!openEquipamentos);
                                            } else if (hasChildren) {
                                                setOpenSub(!openSub);
                                            } else {
                                                setOpen(false);
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

                    {/* Theme Toggle Button - Always present in DrawerList */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={toggleTheme}>
                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                            </ListItemIcon>
                            <ListItemText primary={darkMode ? "Modo Claro" : "Modo Escuro"} />
                        </ListItemButton>
                    </ListItem>

                    {/* Login/Logout - Always present in DrawerList */}
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
                <Divider />
            </Box>
        </Suspense>
    );

    if (!galleryData.length) return <Skeleton variant="rectangular" height={100} />;

    return (
        <div>
            <AppBar position="fixed" sx={{ top: 0, bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
                <Toolbar>
                    {isMobile ? (
                        <>
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
                                Minha Galeria
                            </Typography>
                            {/* Theme Toggle and Login/Logout are now ONLY in the Drawer for mobile */}
                        </>
                    ) : (
                        <>
                            <Box
                                sx={{ display: 'flex', gap: 2, mr: 'auto' }}
                                onMouseLeave={() => {
                                    setOpenSub(false);
                                    setOpenEquipamentos(false);
                                    setAnchorEl(null);
                                }}
                            >
                                {items.filter(item => !item.chid).map((item, index) => {
                                    const isEquipamentos = item.isEquipamentos;
                                    const isGaleria = item.description === "Minhas Galerias";

                                    const childItems = items.filter(i => {
                                        if (isEquipamentos) return i.parent === "Equipamentos";
                                        if (isGaleria) return i.chid && !i.parent;
                                        return false;
                                    });

                                    const hasChildren = childItems.length > 0;

                                    if (hasChildren) {
                                        const menuId = isEquipamentos ? 'equipamentos-menu' : 'galerias-menu';
                                        const menuOpen = isEquipamentos ? openEquipamentos : openSub;

                                        return (
                                            <Box
                                                key={index}
                                                onMouseEnter={(e) => {
                                                    setAnchorEl(e.currentTarget);
                                                    if (isEquipamentos) {
                                                        setOpenEquipamentos(true);
                                                        setOpenSub(false);
                                                    } else {
                                                        setOpenSub(true);
                                                        setOpenEquipamentos(false);
                                                    }
                                                }}
                                            >
                                                <motion.div whileHover={{ scale: 1.05 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', px: 1 }}>
                                                        <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                                                            {item.icon}
                                                        </IconButton>
                                                        <Typography
                                                            variant="button"
                                                            sx={{
                                                                color: theme.palette.primary.main,
                                                                fontWeight: 'bold',
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': { textDecoration: 'underline' }
                                                            }}
                                                        >
                                                            {item.description}
                                                        </Typography>
                                                    </Box>
                                                </motion.div>
                                                <Menu
                                                    id={menuId}
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && menuOpen}
                                                    onClose={() => {
                                                        setOpenEquipamentos(false);
                                                        setOpenSub(false);
                                                        setAnchorEl(null);
                                                    }}
                                                    MenuListProps={{
                                                        onMouseLeave: () => {
                                                            setOpenEquipamentos(false);
                                                            setOpenSub(false);
                                                            setAnchorEl(null);
                                                        }
                                                    }}
                                                    transitionDuration={300}
                                                >
                                                    {childItems.map((child, i) => (
                                                        <MenuItem
                                                            key={i}
                                                            component={Link}
                                                            to={child.route}
                                                            onClick={() => {
                                                                setOpenEquipamentos(false);
                                                                setOpenSub(false);
                                                                setAnchorEl(null);
                                                            }}
                                                        >
                                                            {child.description}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                            </Box>
                                        );
                                    }

                                    return (
                                        <Link key={index} to={item.route} style={{ textDecoration: 'none' }}>
                                            <motion.div whileHover={{ scale: 1.05 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                                                    <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                                                        {item.icon}
                                                    </IconButton>
                                                    <Typography
                                                        variant="button"
                                                        sx={{
                                                            color: theme.palette.primary.main,
                                                            fontWeight: 'bold',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': { textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        {item.description}
                                                    </Typography>
                                                </Box>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {user ? (
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                        <Box sx={{ cursor: 'pointer' }} onClick={handleLogout} title="Logout">
                                            <Avatar src={user.photoURL} alt={user.displayName || "Usuário"} sx={{ width: 32, height: 32 }} />
                                        </Box>
                                    </motion.div>
                                ) : (
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Box
                                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', px: 1 }}
                                            onClick={handleLogin}
                                            title="Login"
                                        >
                                            <AdminPanelSettingsIcon sx={{ color: theme.palette.primary.main }} />
                                            <Typography
                                                variant="button"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    fontWeight: 'bold',
                                                    ml: 1,
                                                    '&:hover': { textDecoration: 'underline' },
                                                }}
                                            >
                                                Login
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                )}

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
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>

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