import React, { lazy, Suspense } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Masonry from '@mui/lab/Masonry';
import { NavLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import Skeleton from '@mui/material/Skeleton';

import LoadingMessage from '../Components/LoadingMessage';

const StarComponent = lazy(() => import('../Components/StarComponent'));
const ImageComponent = lazy(() => import('../Components/ImageComponent'));

const ImageMasonry = ({ data = [] }) => {
  const isPortrait = useMediaQuery('(orientation: portrait)');

  if (data.length === 0) {
    return (
      <Typography variant="h4" align="center" component="div" sx={{ mt: 4 }}>
        Nenhuma imagem disponível
      </Typography>
    );
  }

  const cards = data.map((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          position: 'relative',
          display: isPortrait ? 'flex' : 'block',
          mb: 2,
          boxShadow: 3,
          width: { xs: '100%', sm: '90%' },
          maxWidth: '100%',
          borderRadius: 0,
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <NavLink
            to={`/Photos/${item.id}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              flex: 1
            }}
          >
              <ImageComponent
                src={item.img}
                alt={item.title}
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "cover",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5
                }}
                loading="lazy"
              />
            <Suspense fallback={<Skeleton variant="text" height={100} />}>
              <Typography
                component="div"
                variant={isPortrait ? 'subtitle1' : 'h5'}
                fontWeight={isPortrait ? 'bold' : 'normal'}
                sx={{ padding: 1, m: 0 }}
              >
                {item.title}
                <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
              </Typography>
            </Suspense>
          </NavLink>

          <Suspense fallback={<Skeleton variant="text" height={100} />}>
            <Typography
              component="div"
              variant={isPortrait ? 'caption' : 'body1'}
              color="text.secondary"
              sx={{ padding: 1, m: 0 }}
            >
              {item.description.length > (isPortrait ? 100 : 200)
                ? `${item.description.substring(0, isPortrait ? 150 : 200)}...`
                : item.description}
            </Typography>
          </Suspense>

          <Box
            sx={{
              position: 'relative',
              top: 8,
              right: 8,
              zIndex: 2,
            }}
          >
            <Suspense fallback={<LoadingMessage />}>
              <StarComponent id={item.id} />
            </Suspense>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  ));

  return isPortrait ? (
    <>{cards}</>
  ) : (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={1}>
      {cards}
    </Masonry>
  );
};

export default React.memo(ImageMasonry);
