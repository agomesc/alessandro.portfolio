import React from 'react';

const SocialMetaTags = ({ title, description, url }) => {

  const updateMetaTags = () => {
    // Alterando o título da página
    document.title = title;

    // Criando ou atualizando a meta tag de descrição
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Open Graph meta tags
    const metaTags = [
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'og:image', content: url },
      { name: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: url }
    ];

    metaTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
  };

  React.useEffect(() => {
    updateMetaTags();
  }, [title, description, url]);

  return null; // Não renderiza nada no DOM
};

export default React.memo(SocialMetaTags);
