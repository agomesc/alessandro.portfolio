import { useState, useEffect, lazy, useMemo, Suspense } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Pagination,
  Box,
  Skeleton,
  TextField // Import TextField for the search input
} from '@mui/material';
import { Link } from "react-router-dom";

const LinkPreview = lazy(() => import('../Components/LinkPreview'));
const TypographyTitle = lazy(() => import('../Components/TypographyTitle'));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));

const ListContentWithPagination = () => {
  const [ads, setAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const title = 'Garinpo de Ofertas de Equipamentos Fotográficos';
  const descricao = useMemo(() => `
      🛍️ Economize com inteligência e apoie o meu trabalho!
      Você quer encontrar os melhores preços de produtos online, sem perder tempo pesquisando em vários sites? No meu link, eu já filtrei para você as ofertas mais vantajosas de grandes empresas — tudo prático, seguro e atualizado!
      Esse sistema me ajuda a continuar oferecendo esse serviço, e cada compra que você faz por lá é uma forma de apoiar o meu trabalho.
      Então, antes de comprar qualquer coisa online, dê uma olhadinha no link. Você pode economizar e ainda contribuir com quem faz esse garimpo por você. 💡
  `, []);

  useEffect(() => {
    const fetchAds = async () => {
      const querySnapshot = await getDocs(collection(db, 'content'));
      const adsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString(),
      }));
      setAds(adsData);
    };

    fetchAds();
  }, []);

  const handlePageChange = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when the search term changes
  };

  // Filter ads based on the search term
  const filteredAds = useMemo(() => {
    return ads.filter(ad =>
      ad.title && ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ads, searchTerm]);

  const paginatedAds = filteredAds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Suspense fallback={<CustomSkeleton />}>
      <ContentContainer sx={{ mt: 20 }}>
        <TypographyTitle src={title} />
        <Typography
          variant="body1"
          component="div"
          sx={{
            p: 10,
            alignContent: "center",
            margin: "0 auto",
            padding: "0 20px",
            mb: 5,
            textAlign: "justify",
          }}
        >
          {descricao}
        </Typography>

        {/* Search Input Field */}
        <Box sx={{ mb: 4, px: 2 }}>
          <TextField
            label="Buscar por título"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        <Grid container spacing={3}>
          {paginatedAds.map(ad => (
            <Grid item xs={12} sm={6} md={3} key={ad.id}>
              <Card>
                <CardContent>
                  {ad.isLink ? (
                    <Link
                      target="_blank"
                      to={ad.text}
                      style={{ textDecoration: 'none' }}
                    >
                      <Suspense fallback={<Skeleton variant="rectangular" height={140} />}>
                        <LinkPreview url={ad.text} />
                      </Suspense>
                    </Link>
                  ) : (
                    <Typography
                      dangerouslySetInnerHTML={{ __html: ad.text }}
                      variant="body2"
                      component="div"
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredAds.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
        <SocialMetaTags
          title={title}
          image="/logo-512.png"
          description={descricao}
          url={`${window.location.origin}/listContentWithPagination`}
          type="website"
        />

        </ContentContainer>
    </Suspense>
  );
};

export default ListContentWithPagination;