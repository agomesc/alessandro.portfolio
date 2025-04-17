import React, { lazy } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Masonry from '@mui/lab/Masonry';
import { NavLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

const StarComponent = lazy(() => import('../Components/StarComponent'));
const ImageComponent = lazy(() => import('../Components/ImageComponent'));

const ImageMasonry = ({ data = [] }) => {
  const isPortrait = useMediaQuery('(orientation: portrait)');

  const renderCard = (item, portrait = false) => (
    <Card
      sx={{
        display: portrait ? 'flex' : 'block',
        mb: 2,
        boxShadow: 3,
        width: { xs: '100%', sm: '90%' },
        maxWidth: '100%',
        borderRadius: 0,
      }}
    >
      <NavLink
        to={`/Photos/${item.id}`}
        style={{
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column'
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
        <CardContent sx={{ flex: 1 }}>
          <Typography component="div" variant={portrait ? 'subtitle1' : 'h5'} fontWeight={portrait ? 'bold' : 'normal'} sx={{ padding: 1, m: 0 }}>
            {item.title}
            <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
          </Typography>
          <Typography component="div" variant={portrait ? 'caption' : 'body1'} color="text.secondary" sx={{ padding: 1, m: 0 }}>
            {item.description.length > (portrait ? 100 : 200)
              ? `${item.description.substring(0, portrait ? 150 : 200)}...`
              : item.description}
          </Typography>
          <StarComponent id={item.id} sx={{ padding: 1, m: 0 }} />
        </CardContent>
      </NavLink>
    </Card>
  );

  if (data.length === 0) {
    return (
      <Typography variant="h4" align="center" component="div" sx={{ mt: 4 }}>
        Nenhuma imagem disponível
      </Typography>
    );
  }

  return isPortrait ? (
    data.map((item) => (
      <React.Fragment key={item.id}>
        {renderCard(item, true)}
      </React.Fragment>
    ))
  ) : (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
      {data.map((item) => (
        <React.Fragment key={item.id}>
          {renderCard(item, false)}
        </React.Fragment>
      ))}
    </Masonry>
  );
};

export default React.memo(ImageMasonry);
