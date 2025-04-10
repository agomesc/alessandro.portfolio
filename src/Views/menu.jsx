import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useEffect, useState, Suspense, useMemo, useCallback, lazy } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Collapse from "@mui/material/Collapse";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import InfoIcon from "@mui/icons-material/Info";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import { Link } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebaseConfig';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import PolicyIcon from '@mui/icons-material/Policy';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));

const TemporaryDrawer = ({ darkMode, toggleTheme }) => {
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
                .then((data) => {
                    setGalleryData(data);
                    // setSnackbarMessage("Galerias carregadas com sucesso.");
                    // setSnackbarSeverity("success");
                    // setSnackbarOpen(true);
                })
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
            { route: "/About", description: "Sobre", chid: false, icon: <InfoIcon /> },
            { route: "/Login", description: "Login", chid: false, icon: <AccountCircle /> }
        ];

        return [...baseItems, ...galleryItems, ...additionalItems];
    }, [galleryData]);

    const DrawerList = (
        <Suspense fallback={<LoadingMessage />}>
            <Box sx={{ width: 250, backgroundColor: 'white', color: '#6c6a6b' }} role="presentation">
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
                                        sx={{ color: '#6c6a6b' }}
                                    >
                                        <ListItemIcon sx={{ color: '#78884c' }}>
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
                                            sx={{ pl: 4, color: '#6c6a6b' }}
                                            component="a"
                                            href={item.route}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setOpen(false);
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: '#78884c' }}>
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

    if (!galleryData.length) {
        return <LoadingMessage />;
    }

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    top: 0,
                    backgroundColor: darkMode ? '#1e1e1e' : 'white',
                    color: darkMode ? '#f5f5f5' : '#6c6a6b',
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        sx={{ color: "#78884c", mr: 2 }}
                        aria-label="Abrir menu de navegação"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography component="div" variant="subtitle1" sx={{ flexGrow: 1 }}>
                        <span style={{ color: "#78884c", fontSize: 20, fontWeight: 'bold' }}>Olho</span>
                        <span style={{ color: "#6c6a6b", fontSize: 20, fontWeight: 'bold' }}>Fotográfico</span>
                    </Typography>


                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            size="large"
                            onClick={toggleTheme}
                            sx={{
                                backgroundColor: darkMode ? '#333333' : '#f0f0f0',
                                color: darkMode ? '#ffffff' : '#000000',
                                borderRadius: '50%',
                            }}
                            aria-label="Alternar tema"
                        >
                            {darkMode ? (
                                <Brightness7Icon fontSize="medium" />
                            ) : (
                                <Brightness4Icon fontSize="medium" />
                            )}
                        </IconButton>


                        {user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar alt={user?.displayName || "Usuário"} src={user?.photoURL || ""} />
                                <IconButton size="large" onClick={handleLogout} sx={{ color: "#78884c" }}>
                                    <LogoutIcon fontSize="medium" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Link to="/Login">
                                <IconButton size="large" sx={{ color: "#78884c" }}>
                                    <AccountCircle fontSize="medium" />
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
