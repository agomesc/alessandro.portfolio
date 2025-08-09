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
      padding: {
        xs: '24px 16px',
        sm: '32px 24px',
        md: '40px 32px',
      }, // espaçamento interno maior
      backgroundColor: '#ffffff',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default React.memo(ContentContainer);