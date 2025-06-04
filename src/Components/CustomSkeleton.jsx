import { Skeleton, Box } from '@mui/material';

const CustomSkeleton = ({ height = 200, width = '100%' }) => (
    <Box sx={{ width }}>
        <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 2 }} />
        <Skeleton width="60%" />
        <Skeleton width="40%" />
    </Box>
);

export default CustomSkeleton;
