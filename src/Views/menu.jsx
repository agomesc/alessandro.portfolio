import React, { useEffect, useState, useMemo, useCallback, lazy } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";

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
} from "@mui/icons-material";

import {
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence, // <--- Import browserSessionPersistence
} from "firebase/auth";
import firebaseConfig from "../firebaseConfig";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));

const TemporaryDrawer = ({ darkMode, toggleTheme }) => {
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSubGallery, setOpenSubGallery] = useState(false);
  const [openEquipamentos, setOpenEquipamentos] = useState(false);
  const [galleryData, setGalleryData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const flickrInstance = useMemo(() => CreateFlickrApp(), []);

  useEffect(() => {
    
      setLoadingAuth(false);
    
    const fetchGallery = async () => {
      try {
        const data = await flickrInstance.getGallery();
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

  useEffect(() => {
    // Set persistence to browserSessionPersistence
    setPersistence(firebaseConfig.auth, browserSessionPersistence) // <--- Changed here
      .then(() => {
        const unsubscribe = firebaseConfig.auth.onAuthStateChanged((usr) => {
          setUser(usr);
          setLoadingAuth(false);
        });
        return unsubscribe;
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
        setSnackbar({
          open: true,
          message: "Erro ao configurar a persistência da sessão: " + error.message,
          severity: "error",
        });
        setLoadingAuth(false);
      });
  }, []);

  const toggleDrawer = useCallback((isOpen) => () => setDrawerOpen(isOpen), []);
  const showMessage = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);
  
  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleLogin = useCallback(async () => {
    if (loadingAuth) {
      showMessage("Aguarde, verificando estado de autenticação...", "info");
      return;
    }

    if (user) {
      showMessage("Você já está logado.", "info");
      return;
    }

    if (!firebaseConfig.auth || !firebaseConfig.provider) {
      showMessage("Configuração do Firebase não está completa.", "error");
      return;
    }

    try {
      const result = await signInWithPopup(firebaseConfig.auth, firebaseConfig.provider);
      setUser(result.user);
      showMessage(`Bem-vindo, ${result.user.displayName || "usuário"}!`, "success");
      setDrawerOpen(false);
      setOpenEquipamentos(false);
      setOpenSubGallery(false);
      setLoadingAuth(true);
    } catch (error) {
      showMessage("Erro ao fazer login: " + error.message, "error");
    } finally {
      setLoadingAuth(false);
    }
  }, [user, loadingAuth, showMessage]);

  const handleLogout = useCallback(async () => {
    if (loadingAuth) {
      showMessage("Aguarde, verificando estado de autenticação...", "info");
      return;
    }

    if (!user) {
      showMessage("Você não está logado.", "warning");
      return;
    }

    try {
      await signOut(firebaseConfig.auth);
      setUser(null);
      showMessage("Desconectado com sucesso.", "info");
      setDrawerOpen(false);
      setLoadingAuth(true);
    } catch (error) {
      showMessage("Erro ao fazer logout: " + error.message, "error");
    } finally {
      setLoadingAuth(false);
    }
  }, [user, loadingAuth, showMessage]);

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
                  <Skeleton variant="circular" width={28} height={28} />
                </ListItemIcon>
                <ListItemText primary={<Skeleton width="60%" />} secondary={<Skeleton width="40%" />} />
              </ListItemButton>
            ) : (
              <ListItemButton onClick={user ? handleLogout : handleLogin}>
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
    return <Skeleton variant="rectangular" height="100%" width="100%" />;
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* Logo ou título */}
          </Typography>
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