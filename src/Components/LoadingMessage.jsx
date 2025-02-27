import React from 'react';
import Box from '@mui/material/Box';

const LoadingMessage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '50px',
          height: '50px',
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          transform: 'translate(-50%, -50%)'
        },
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}
    >
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
      </Box>
    </Box>
  );
};

export default React.memo(LoadingMessage);
