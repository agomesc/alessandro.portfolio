import { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BrushIcon from "@mui/icons-material/Brush";
import Skeleton from '@mui/material/Skeleton';
import LoadingMessage from "../Components/LoadingMessage";

// Lazy-loaded components
const SwipeableSlider = lazy(() => import("../Components/SwipeableSlider"));
const RandomPhoto = lazy(() => import("../Components/PhotoHighlight.jsx"));

const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const Gallery = lazy(() => import("./Gallery"));
const GalleryWork = lazy(() => import("./GalleryWork"));
const DisplayAds = lazy(() => import("./DisplayAds"));
const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));

const Home = () => {
    // State declarations
    const [galleryData, setGalleryData] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const flickrInstance = useMemo(() => CreateFlickrApp(), []);

    // Function to fetch gallery data based on tab index
    const fetchGalleryData = useCallback(async () => {
        setGalleryData(null);
        try {
            const data = tabIndex === 0
                ? await flickrInstance.getLatestPhotosLargeSquare()
                : await flickrInstance.getLatestPhotosLargeSquarelWork();
            setGalleryData(data);
        } catch (error) {
            console.error("Error fetching gallery data:", error);
            setSnackbarMessage("Falha ao carregar fotos. Por favor, tente novamente mais tarde.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    }, [tabIndex, flickrInstance]);

    // Effect to fetch images when tab changes
    useEffect(() => {
        fetchGalleryData();
    }, [fetchGalleryData]);

    // Effect to show snackbar once per day
    useEffect(() => {
        const snackbarKey = "snackbarShownAt";
        const lastShown = sessionStorage.getItem(snackbarKey);
        const oneDay = 24 * 60 * 60 * 1000;
        const now = Date.now();

        // Only show if it hasn't been shown today
        if (!lastShown || (now - parseInt(lastShown, 10) > oneDay)) {
            setSnackbarMessage(
                "Curtiu alguma foto? Se possível, deixe uma ⭐ ou comentário para apoiar o meu trabalho!"
            );
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
            sessionStorage.setItem(snackbarKey, now.toString());
        }
    }, []);

    // Handler for tab change
    const handleTabChange = useCallback((event, newIndex) => {
        setTabIndex(newIndex);
    }, []);

    // Handler for snackbar close
    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    // Show skeleton while galleryData is null
    if (!galleryData) {
        return <Skeleton variant="rectangular" height={640} width="100%" />;
    }

    return (
        <>
            <Box
                sx={{
                    p: 0,
                    width: {
                        xs: "100%", // mobile
                        sm: "90%",
                        md: "80%",
                        lg: "70%",
                        xl: "80%",
                    },
                    alignContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                    padding: "0 20px",
                    mt: 5,
                }}
            >
                {/* RandomPhoto can render directly as galleryData is awaited */}
                <RandomPhoto itemData={galleryData} />
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        marginTop: 3,
                        marginBottom: -8,
                        ".MuiTabs-indicator": {
                            backgroundColor: "#78884c",
                        },
                    }}
                >
                    <Tab
                        icon={<PhotoLibraryIcon />}
                        iconPosition="start"
                        label="Galeria"
                        sx={{
                            color: tabIndex === 0 ? "#78884c" : "#c0810d",
                            fontWeight: tabIndex === 0 ? "bold" : "normal",
                            "&.Mui-selected": {
                                color: "#78884c",
                            },
                        }}
                    />
                    <Tab
                        icon={<BrushIcon />}
                        iconPosition="start"
                        label="Meus Trabalhos"
                        sx={{
                            color: tabIndex === 1 ? "#78884c" : "#c0810d",
                            fontWeight: tabIndex === 1 ? "bold" : "normal",
                            "&.Mui-selected": {
                                color: "#78884c",
                            },
                        }}
                    />
                </Tabs>

                {tabIndex === 0 && (
                    <Suspense fallback={<Skeleton variant="rectangular" height={300} width="100%" />}>
                        <Box mt={4}>
                            {/* SwipeableSlider uses its own internal loading, can remove skeleton fallback */}
                            <SwipeableSlider itemData={galleryData} allUpdatesUrl="/latestphotos" />
                            <Gallery />
                        </Box>
                    </Suspense>
                )}

                {tabIndex === 1 && (
                    <Suspense fallback={<Skeleton variant="rectangular" height={300} width="100%" />}>
                        <Box mt={4}>
                            {/* SwipeableSlider uses its own internal loading, can remove skeleton fallback */}
                            <SwipeableSlider itemData={galleryData} allUpdatesUrl="/latestphotosWorks" />
                            <GalleryWork />
                        </Box>
                    </Suspense>
                )}

                <Suspense fallback={<LoadingMessage />}>
                    <DisplayAds />
                </Suspense>
            </Box>

            {/* Social Meta Tags for SEO */}
            <Suspense fallback={<LoadingMessage />}>
                <SocialMetaTags
                    title="Atualizações"
                    image="/logo_192.png"
                    description="Atualizações"
                />
            </Suspense>

            {/* Message Snackbar */}
            <Suspense fallback={<></>}>
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