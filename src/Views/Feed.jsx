import { Suspense, lazy } from "react";
import Box from "@mui/material/Box";

const CommentBox = lazy(() => import("../Components/CommentBox"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));

const App = () => {

  return (
    <Box
      sx={(theme) => ({
        p: 0,
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
          lg: "70%",
          xl: "80%",
        },
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: theme.customSpacing.pagePadding,
        mt: theme.customSpacing.sectionMarginTop,
      })}
    >
      <Suspense fallback={<CustomSkeleton />}>
        <TypographyTitle src="Feeds" />
      </Suspense>
      <Suspense fallback={<CustomSkeleton />}>
        <CommentBox itemID="Feeds" />
      </Suspense>
      <Suspense fallback={<CustomSkeleton />}>
        <SocialMetaTags
          title="Feeds"
          image="/logo_192.png"
          description="Feeds"
          url={`${window.location.origin}/feeds`}
          type="website"
        />
      </Suspense>
    </Box>
  )
};

export default App;