import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useMemo,
  useCallback,
} from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import { Box, Skeleton } from "@mui/material";
import TypographyTitle from "../Components/TypographyTitle";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const PhotoInfo = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const instance = useMemo(() => CreateFlickrApp(), []);

  const metaData = useMemo(() => {
    if (galleryData) {
      return {
        title: galleryData.title,
        image: galleryData.url,
        description: galleryData.description,
      };
    }
    return {};
  }, [galleryData]);

  const fetchData = useCallback(async () => {
    const data = await instance.getPhotoInfo(id);
    setGalleryData(data);
  }, [id, instance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const skeleton = (
    <Box sx={{ mt: 10, px: 2 }}>
      <TypographyTitle src="Informações da Foto" />
      <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      <Skeleton variant="text" sx={{ mt: 1 }} />
      <Skeleton variant="text" width="60%" />
    </Box>
  );

  return (
    <>
      {!galleryData ? (
        skeleton
      ) : (
        <Box
          sx={{
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
            padding: "0 20px",
            mt: 10,
          }}
        >
          <TypographyTitle src="Informações da Foto" />

          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
              <PhotoDashboard photoData={galleryData} />
            </Suspense>
          </Box>

          <Suspense fallback={<Skeleton variant="text" sx={{ mt: 4 }} />}>
            <CommentBox itemID={id} />
          </Suspense>
        </Box>
      )}

      <Suspense fallback={null}>
        <SocialMetaTags
          title={metaData.title}
          image={metaData.image}
          description={metaData.description}
        />
      </Suspense>
    </>
  );
};

export default React.memo(PhotoInfo);
