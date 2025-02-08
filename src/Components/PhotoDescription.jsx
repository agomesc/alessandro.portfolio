import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const PhotoDescription = ({ imageUrl, description }) => {
  return (
    <Box
      sx={{
        p: 0,
        width: "98%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <Typography sx={{ mt: 10, mb: 3 }} variant="h3">
        Sobre?
      </Typography>
      <Paper elevation={3}>
        <Grid container justifyContent="center">
          <Grid item>
            <Card
              style={{
                maxWidth: "50%",
                margin: "0 auto",
              }}
            >
              <CardContent 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center' 
                }}
              >
                <Box
                  component="img"
                  sx={{
                    width: "10%",
                    height: "auto",
                  }}
                  src={imageUrl}
                  alt="Minha Imagem"
                />
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mt: 2,
                    width: '100%'
                  }}
                >
                  <Typography 
                    variant="body1" component="p"
                  >
                    {description}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default React.memo(PhotoDescription);
