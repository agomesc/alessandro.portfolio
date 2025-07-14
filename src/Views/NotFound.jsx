import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

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
            <Container sx={{ textAlign: "center", marginTop: "50px" }}>
                <Typography component="div" variant="h3" color="primary">
                    404
                </Typography>
                <Typography component="div" variant="h5" color="textSecondary" gutterBottom>
                    Oops! Página não encontrada.
                </Typography>
                <Typography component="div" variant="body1">
                    A página que você está procurando não existe ou foi removida.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "20px" }}
                    onClick={() => navigate("/")}
                >
                    Voltar para a página inicial
                </Button>
            </Container>


        </Box>


    );
};

export default NotFound;