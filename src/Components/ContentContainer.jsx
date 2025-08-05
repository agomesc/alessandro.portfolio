// Components/ContentContainer.jsx
import React from 'react';
import { Box } from '@mui/material';

const ContentContainer = ({ children, sx = {} }) => (
  <Box
    sx={{
      width: {
        xs: '100%',
        sm: '90%',
        md: '80%',
        lg: '70%',
        xl: '80%',
      },
      margin: '0 auto',
      padding: '0 20px',
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default React.memo(ContentContainer);
