import { useEffect, useState, Suspense, lazy, useMemo } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BrushIcon from "@mui/icons-material/Brush";
import Skeleton from '@mui/material/Skeleton';
import LoadingMessage from "../Components/LoadingMessage";
import ContactForm from "./ContactForm";

const SwipeableSlider = lazy(() => import("../Components/SwipeableSlider"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const Gallery = lazy(() => import("./Gallery"));
const GalleryWork = lazy(() => import("./GalleryWork"));
const DisplayAds = lazy(() => import("./DisplayAds"));
const MessageSnackbar = lazy(() => import("../Components/MessageSnackbar"));

const Home = () => {
    const [galleryData, setGalleryData] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [showSnackbarOnce, setShowSnackbarOnce] = useState(true);
    const instance = useMemo(() => CreateFlickrApp(), []);

    // Busca as imagens quando muda a aba
    useEffect(() => {
        setGalleryData(null); // opcional: limpa dados para mostrar Skeleton no loading
        if (tabIndex === 0) {
            instance.getLatestPhotosThumbnail().then(setGalleryData);
        } else {
            instance.getLatestPhotosThumbnailWork().then(setGalleryData);
        }
    }, [tabIndex, instance]);

    // Controla exibição do snackbar uma vez por dia
    useEffect(() => {
        const snackbarKey = "snackbarShownAt";
        const lastShown = sessionStorage.getItem(snackbarKey);
        const oneDay = 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (showSnackbarOnce && (!lastShown || now - parseInt(lastShown, 10) > oneDay)) {
            setSnackbarMessage(
                "Curtiu alguma foto? Se possível, deixe uma estrela ou comentário para apoiar o meu trabalho! 😊"
            );
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
            setShowSnackbarOnce(false);
            sessionStorage.setItem(snackbarKey, now.toString());
        }
    }, [showSnackbarOnce]);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const title = "Atualizações";
    const description = "Atualizações";

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
                            <SwipeableSlider itemData={galleryData} />
                            <Gallery />
                        </Box>
                    </Suspense>
                )}

                {tabIndex === 1 && (
                    <Suspense fallback={<Skeleton variant="rectangular" height={300} width="100%" />}>
                        <Box mt={4}>
                            <SwipeableSlider itemData={galleryData} />
                            <GalleryWork />
                        </Box>
                    </Suspense>
                )}

                <Suspense fallback={<LoadingMessage />}>
                    <DisplayAds />
                </Suspense>

                <ContactForm />
            </Box>

            <Suspense fallback={<LoadingMessage />}>
                <SocialMetaTags title={title} image="/logo_192.png" description={description} />
            </Suspense>

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
