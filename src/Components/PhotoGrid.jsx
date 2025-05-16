import React, { lazy, Suspense } from 'react';
import { Card, CardContent, Typography } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import { NavLink } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';

const StarComponent = lazy(() => import("../Components/StarComponent"));
const LazyImage = lazy(() => import("../Components/LazyImage"));

const PhotoGrid = ({ itemData = [] }) => {
  return (
    <>
      {itemData.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
          {itemData.map((item) => (
            <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 3 }}>

              <NavLink to={`/PhotoInfo/${item.id}`} style={{ textDecoration: "none" }}>
                <LazyImage
                  src={item.url}
                  alt={item.title}
                />
              </NavLink>
              <CardContent>
                <Suspense fallback={<Skeleton variant='text' />}>
                  <Typography component="div" variant="subtitle1" sx={{ padding: 1, m: 0 }}>
                    {item.title}
                  </Typography>
                </Suspense>
                <Suspense fallback={<Skeleton variant='text' />}>
                  <StarComponent sx={{ padding: 1, m: 0 }} id={item.id} />
                </Suspense>
              </CardContent>
            </Card>
          ))}
        </Masonry>
      ) : (
        <Suspense fallback={<Skeleton variant='text' />}>
          <Typography component="div" variant="caption" align="center" sx={{ mt: 4 }}>
            Nenhuma imagem disponível
          </Typography>
        </Suspense>
      )}
    </>
  );
};

export default React.memo(PhotoGrid);
