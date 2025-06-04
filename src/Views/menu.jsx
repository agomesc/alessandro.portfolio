import React, { useEffect, useState, Suspense, useMemo, useCallback, lazy } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton';

import {
    AppBar, Toolbar, IconButton, Typography, Box, Drawer, Divider,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Collapse, Menu, MenuItem
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

    const toggleDrawer = useCallback((newOpen) => () => {
        setOpen(newOpen);
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
            // Removido item de Login
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
                        const hasChildren = items[index + 1] && items[index + 1].chid && !items[index + 1].parent;
                        const isEquipamentosChild = item.parent === "Equipamentos";

                        if (!isChild) {
                            return (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        component="a"
                                        href={item.route}
                                        onClick={(event) => {
                                            event.stopPropagation();
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
                                        <ListItemButton sx={{ pl: 4 }} component="a" href={item.route} onClick={() => setOpen(false)}>
                                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
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
            <AppBar position="fixed" sx={{ top: 0, bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
                <Toolbar>
                    {isMobile ? (
                        <IconButton size="large" edge="start" sx={{ color: theme.palette.primary.main, mr: 2 }} aria-label="Abrir menu de navegação" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 2, mr: 4 }} onMouseLeave={() => {
                            setOpenSub(false);
                            setOpenEquipamentos(false);
                            setAnchorEl(null);
                        }}>
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                                                    {item.icon}
                                                </IconButton>
                                                <Typography
                                                    variant="button"
                                                    sx={{
                                                        color: theme.palette.primary.main,
                                                        fontWeight: 'bold',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    {item.description}
                                                </Typography>
                                            </Box>
                                            <Menu
                                                id={menuId}
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl) && menuOpen}
                                                onClose={() => {
                                                    setOpenEquipamentos(false);
                                                    setOpenSub(false);
                                                    setAnchorEl(null);
                                                }}
                                                MenuListProps={{ onMouseLeave: () => {
                                                    setOpenEquipamentos(false);
                                                    setOpenSub(false);
                                                    setAnchorEl(null);
                                                }}}
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                                                {item.icon}
                                            </IconButton>
                                            <Typography variant="button" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </Link>
                                );
                            })}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                        <IconButton size="large" onClick={toggleTheme} sx={{ bgcolor: theme.palette.action.hover, color: theme.palette.text.primary, borderRadius: '50%' }} aria-label="Alternar tema">
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {isMobile && (
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
            )}

            <MessageSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleSnackbarClose} />
        </div>
    );
};

export default React.memo(TemporaryDrawer);
