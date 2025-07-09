import React, { lazy, Suspense } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import LazyImage from "./LazyImage"; // Assumindo que este caminho está correto
import LoadingMessage from './LoadingMessage'; // Assumindo que este caminho está correto
import { NavLink } from 'react-router-dom';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

// Carrega o StarComponent de forma preguiçosa para melhor desempenho
const StarComponent = lazy(() => import('./StarComponent'));

// Variantes de animação para o contêiner e cartões individuais
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Escalonar a aparição dos cartões individuais
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80, // Ligeiramente menos rígido para uma sensação mais suave
      damping: 18,
    }
  },
};

/**
 * O componente ImageThumbs exibe uma grade responsiva de cartões de imagem.
 * Cada cartão inclui uma imagem, título, descrição, um componente de avaliação por estrelas,
 * e um ícone de galeria. Ele usa Framer Motion para animações e Material-UI
 * para layout e componentes.
 *
 * @param {Array} data - Um array de objetos de imagem. Cada objeto deve ter
 * pelo menos as propriedades 'id', 'img' e 'title'.
 * Uma propriedade 'description' é opcional.
 */
const App = ({ data = [] }) => {
  // Exibe uma mensagem se não houver imagens disponíveis
  if (data.length === 0) {
    return (
      <Typography variant="h4" align="center" component="div" sx={{ mt: 4, color: 'text.secondary' }}>
        Nenhuma imagem disponível
      </Typography>
    );
  }

  return (
    // Contêiner principal para a grade animada
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ padding: '16px' }} // Adiciona algum preenchimento ao redor da grade
    >
      {/* Contêiner da Grade do Material-UI para layout responsivo */}
      <Grid container spacing={3} justifyContent="center"> {/* Adicionado justifyContent para centralizar */}
        {data.map((item, index) => (
          // Cada item da grade envolve um motion.div para animações de cartão individuais
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <motion.div
              variants={itemVariants}
              whileHover={{
                scale: 1.03, // Aumenta ligeiramente o cartão ao passar o mouse
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)", // Sombra mais pronunciada
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                background: "#fff",
                willChange: 'transform',
                cursor: 'pointer',
                height: '100%', // Garante que os cartões em uma linha tenham altura semelhante
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* NavLink envolve todo o cartão para navegação */}
              <NavLink to={`/Photos/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                <Card
                  sx={{
                    height: '100%', // Faz o cartão preencher seu contêiner
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px', // Aplica o raio da borda ao próprio cartão
                    boxShadow: 'none', // Remove a sombra padrão do Card, pois motion.div a manipula
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  {/* CardMedia para a imagem */}
                  <CardMedia
                    component={() => (
                      <LazyImage
                        src={item.img}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '200px', // Altura fixa para imagens em cartões
                          objectFit: 'cover', // Cobre a área sem distorcer a proporção
                          borderTopLeftRadius: '16px',
                          borderTopRightRadius: '16px',
                          display: 'block',
                        }}
                      />
                    )}
                  />

                  {/* Elementos posicionados absolutamente (Estrela e Ícone da Galeria) */}
                  {/* Componente Estrela */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                        // Removidas as propriedades de estilo que criavam o círculo
                      }}
                    >
                      <Suspense fallback={<LoadingMessage />}>
                        <StarComponent id={item.id} />
                      </Suspense>
                    </Box>
                  </motion.div>

                  {/* Ícone da Galeria */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 2,
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '50%',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      <PhotoLibraryIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  </motion.div>

                  {/* CardContent para título e descrição */}
                  <CardContent sx={{ flexGrow: 1, paddingBottom: '16px !important', maxHeight:'400px' }}> {/* Importante para sobrescrever o padding-bottom padrão */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      <Typography gutterBottom variant="h6" component="div"
                        sx={{
                          fontWeight: 'bold',
                          color: '#333',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </Typography>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {item.description || 'Uma bela imagem capturada, perfeita para sua coleção de fotos.'}
                      </Typography>
                    </motion.div>
                  </CardContent>
                </Card>
              </NavLink>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default React.memo(App);
