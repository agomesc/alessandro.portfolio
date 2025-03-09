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
        width: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '50px',
          height: '50px',
          marginLeft: '-25px',
          border: '6px solid #c0810d',
          borderTop: '6px solid #c0810d',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          transform: 'translate(-50%, -50%)'
        },
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}
    />
  );
};

export default React.memo(LoadingMessage);
