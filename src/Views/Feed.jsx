import { Suspense, lazy } from "react";
import Box from "@mui/material/Box";
const CommentBox = lazy(() => import("../Components/CommentBox"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const App = () => {

    return (
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
            <Suspense fallback={<></>}>
                <TypographyTitle src="Feeds" />
            </Suspense>
            <CommentBox itemID="Feeds" />
            <Suspense fallback={<></>}>
                <SocialMetaTags
                    title="Feeds"
                    image="/logo_192.png"
                    description="Feeds"
                />
            </Suspense>
        </Box>

    )
};

export default App;