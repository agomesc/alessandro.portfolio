import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
// Attempting to resolve module path by explicitly adding .js extension or assuming standard structure
import { db } from '../firebaseConfig.jsx'; // Added .js extension
import { Link } from 'react-router-dom';
import {
    Card, CardContent, Typography, Box, Pagination, Skeleton, Button // Added Button for alternative
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Lazy load TypographyTitle component
// Attempting to resolve module path by explicitly adding .jsx extension or assuming standard structure
const TypographyTitle = lazy(() => import("../Components/TypographyTitle.jsx")); // Added .jsx extension
const LazyImage = lazy(() => import("../Components/LazyImage.jsx")); // Added .jsx extension

const App = () => {
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
                const q = query(galleriesRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
                // Execute the query
                const querySnapshot = await getDocs(q);
                // Map the document data to include the document ID
                const fetchedGalleries = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGalleries(fetchedGalleries); // Update state with fetched galleries
                if (fetchedGalleries.length === 0) {
                    console.warn('Nenhuma galeria ativa encontrada ou problema na query/índices.');
                }
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

    // Handler for external link click
    const handleExternalLinkClick = (e, link) => {
        e.stopPropagation(); // Prevent the parent Card's Link from triggering
        window.open(link, '_blank', 'noopener noreferrer'); // Open the external link in a new tab
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
                        component={Link} // Make the card a clickable link to internal detail page
                        to={`/GalleryDetail/${gallery.id}`} // Navigate to detail page
                        sx={{
                            cursor: 'pointer',
                            minWidth: 240, // Minimum width for each card
                            maxWidth: { xs: 240, sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)', lg: 'calc(25% - 18px)' },
                            flexShrink: 0, // Prevent shrinking on small screens for horizontal scroll
                            textDecoration: 'none', // Remove underline from Link component
                            color: 'inherit', // Inherit text color
                            mb: { xs: 0, sm: 3 } // Add bottom margin on sm and up when wrapping
                        }}
                    >
                        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={240} />}>
                            {/* Display the image if available. Use the base64 string directly. */}
                            {gallery.image && (
                                <LazyImage
                                    src={gallery.image} // Use the base64 image data directly
                                    alt={`Gallery - ${gallery.title}`}
                                    width={240}
                                    height='auto'
                                />
                            )}
                            {/* Fallback for no image, or a placeholder if needed */}
                            {!gallery.image && (
                                <Box sx={{ width: '100%', height: 240, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography component="div" variant="caption" color="text.secondary">Sem Imagem</Typography>
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
                                    {/*
                                        MODIFICATION START:
                                        Changed Typography 'component="a"' to 'component="span"'
                                        and added an 'onClick' handler to open the external link.
                                        This avoids nesting <a> tags, which is invalid HTML.
                                    */}
                                    <Typography
                                        variant="body2"
                                        component="span" // Render as a span, not an <a> to prevent nesting issue
                                        onClick={(e) => handleExternalLinkClick(e, gallery.link)} // Use the new handler
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textDecoration: 'underline', // Add underline to signify clickability
                                            color: '#78884c',
                                            cursor: 'pointer', // Indicate it's clickable
                                            '&:hover': {
                                                color: '#5a6b38', // Slightly darker color on hover
                                            }
                                        }}
                                    >
                                        Abrir Link Externo <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                                    </Typography>
                                    {/*
                                        Alternative: Use a Material-UI Button for a more distinct clickable element:
                                        <Button
                                            variant="text"
                                            onClick={(e) => handleExternalLinkClick(e, gallery.link)}
                                            sx={{
                                                textTransform: 'none',
                                                color: '#78884c',
                                                p: 0,
                                                minWidth: 'auto',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                            startIcon={<OpenInNewIcon fontSize="small" />} // Icon as start
                                        >
                                            Abrir Link Externo
                                        </Button>
                                    */}
                                    {/* MODIFICATION END */}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Pagination controls */}
            {totalPages > 1 && ( // Render pagination only if there's more than one page
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
            )}
        </Box>
    );
};

export default App;
