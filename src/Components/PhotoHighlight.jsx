import React, { useMemo } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LazyImage from './LazyImage'; // Certifique-se de que este caminho está correto

// Componente para exibir uma única foto aleatória em destaque
const App = ({ itemData = [] }) => {

    // Usa useMemo para selecionar uma foto aleatória apenas uma vez por renderização
    // se itemData não mudar, garantindo que a foto permaneça a mesma
    // até que o componente seja remontado ou itemData mude.
    const randomPhoto = useMemo(() => {
        if (!itemData || itemData.length === 0) {
            return null; // Retorna null se não houver dados
        }
        const randomIndex = Math.floor(Math.random() * itemData.length);
        return itemData[randomIndex];
    }, [itemData]); // Recalcula apenas se itemData mudar

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '1024px', // Adicionado: Largura máxima de 1024px
                margin: '0 auto',   // Adicionado: Centraliza o componente horizontalmente
                height: '400px', // Altura do banner de destaque
                position: 'relative',
                overflow: 'hidden',
                mt: 4, // Margem superior
                display: 'flex', // Para centralizar conteúdo se a imagem não preencher
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0', // Cor de fundo para quando não houver imagem
            }}
        >
            {randomPhoto ? (
                <>
                    <LazyImage
                        src={randomPhoto.url.replace('_q.jpg', '_b.jpg')}
                        alt={randomPhoto.title || "Foto em Destaque"}
                        width="100%"
                        height="100%"
                        sx={{
                            objectFit: 'cover', // Garante que a imagem cubra a área sem distorção
                            display: 'block',
                            position: 'absolute', // Permite que o texto fique por cima
                            top: 0,
                            left: 0,
                        }}
                    />

                </>
            ) : (
                <Typography component="div" variant="h6" color="text.secondary">
                    Nenhuma foto disponível para destaque.
                </Typography>
            )}
        </Box>
    );
};

export default React.memo(App);