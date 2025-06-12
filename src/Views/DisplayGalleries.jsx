import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom';
import {
    Card, CardContent, Typography, Box, Pagination, Skeleton
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Lazy load TypographyTitle component
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const DisplayGalleries = () => {
    // State to store the fetched galleries
    const [galleries, setGalleries] = useState([]);
    // State for current pagination page
    const [currentPage, setCurrentPage] = useState(1);
    // Number of items to display per page
    const itemsPerPage = 4;
    // Ref for scrolling to the top of the content area on page change
    const scrollRef = useRef(null);

    // useEffect hook to fetch galleries from Firestore on component mount
    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                // Get a reference to the 'galleries' collection
                const galleriesRef = collection(db, 'galleries');
                // Create a query to fetch active galleries, ordered by creation time in descending order
                // IMPORTANT: orderBy() can sometimes require composite indexes in Firestore.
                // If you encounter issues, consider fetching all data and sorting in-memory.
                const q = query(galleriesRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
                // Execute the query
                const querySnapshot = await getDocs(q);
                // Map the document data to include the document ID
                const fetchedGalleries = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGalleries(fetchedGalleries); // Update state with fetched galleries
            } catch (error) {
                console.error('Erro ao buscar galerias:', error);
                // In a production app, you might want to display a user-friendly error message here
            }
        };
        fetchGalleries(); // Call the fetch function
    }, []); // Empty dependency array means this effect runs once on mount

    // Sort galleries client-side as an additional safety measure,
    // in case Firestore's orderBy isn't fully reliable or for more complex sorting logic.
    const sortedGalleries = [...galleries].sort((a, b) => {
        // Access 'seconds' property of Firestore Timestamp or default to 0 for safety
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime; // Sort in descending order (latest first)
    });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(sortedGalleries.length / itemsPerPage);
    // Calculate start and end indices for current page's items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Slice the array to get items for the current page
    const currentItems = sortedGalleries.slice(startIndex, endIndex);

    // Handler for page changes in pagination
    const handlePageChange = (event, value) => {
        setCurrentPage(value); // Update current page
        // Scroll to the top of the content area smoothly
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box
            sx={{
                width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%" }, // Responsive width
                margin: "0 auto", // Center horizontally
                px: 2, // Horizontal padding
                mt: 10 // Top margin
            }}
        >
            {/* Lazy load TypographyTitle with a skeleton fallback */}
            <Suspense fallback={<Skeleton variant="text" height={60} width="30%" sx={{ mb: 3 }} />}>
                <TypographyTitle src="Conteúdos" />
            </Suspense>

            {/* Box to contain gallery cards, with horizontal scrolling for small screens */}
            <Box
                ref={scrollRef} // Attach scroll ref to this box
                sx={{
                    display: 'flex',
                    flexWrap: { xs: 'nowrap', sm: 'wrap' }, // No wrap on xs, wrap on sm and up
                    overflowX: 'auto', // Enable horizontal scrolling for xs
                    gap: 3, // Gap between cards
                    pb: 2, // Bottom padding
                    pt: 1, // Top padding
                    // Custom scrollbar styling for webkit browsers
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc',
                        borderRadius: '4px',
                    },
                }}
            >
                {/* Map through current items to render each gallery card */}
                {currentItems.map((gallery) => (
                    <Card
                        key={gallery.id}
                        component={Link} // Make the card a clickable link
                        to={`/GalleryDetail/${gallery.id}`} // Navigate to detail page
                        sx={{
                            cursor: 'pointer',
                            minWidth: 240, // Minimum width for each card
                            maxWidth: { xs: 240, sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)', lg: 'calc(25% - 18px)' }, // Responsive max width
                            flexShrink: 0, // Prevent shrinking on small screens for horizontal scroll
                            textDecoration: 'none', // Remove underline from Link component
                            color: 'inherit', // Inherit text color
                            mb: { xs: 0, sm: 3 } // Add bottom margin on sm and up when wrapping
                        }}
                    >
                        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={240} />}>
                            {/* Display the image if available. Use the base64 string directly. */}
                            {gallery.image && (
                                <img
                                    src={gallery.image} // Use the base64 image data directly
                                    alt={`Gallery - ${gallery.title}`}
                                    style={{
                                        width: '100%',
                                        height: 240, // Fixed height for consistent card appearance
                                        objectFit: 'cover', // Cover the area without distorting aspect ratio
                                        borderRadius: '4px 4px 0 0' // Rounded top corners
                                    }}
                                />
                            )}
                            {/* Fallback for no image, or a placeholder if needed */}
                            {!gallery.image && (
                                <Box sx={{ width: '100%', height: 240, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">Sem Imagem</Typography>
                                </Box>
                            )}
                        </Suspense>

                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ color: '#78884c' }}>
                                {gallery.title}
                            </Typography>
                            {/* Display external link if available */}
                            {gallery.link && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography
                                        variant="body2"
                                        component="a"
                                        href={gallery.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        // Prevent card's Link behavior when clicking the external link
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                            color: '#78884c',
                                        }}
                                    >
                                        Abrir Link Externo <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Pagination controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={totalPages} // Total number of pages
                    page={currentPage} // Current active page
                    onChange={handlePageChange} // Handler for page change
                    color="primary" // Primary color theme
                    shape="rounded" // Rounded buttons
                    size="large" // Larger pagination buttons
                    showFirstButton // Show button to go to first page
                    showLastButton // Show button to go to last page
                />
            </Box>
        </Box>
    );
};

export default React.memo(DisplayGalleries);
