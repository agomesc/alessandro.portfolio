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
  Skeleton
} from '@mui/material';
import { Link } from "react-router-dom";

const LinkPreview = lazy(() => import('../Components/LinkPreview'));
const TypographyTitle = lazy(() => import('../Components/TypographyTitle'));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const ListContentWithPagination = () => {
  const [ads, setAds] = useState([]);
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

  const paginatedAds = ads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
   <Box
        sx={(theme) => ({
          p: 0,
          width: {
            xs: "100%",
            sm: "90%",
            md: "80%",
            lg: "70%",
            xl: "80%",
          },
          alignContent: "center",
          alignItems: "center",
          margin: "0 auto",
          padding: theme.customSpacing.pagePadding,
          mt: theme.customSpacing.sectionMarginTop,
        })}
      >
      <Suspense fallback={<Skeleton variant="text" height={40} />}>
        <TypographyTitle src={title} />
      </Suspense>

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
          count={Math.ceil(ads.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Suspense fallback={null}>
        <SocialMetaTags
          title={title}
          image="/logo-512.png"
          description={descricao}
        />
      </Suspense>
    </Box>
  );
};

export default ListContentWithPagination;
