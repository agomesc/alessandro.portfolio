import React from 'react';
import Box from '@mui/material/Box';

const LoadingMessage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      position="relative" // Adiciona posição relativa ao Box para posicionar absolutamente o spinner
      sx={{
        '&::before': {
          content: '""',
          position: 'absolute', // Posiciona o spinner absolutamente
          top: '50%', // Centraliza verticalmente
          left: '50%', // Centraliza horizontalmente
          display: 'block',
          width: '50px',
          height: '50px',
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          transform: 'translate(-50%, -50%)' // Ajusta a posição exata do centro
        },
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}
    >
      <div>Aguarde, carregando...</div>
    </Box>
  );
};

export default LoadingMessage;
