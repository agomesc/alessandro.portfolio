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
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));

const TemporaryDrawer = () => {
    const [open, setOpen] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [user, setUser] = useState(null);
    const [galleryData, setGalleryData] = useState([]);
    const instance = useMemo(() => CreateFlickrApp(), []);

    useEffect(() => {
        if (galleryData.length === 0) {
            instance.getGallery().then(setGalleryData);
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
                console.log('Usuário deslogado');
            })
            .catch((error) => {
                console.error('Erro ao deslogar', error);
            });
    }, []);

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
            <AppBar position="fixed" sx={{ top: 0, backgroundColor: 'white', color: '#6c6a6b' }}>
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
                        <span style={{ color: "#78884c", fontSize: 20, fontWeight: 'bold' }}>Olho</span><span style={{ color: "#6c6a6b", fontSize: 20, fontWeight: 'bold' }}>Fotográfico</span>
                    </Typography>
                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', top: 10 }}>
                            <Avatar alt={user?.displayName || "Usuário"} src={user?.photoURL || ""} />
                            <IconButton onClick={handleLogout} sx={{ color: "#78884c" }}>
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Link to="/Login">
                            <IconButton sx={{ color: "#78884c" }}>
                                <AccountCircle />
                            </IconButton>
                        </Link>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
};

export default React.memo(TemporaryDrawer);
