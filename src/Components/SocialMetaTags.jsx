import { Helmet } from 'react-helmet-async'; // Mudado para react-helmet-async

const SocialMetaTags = ({ title, description, image, url }) => {
  // Define uma imagem padrão caso nenhuma seja fornecida.
  // SUBSTITUA PELA URL DA SUA IMAGEM PADRÃO
  const defaultImage = "https://olhofotografico.com.br/logo_192.png"; 
  const finalImage = image || defaultImage;

  // Usa a URL fornecida ou window.location.href como fallback (para SPA)
  // Mas lembre-se, window.location.href só estará disponível no cliente.
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : '');

  return (
    <Helmet>
      {/* Título da página (para aba do navegador e SEO) */}
      <title>{title}</title>

      {/* Meta tags para SEO geral */}
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Tags (Facebook, LinkedIn, WhatsApp, etc.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" /> {/* Pode ser 'article', 'product', etc. dependendo do conteúdo */}
      {/* <meta property="og:site_name" content="Seu Nome do Site" /> Ex: olhotografico.com.br */}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" /> {/* Use 'summary' para imagens pequenas */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@olhotografico" /> {/* Seu handle do Twitter */}
      <meta property="og:logo" content={finalImage} />
      <meta name="twitter:creator" content="@olhotografico" />
    </Helmet>
  );
};

export default SocialMetaTags;