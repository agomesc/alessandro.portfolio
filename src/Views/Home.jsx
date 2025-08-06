import {
    useEffect,
    useState,
    Suspense,
    lazy,
    useDeferredValue,
    useRef,
    useCallback,
    
} from "react";

import CreateFlickrApp from "../shared/CreateFlickrApp";
import {
    Box,
    Tabs,
    Tab,
    useMediaQuery,
    useTheme 
} from "@mui/material";


import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BrushIcon from "@mui/icons-material/Brush";
import StarIcon from "@mui/icons-material/Star"; // ícone para "Mais Vistas"

const SwipeableSlider = lazy(() => import("../Components/SwipeableSlider"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const Gallery = lazy(() => import("./Gallery"));
const MostViewedPhotos = lazy(() => import("./MostViewedPhotos"));
const GalleryWork = lazy(() => import("./GalleryWork"));
const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));

const Home = () => {
    const theme = useTheme();
    const [galleryData, setGalleryData] = useState(null);
    const flickrInstance = useRef(null);
    const deferredGalleryData = useDeferredValue(galleryData);
    const [tabIndex, setTabIndex] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // mobile < 600px

    if (!flickrInstance.current) {
        flickrInstance.current = CreateFlickrApp();
    }

    useEffect(() => {
        document.body.classList.add("light-mode");
    }, []);

    useEffect(() => {
        if (tabIndex === 0 || tabIndex === 1) {
            const fetchPhotos = async () => {
                setGalleryData(null);
                try {
                    const data =
                        tabIndex === 0
                            ? await flickrInstance.current.getLatestPhotosLargeSquare() ?? []
                            : await flickrInstance.current.getLatestPhotosLargeSquarelWork() ?? [];
                    setGalleryData(data);
                } catch (error) {
                    console.error("Erro ao carregar imagens:", error);
                    setSnackbarMessage("Falha ao carregar fotos. Por favor, tente novamente mais tarde.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            };
            fetchPhotos();
        }
    }, [tabIndex]);

    useEffect(() => {
        const snackbarKey = "snackbarGreetingShownAt";
        const lastShown = sessionStorage.getItem(snackbarKey);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const hour = new Date().getHours();
        const greeting = hour < 12 ? "Bom dia! 🌞" : hour < 18 ? "Boa tarde! ☀️" : "Boa noite! 🌙";

        if (!lastShown || now - parseInt(lastShown, 10) > oneDay) {
            setSnackbarMessage(greeting);
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
            sessionStorage.setItem(snackbarKey, now.toString());
        }
    }, []);

    const handleTabChange = useCallback((_, newIndex) => setTabIndex(newIndex), []);
    const handleSnackbarClose = useCallback(() => setSnackbarOpen(false), []);

    const renderGalleryContent = () => {
        if (!deferredGalleryData || deferredGalleryData.length === 0) {
            return <CustomSkeleton />;
        }

        return (
            <Suspense fallback={<CustomSkeleton />}>
                <SwipeableSlider itemData={deferredGalleryData} allUpdatesUrl="/latestphotos" />
                {tabIndex === 0 ? (
                    <Gallery itemData={deferredGalleryData} />
                ) : (
                    <GalleryWork itemData={deferredGalleryData} />
                )}
            </Suspense>
        );
    };

    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile={true}
                centered={!isMobile}
                sx={{
                    marginTop: 15,
                    marginBottom: -8,
                    display: "flex",
                    justifyContent: "center",
                    ".MuiTabs-flexContainer": {
                        justifyContent: isMobile ? "flex-start" : "center",
                    },
                    ".MuiTabs-indicator": {
                        backgroundColor: "var(--primary-color)",
                    },
                    "& .MuiTab-root": {
                        margin: "0 8px",
                        fontWeight: 600,
                        borderRadius: "8px",
                        minWidth: "120px",
                    },
                }}
            >

                <Tab
                    icon={<PhotoLibraryIcon />}
                    iconPosition="start"
                    label="Galeria"
                    sx={{
                        color: tabIndex === 0 ? "var(--primary-color)" : "var(--secondary-color)",
                        backgroundColor: tabIndex === 0 ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        "&:hover": {
                            backgroundColor: tabIndex === 0 ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.04)",
                        },
                    }}
                />
                <Tab
                    icon={<BrushIcon />}
                    iconPosition="start"
                    label="Meus Trabalhos"
                    sx={{
                        color: tabIndex === 1 ? "var(--primary-color)" : "var(--secondary-color)",
                        backgroundColor: tabIndex === 1 ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        "&:hover": {
                            backgroundColor: tabIndex === 1 ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.04)",
                        },
                    }}
                />
                <Tab
                    icon={<StarIcon />}
                    iconPosition="start"
                    label="Mais Vistas"
                    sx={{
                        color: tabIndex === 2 ? "var(--primary-color)" : "var(--secondary-color)",
                        backgroundColor: tabIndex === 2 ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        "&:hover": {
                            backgroundColor: tabIndex === 2 ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.04)",
                        },
                    }}
                />
            </Tabs>

            <Box mt={5}>
                {tabIndex === 0 || tabIndex === 1 ? (
                    renderGalleryContent()
                ) : (
                    <Suspense fallback={<CustomSkeleton />}>
                        <MostViewedPhotos />
                    </Suspense>
                )}
            </Box>

            <Suspense fallback={<CustomSkeleton />}>
                <SocialMetaTags
                    title="Atualizações"
                    image="/logo_192.png"
                    description="Atualizações"
                    url={`${window.location.origin}/Home`}
                    type="website"
                />
            </Suspense>
            <Suspense fallback={<CustomSkeleton />}>
                <MessageSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}

                />
            </Suspense>
        </>
    );
};

export default Home;
