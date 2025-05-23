import React, { lazy } from 'react';
import EquipmentValueCalculator from '../Components/EquipmentValueCalculator';
import Box from "@mui/material/Box";
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const App = () => {
  return (<>
    <Box
      sx={{
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
        padding: "0 20px",
        mt: 10,
      }}
    >
      <TypographyTitle src="Calcular Valor Estimado" />
      <EquipmentValueCalculator />
    </Box>

    <CommentBox itemID="EquipmentValueCalculator" />

    <SocialMetaTags
      title="Calcular valor de equipamentos usados"
      image=""
      description="Calcular valor de equipamentos usados"
    />

  </>
  );
}

export default React.memo(App);