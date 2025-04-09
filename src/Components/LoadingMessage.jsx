/** @jsxImportSource @emotion/react */
import React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingMessage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ position: 'relative', width: '100%' }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #78884c',
          borderRadius: '50%',
          animation: `${spin} 1s linear infinite`,
        }}
      />
    </Box>
  );
};

export default React.memo(LoadingMessage);
