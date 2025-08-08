import React from 'react';
import { Skeleton } from '@mui/material';

const CustomSkeleton = ({
  height = '100px',
  width = '100%',
  variant = 'rectangular',
  radius = 2,
  animation = 'wave',
  sx = {},
}) => (
  <Skeleton
    animation={animation}
    variant={variant}
    sx={{
      width,
      height,
      minHeight: '100px',
      borderRadius: radius,
      backgroundColor: '#e0e0e0',
      margin: '0 auto', // centraliza horizontalmente
      display: 'block', // necessário para que margin funcione corretamente
      ...sx,
    }}
  />
);

export default React.memo(CustomSkeleton);