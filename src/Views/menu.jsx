import React, { useEffect, useState, Suspense, useMemo, useCallback, lazy } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Skeleton from '@mui/material/Skeleton';

import {
    AppBar, Toolbar, IconButton, Typography, Box, Drawer, Divider,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Collapse, Avatar
} from "@mui/material";

import {
    Menu as MenuIcon,
    AccountCircle,
    Info as InfoIcon,
    PhotoLibrary as PhotoLibraryIcon,
    ArtTrack as ArtTrackIcon,
    DynamicFeed as DynamicFeedIcon,
    Logout as LogoutIcon,
    Policy as PolicyIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Home as HomeIcon,
    ExpandMore as ExpandMoreIcon,
    ShoppingCart as ShoppingCartIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    Calculate as CalculateIcon,
} from "@mui/icons-material";

import CreateFlickrApp from "../shared/CreateFlickrApp";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebaseConfig';

const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));

const TemporaryDrawer = ({ darkMode, toggleTheme }) => {
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [user, setUser] = useState(null);
    const [galleryData, setGalleryData] = useState([]);
    const instance = useMemo(() => CreateFlickrApp(), []);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user || null);
        });
        return () => unsubscribe();
    }, []);

    const toggleDrawer = useCallback((newOpen) => () => {
        setOpen(newOpen);
    }, []);

    const handleLogout = useCallback(() => {
        signOut(auth)
            .then(() => {
                setSnackbarMessage("Usuário deslogado com sucesso.");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            })
            .catch((error) => {
                setSnackbarMessage("Erro ao deslogar: " + error.message);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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

        const additionalItems = [
            { route: "/LatestPhotos", description: "Atualizações", chid: false, icon: <DynamicFeedIcon /> },
            { route: "/ListContentWithPagination", description: "Seleção de Ofertas", chid: false, icon: <ShoppingCartIcon /> },
            { route: "/Privacidade", description: "Política de Privacidade", chid: false, icon: <PolicyIcon /> },
            { route: "/Transparencia", description: "Transparência", chid: false, icon: <AdminPanelSettingsIcon /> },
            { route: "/EquipmentValueCalculator", description: "Calcular valor de equipamentos usados", chid: false, icon: <CalculateIcon /> },
            { route: "/About", description: "Sobre", chid: false, icon: <InfoIcon /> },
            { route: "/Login", description: "Login", chid: false, icon: <AccountCircle /> }
        ];

        return [...baseItems, ...galleryItems, ...additionalItems];
    }, [galleryData]);

    const DrawerList = (
        <Suspense fallback={<Skeleton variant="rectangular" height={100} />}>
            <Box
                sx={{
                    width: 250,
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary
                }}
                role="presentation"
            >
                <Divider />
                <List>
                    {items.map((item, index) => {
                        const isChild = item.chid;
                        const hasChildren = items[index + 1] && items[index + 1].chid;

                        if (!isChild) {
                            return (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        component="a"
                                        href={item.route}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            if (hasChildren) {
                                                setOpenSub(!openSub);
                                            } else {
                                                setOpen(false);
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.description} />
                                        {hasChildren && (
                                            <ExpandMoreIcon
                                                sx={{
                                                    transform: openSub ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            );
                        } else {
                            return (
                                <Collapse in={openSub} timeout="auto" unmountOnExit key={index}>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            component="a"
                                            href={item.route}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setOpen(false);
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.description} />
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            );
                        }
                    })}
                </List>
                <Divider />
            </Box>
        </Suspense>
    );

    if (!galleryData.length) return <Skeleton variant="rectangular" height={100} />;

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    top: 0,
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                }}
            >
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

                    <Typography component="div" variant="subtitle1" sx={{ flexGrow: 1 }}>
                        <span style={{ color: theme.palette.primary.main, fontSize: 20, fontWeight: 'bold' }}>Olho</span>
                        <span style={{ color: theme.palette.text.primary, fontSize: 20, fontWeight: 'bold' }}>Fotográfico</span>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

                        {user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar alt={user?.displayName || "Usuário"} src={user?.photoURL || ""} />
                                <IconButton size="large" onClick={handleLogout} sx={{ color: theme.palette.primary.main }}>
                                    <LogoutIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Link to="/Login">
                                <IconButton size="large" sx={{ color: theme.palette.primary.main }}>
                                    <AccountCircle />
                                </IconButton>
                            </Link>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>

            <MessageSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
        </div>
    );
};

export default React.memo(TemporaryDrawer);
