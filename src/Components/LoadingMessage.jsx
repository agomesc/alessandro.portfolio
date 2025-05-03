import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingMessage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingMessage;
