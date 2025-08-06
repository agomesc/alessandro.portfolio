import React from 'react' 
import { Skeleton } from '@mui/material';

const CustomSkeleton = ({ 
  height = "auto", 
  width = '100%', 
  variant = "rectangular", 
  radius = 2,
  animation = "wave", 
  sx = {} 
}) => (
  <Skeleton
    animation={animation}
    variant={variant}
    height={height}
    width={width}
    sx={{
      borderRadius: radius,
      backgroundColor: '#e0e0e0',
      ...sx,
    }}
  />
);

export default React.memo(CustomSkeleton);