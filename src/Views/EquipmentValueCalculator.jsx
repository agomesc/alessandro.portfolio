import React, { lazy, Suspense } from 'react';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const EquipmentValueCalculator = lazy(() => import('../Components/EquipmentValueCalculator'));
const CustomSkeleton = lazy(() => import('../Components/CustomSkeleton'));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));

const App = () => {
  return (
    <Suspense fallback={<CustomSkeleton />}>
      <ContentContainer sx={{ mt: 20 }}>
        <TypographyTitle src="Calcular Valor Estimado" />
        <EquipmentValueCalculator />
        <CommentBox itemID="EquipmentValueCalculator" />
        <SocialMetaTags
          title="Calcular valor de equipamentos fotográficos usados"
          image="/logo-512.png"
          description="Calcular valor de equipamentos fotográficos usados usando regras de mercado e dados de venda."
          url={`${window.location.origin}/equipmentValueCalculator`}
          type="website"
        />
      </ContentContainer>
    </Suspense>
  );
}

export default React.memo(App);