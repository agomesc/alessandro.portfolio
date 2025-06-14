import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import TypographyTitle from './TypographyTitle'; // Assuming this component exists

const SwipeableSlider = ({ itemData }) => {
  const navigate = useNavigate();

  // A primeira foto na array original (itemData) será a destacada
  const firstItemIndex = 0;

  return (
    <Box
      sx={{
        p: 0,
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
          lg: "70%",
          xl: "80%"
        },
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: "0 20px",
        mt: 10
      }}
    >
      <TypographyTitle src="Atualizações" />
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2, // Espaço entre as imagens
          scrollbarWidth: "thin", // Ajuste da barra de rolagem
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "6px",
          }
        }}
      >
        {itemData.map((photo, index) => ( // Mapeando a array original novamente
          <Box
            key={index} // Use o índice como chave (ou photo.id se disponível e único)
            sx={{
              position: 'relative', // Necessário para o posicionamento absoluto da etiqueta "Nova"
              flexShrink: 0, // Evita que as imagens encolham
            }}
          >
            {/* A etiqueta "Nova" é aplicada se este for o primeiro item da array */}
            {index === firstItemIndex && (
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: -5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'error.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  zIndex: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                Nova
              </Typography>
            )}
            <img
              src={photo.url}
              alt={`Imagem ${index + 1}`}
              style={{
                // Aplica os estilos de destaque se este for o primeiro item da array
                width: index === firstItemIndex ? "150px" : "120px",
                height: index === firstItemIndex ? "100px" : "80px",
                objectFit: "cover",
                borderRadius: "8px",
                border: index === firstItemIndex ? "3px solid #1976d2" : "none",
                boxShadow: index === firstItemIndex ? "0px 0px 10px rgba(0, 0, 0, 0.5)" : "none",
                transition: "all 0.3s ease-in-out",
                display: 'block',
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Link para outro componente, alinhado à direita */}
      <Box sx={{ textAlign: 'right', mt: 4, mb: 4 }}> {/* Alterado de 'center' para 'right' */}
        <Link
          component="button"
          variant="body1"
          onClick={() => {
            navigate('/latestphotos'); // Navega para a rota /latestphotos
          }}
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          Ver todas as atualizações
        </Link>
      </Box>
    </Box>
  );
};

export default React.memo(SwipeableSlider);
