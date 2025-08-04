import { useEffect, useState, useMemo, useCallback, lazy, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Avatar,
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
    Brush as BrushIcon,
    DynamicFeed,
    MenuBook as MenuBookIcon,
    Timeline as TimelineIcon,
} from "@mui/icons-material";


import CreateFlickrApp from "../shared/CreateFlickrApp";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));
const NotificationBell = lazy(() => import("../Components/NotificationBell"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));


const TemporaryDrawer = ({ darkMode, toggleTheme }) => {
    const theme = useTheme();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openSubGallery, setOpenSubGallery] = useState(false);
    const [openEquipamentos, setOpenEquipamentos] = useState(false);
    const [galleryData, setGalleryData] = useState([]);
    const flickrInstance = useRef(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [loadingGallery, setLoadingGallery] = useState(true);


    if (!flickrInstance.current) {
        flickrInstance.current = CreateFlickrApp();
    }

    const showMessage = useCallback((message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const {
        user,
        loadingAuth,
        handleLogin,
        handleLogout,
    } = useFirebaseAuth(showMessage);

    useEffect(() => {

        const fetchGallery = async () => {
            try {
                const data = await flickrInstance.current.getGallery();
                setGalleryData(data);
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: "Erro ao carregar as galerias: " + error.message,
                    severity: "error",
                });
            } finally {
                setLoadingGallery(false);
            }
        };

        if (galleryData.length === 0 && loadingGallery) {
            fetchGallery();
        }
    }, [galleryData, flickrInstance, loadingGallery]);

    // Removido useEffect de autenticação, pois agora está no hook useFirebaseAuth

    const toggleDrawer = useCallback((isOpen) => () => setDrawerOpen(isOpen), []);

    const handleSnackbarClose = useCallback((_, reason) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    // Ajustes nos callbacks de login e logout para fechar o drawer e redefinir estados do componente pai
    const handleLoginCallback = useCallback(async () => {
        await handleLogin();
        // Após o login, você pode fechar o drawer e redefinir estados específicos da UI aqui.
        if (user) { // Verifica se o login foi bem-sucedido
            setDrawerOpen(false);
            setOpenEquipamentos(false);
            setOpenSubGallery(false);
        }
    }, [handleLogin, user]); // user como dependência para saber se o login foi feito

    const handleLogoutCallback = useCallback(async () => {
        await handleLogout();
        // Após o logout, você pode fechar o drawer aqui.
        setDrawerOpen(false);
    }, [handleLogout]);

    const items = useMemo(() => {
        const baseItems = [
            { route: "/Home", description: "Home", isChild: false, icon: <HomeIcon /> },
            {
                route: "JavaScript:void(0);",
                description: "Minhas Galerias",
                isChild: false,
                icon: <PhotoLibraryIcon />,
                isParentGallery: true,
            },
        ];

        const galleryItems = galleryData.map((item) => ({
            route: `/Photos/${item.id}?`,
            description: item.title,
            isChild: true,
            icon: <ArtTrackIcon />,
            parent: "Minhas Galerias",
        }));

        const equipamentosGroup = [
            {
                route: "JavaScript:void(0);",
                description: "Equipamentos",
                isChild: false,
                icon: <AdminPanelSettingsIcon />,
                isEquipamentos: true,
            },
            {
                route: "/EquipmentValueCalculator",
                description: "Calcular valor de equipamentos usados",
                isChild: true,
                icon: <CalculateIcon />,
                parent: "Equipamentos",
            },
        ];

        const additionalItems = [
            { route: "/latestPhotos", description: "Atualizações", isChild: false, icon: <DynamicFeedIcon /> },
            { route: "/latestPhotosWorks", description: "Atualizações Trabalhos", isChild: false, icon: <BrushIcon /> },
            { route: "/displayAds", description: "Conteúdos", isChild: false, icon: <MenuBookIcon /> },
            { route: "/listContentWithPagination", description: "Seleção de Ofertas", isChild: false, icon: <ShoppingCartIcon /> },
            { route: "/feed", description: "Feed", isChild: false, icon: <DynamicFeed /> },
            { route: "/groupedFlickrPhotos", description: "Linha do Tempo", isChild: false, icon: <TimelineIcon /> },
            { route: "/privacidade", description: "Política de Privacidade", isChild: false, icon: <PolicyIcon /> },
            { route: "/transparencia", description: "Transparência", isChild: false, icon: <AdminPanelSettingsIcon /> },
            { route: "/about", description: "Sobre", isChild: false, icon: <InfoIcon /> },
            { route: "/contactForm", description: "Contato", isChild: false, icon: <ContactMailIcon /> },
        ];

        return [...baseItems, ...galleryItems, ...equipamentosGroup, ...additionalItems];
    }, [galleryData]);

    const renderDrawerList = (
        <Box
            sx={{ width: 250, bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}
            role="presentation"
        >
            <Divider />
            <nav>
                <List>
                    {items.map((item, index) => {
                        const isChild = item.isChild;
                        const isParentOfGalleries = item.isParentGallery;
                        const isEquipamentosParent = item.isEquipamentos;

                        if (!isChild) {
                            return (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        component={item.route.startsWith("JavaScript") ? "div" : Link}
                                        to={item.route.startsWith("JavaScript") ? undefined : item.route}
                                        onClick={(event) => {
                                            if (item.route.startsWith("JavaScript")) event.preventDefault();
                                            if (isEquipamentosParent) setOpenEquipamentos((prev) => !prev);
                                            else if (isParentOfGalleries) setOpenSubGallery((prev) => !prev);
                                            else setDrawerOpen(false);
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.description} />
                                        {(isEquipamentosParent || isParentOfGalleries) && (
                                            <ExpandMoreIcon
                                                sx={{
                                                    transform:
                                                        (isEquipamentosParent && openEquipamentos) ||
                                                            (isParentOfGalleries && openSubGallery)
                                                            ? "rotate(180deg)"
                                                            : "rotate(0deg)",
                                                    transition: "transform 0.3s ease",
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            );
                        } else {
                            const openChild = item.parent === "Equipamentos" ? openEquipamentos : openSubGallery;
                            return (
                                <Collapse in={openChild} timeout="auto" unmountOnExit key={index}>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            component={Link}
                                            to={item.route}
                                            onClick={() => setDrawerOpen(false)}
                                        >
                                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.description} />
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            );
                        }
                    })}

                    {/* Tema */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={toggleTheme}>
                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                            </ListItemIcon>
                            <ListItemText primary={darkMode ? "Modo Claro" : "Modo Escuro"} />
                        </ListItemButton>
                    </ListItem>

                    {/* Login/Logout Section */}
                    <ListItem disablePadding>
                        {loadingAuth ? (
                            <ListItemButton disabled>
                                <ListItemIcon>
                                    <CustomSkeleton />
                                </ListItemIcon>
                                <ListItemText primary={<CustomSkeleton />} secondary={<CustomSkeleton />} />
                            </ListItemButton>
                        ) : (
                            <ListItemButton onClick={user ? handleLogoutCallback : handleLoginCallback}>
                                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                    {user?.photoURL ? (
                                        <Avatar
                                            src={user.photoURL}
                                            alt={user.displayName || "Usuário"}
                                            sx={{ width: 28, height: 28 }}
                                        />
                                    ) : (
                                        <AdminPanelSettingsIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={user ? "Logout" : "Login"}
                                    secondary={user?.displayName || ""}
                                />
                            </ListItemButton>
                        )}
                    </ListItem>
                </List>
            </nav>
            <Divider />
        </Box>
    );

    if (loadingGallery) {
        return <CustomSkeleton />;
    }

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    top: 0,
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    display: "flex",
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
                    <Box sx={{ flexGrow: 1 }} /> {/* This pushes items to the right */}
                    <NotificationBell />
                    {/* Botão de alternância de tema */}
                    <IconButton
                        size="large"
                        onClick={toggleTheme}
                        sx={{
                            bgcolor: theme.palette.action.hover,
                            color: theme.palette.text.primary,
                            borderRadius: "50%",
                        }}
                        aria-label="Alternar tema"
                    >
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {renderDrawerList}
            </Drawer>

            <MessageSnackbar
                message={snackbar.message}
                open={snackbar.open}
                onClose={handleSnackbarClose}
                severity={snackbar.severity}
            />
        </>
    );
};

export default TemporaryDrawer;