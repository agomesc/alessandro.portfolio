import {
    useEffect,
    useState,
    Suspense,
    lazy,
    useDeferredValue,
    useRef,
    useCallback
} from "react";

import CreateFlickrApp from "../shared/CreateFlickrApp";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BrushIcon from "@mui/icons-material/Brush";

const SwipeableSlider = lazy(() => import("../Components/SwipeableSlider"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const Gallery = lazy(() => import("./Gallery"));
const MostViewedPhotos = lazy(() => import("./MostViewedPhotos"));
const GalleryWork = lazy(() => import("./GalleryWork"));
const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));


const Home = () => {
    const [galleryData, setGalleryData] = useState(null);
    const flickrInstance = useRef(null);
    const deferredGalleryData = useDeferredValue(galleryData);
    const [tabIndex, setTabIndex] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    if (!flickrInstance.current) {
        flickrInstance.current = CreateFlickrApp();
    }


    useEffect(() => {
        document.body.classList.add("light-mode");
    }, []);

    useEffect(() => {
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
                centered
                sx={{
                    marginTop: 15,
                    marginBottom: -8,
                    ".MuiTabs-indicator": {
                        backgroundColor: "var(--primary-color)",
                    },
                    // Adiciona espaçamento entre as tabs para melhor leitura
                    "& .MuiTab-root": {
                        margin: "0 8px",
                        // Aumenta a espessura da fonte para dar mais ênfase
                        fontWeight: 600,
                        borderRadius: "8px",
                    },
                }}
            >
                <Tab
                    icon={<PhotoLibraryIcon />}
                    iconPosition="start"
                    label="Galeria"
                    sx={{
                        color: tabIndex === 0 ? "var(--primary-color)" : "var(--secondary-color)",
                        // Adiciona um fundo sutil para a tab selecionada
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
                        // Adiciona um fundo sutil para a tab selecionada
                        backgroundColor: tabIndex === 1 ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        "&:hover": {
                            backgroundColor: tabIndex === 1 ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.04)",
                        },
                    }}
                />
            </Tabs>


            <Box mt={5}>
                {renderGalleryContent()}
            </Box>
            <Box mt={5}>
                <MostViewedPhotos />
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
            <MessageSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
        </>
    );
};

export default Home;