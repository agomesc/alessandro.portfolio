import React, { lazy, Suspense } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Masonry from '@mui/lab/Masonry';
import { NavLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoadingMessage from '../Components/LoadingMessage'

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
    <Card
      key={item.id}
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
      {/* 🔗 Apenas imagem e textos estão no link */}

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
          />

          <Typography
            component="div"
            variant={isPortrait ? 'subtitle1' : 'h5'}
            fontWeight={isPortrait ? 'bold' : 'normal'}
            sx={{ padding: 1, m: 0 }}
          >
            {item.title}
            <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
          </Typography>

        </NavLink>

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
  ));

  return isPortrait ? (
    <>{cards}</>
  ) : (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
      {cards}
    </Masonry>
  );
};

export default React.memo(ImageMasonry);
