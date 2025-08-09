import React, { Suspense, lazy } from "react";

const CommentBox = lazy(() => import("../Components/CommentBox"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const ContentContainer = React.lazy(() => import('../Components/ContentContainer'));

const App = () => {

  return (
    <ContentContainer sx={{ mt: 15, mb: 10 }}>
      <Suspense fallback={<CustomSkeleton variant="text" height={10} />}>
        <TypographyTitle src="Feeds" />
      </Suspense>
      <Suspense fallback={<CustomSkeleton height={500} />}>
        <CommentBox itemID="Feeds" />
      </Suspense>
      <Suspense fallback={null}>
        <SocialMetaTags
          title="Feeds"
          image="/logo_192.png"
          description="Feeds"
          url={`${window.location.origin}/feeds`}
          type="website"
        />
      </Suspense>
    </ContentContainer>
  )
};

export default App;