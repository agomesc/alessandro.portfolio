import React, { useMemo } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from '@mui/material/Skeleton';

// Não vamos mais precisar do LazyImage dentro do Box para o efeito fixo,
// pois a imagem será o background do Box.
// Mantenha LazyImage se você o usa em outros lugares ou para um fallback.
// import LazyImage from './LazyImage'; // Mantenha se LazyImage for útil para outros propósitos.

// Componente para exibir uma única foto aleatória em destaque
const PhotoHighlight = ({ itemData = [] }) => {

    const randomPhoto = useMemo(() => {
        if (!itemData || itemData.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * itemData.length);
        return itemData[randomIndex];
    }, [itemData]);

    // Determine a URL da imagem de alta resolução
    const imageUrl = randomPhoto?.url ? randomPhoto.url.replace('_q.jpg', '_b.jpg') : '';
    const altText = randomPhoto?.title || "Foto em Destaque";

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '1024px', // Largura máxima para o container
                margin: '0 auto',  
                height: { xs: '250px', sm: '350px', md: '400px' }, // Altura responsiva
                position: 'relative',
                overflow: 'hidden', // Importante para o efeito de paralaxe se houver conteúdo interno
                mt: 4, // Margem superior
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0', // Cor de fundo fallback
                borderRadius: '8px',

                // Propriedades para o efeito de imagem fixa (Paralaxe)
                // A imagem será o background deste Box
                backgroundImage: randomPhoto ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover', // A imagem cobrirá todo o Box
                backgroundPosition: 'center center', // Centraliza a imagem
                backgroundAttachment: 'fixed', // ESSENCIAL para o efeito de paralaxe
                backgroundRepeat: 'no-repeat', // Evita repetições da imagem
            }}
        >
            {/* Se não houver foto, exibe o Skeleton ou mensagem */}
            {!randomPhoto && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{
                        bgcolor: 'grey.300',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1, // Garante que o skeleton fique sobre o background inicial
                    }}
                >
                    <Typography component="div" variant="h6" color="text.secondary" sx={{ p: 2 }}>
                        Nenhuma foto disponível para destaque.
                    </Typography>
                </Skeleton>
            )}
            {/* Opcionalmente, adicione um overlay para melhorar a legibilidade do texto */}
             {randomPhoto && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Overlay escuro suave
                        zIndex: 2, // Garante que o overlay fique sobre a imagem de fundo
                    }}
                />
            )}
            {/* Você pode adicionar um título ou outra informação aqui, sobrepondo a imagem */}
            {randomPhoto && (
                 <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                        zIndex: 3, 
                        textAlign: 'center',
                        p: 2,
                    }}
                 >
                    {altText}
                 </Typography>
            )}
        </Box>
    );
};

export default React.memo(PhotoHighlight);