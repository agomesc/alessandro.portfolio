import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const SocialMetaTags = ({ title, description, url }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isDomLoaded, setIsDomLoaded] = useState(false);

  useEffect(() => {
    const handleDomLoaded = () => {
      setCurrentUrl(window.location.href);
      setIsDomLoaded(true); // DOM está carregada
    };

    if (document.readyState === 'complete') {
      handleDomLoaded(); // DOM já estava carregada
    } else {
      window.addEventListener('load', handleDomLoaded); // Aguardando a DOM carregar
    }

    return () => window.removeEventListener('load', handleDomLoaded); // Limpeza
  }, []);

  if (!isDomLoaded) return null; // Aguarda o DOM estar carregado antes de renderizar o componente

  return (
    <Helmet>
      <meta property="og:title" content={title} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={url} />
    </Helmet>
  );
};

export default SocialMetaTags;
