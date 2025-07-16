import {
  useEffect,
  useState,
  Suspense,
  lazy,
  useCallback,
  useDeferredValue,
  useRef
} from "react";

import CreateFlickrApp from "../shared/CreateFlickrApp";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BrushIcon from "@mui/icons-material/Brush";

const SwipeableSlider = lazy(() => import("../Components/SwipeableSlider"));
const RandomPhoto = lazy(() => import("../Components/PhotoHighlight.jsx"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const Gallery = lazy(() => import("./Gallery"));
const GalleryWork = lazy(() => import("./GalleryWork"));
const DisplayAds = lazy(() => import("./DisplayAds"));
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

  const fetchGalleryData = useCallback(async () => {
    setGalleryData(null);
    try {
      const data =
        tabIndex === 0
          ? await flickrInstance.current.getLatestPhotosLargeSquare() ?? {}
          : await flickrInstance.current.getLatestPhotosLargeSquarelWork() ?? {};
      setGalleryData(data);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
      setSnackbarMessage("Falha ao carregar fotos. Por favor, tente novamente mais tarde.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [tabIndex, flickrInstance]);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

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

  return (

      <Suspense fallback={<CustomSkeleton />}>
        <RandomPhoto />
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          sx={{
            marginTop: 5,
            marginBottom: -8,
            ".MuiTabs-indicator": { backgroundColor: "#78884c" },
          }}
        >
          <Tab
            icon={<PhotoLibraryIcon />}
            iconPosition="start"
            label="Galeria"
            sx={{
              color: tabIndex === 0 ? "#78884c" : "#c0810d",
              fontWeight: tabIndex === 0 ? "bold" : "normal",
              "&.Mui-selected": { color: "#78884c" },
            }}
          />
          <Tab
            icon={<BrushIcon />}
            iconPosition="start"
            label="Meus Trabalhos"
            sx={{
              color: tabIndex === 1 ? "#78884c" : "#c0810d",
              fontWeight: tabIndex === 1 ? "bold" : "normal",
              "&.Mui-selected": { color: "#78884c" },
            }}
          />
        </Tabs>

        <Box mt={5}>

          {tabIndex === 0 ? (
            deferredGalleryData && deferredGalleryData.length > 0 ? (
              <>
                <SwipeableSlider itemData={galleryData} allUpdatesUrl="/latestphotos" />
                <Gallery itemData={galleryData} />
              </>
            ) : (
              <Box sx={{ textAlign: "center", padding: 2 }}>
                <CustomSkeleton variant="circular" />
              </Box>
            )
          ) : (
            deferredGalleryData && deferredGalleryData.length > 0 ? (
              <>
                <SwipeableSlider itemData={galleryData} allUpdatesUrl="/latestphotos" />
                <GalleryWork itemData={galleryData} />
              </>
            ) : (
              <Box sx={{ textAlign: "center", padding: 2 }}>
                <CustomSkeleton variant="circular" />
              </Box>
            )
          )}

        </Box>
        <DisplayAds />
        <SocialMetaTags
          title="Atualizações"
          image="/logo_192.png"
          description="Atualizações"
          url={`${window.location.origin}/Home`}
          type="website"
        />

        <MessageSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={handleSnackbarClose} />

      </Suspense>
    
  );
};

export default Home;