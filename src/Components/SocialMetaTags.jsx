import React, { useEffect } from 'react';

const SocialMetaTags = ({ defaultTitle, defaultDescription, defaultImageUrl, defaultUrl }) => {
  useEffect(() => {
    // Pegando valores do sessionStorage ou usando os padrões fornecidos
    const title = sessionStorage.getItem('ogTitle') || defaultTitle;
    const description = sessionStorage.getItem('ogDescription') || defaultDescription;
    const imageUrl = sessionStorage.getItem('ogImage') || defaultImageUrl;
    const url = sessionStorage.getItem('ogUrl') || defaultUrl;

    // Atualizando sessionStorage
    sessionStorage.setItem('ogTitle', title);
    sessionStorage.setItem('ogDescription', description);
    sessionStorage.setItem('ogImage', imageUrl);
    sessionStorage.setItem('ogUrl', url);

    // Atualizando meta tags dinamicamente
    const updateMetaTag = (selector, content) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (selector.includes('property')) {
          tag.setAttribute('property', selector.split('=')[1].replace(/"/g, ''));
        } else {
          tag.setAttribute('name', selector.split('=')[1].replace(/"/g, ''));
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:image"]', imageUrl);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', imageUrl);

    // Atualizando o título da página
    document.title = title;
  }, [defaultTitle, defaultDescription, defaultImageUrl, defaultUrl]);

  return null; // Não renderiza nada no DOM
};

export default React.memo(SocialMetaTags);
