import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const SocialMetaTags = ({ title, description, url }) => {

  const setupMetaTags = () => {
    const updateMetaTag = (selector, content) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
        console.log(`Meta tag "${selector}" atualizada.`);
      } else {
        element = document.createElement('meta');
        element.setAttribute('content', content);
        document.head.appendChild(element);
        console.log(`Meta tag "${selector}" adicionada.`);
      }
    };

    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:image"]', url);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', url);
  };

  useEffect(() => {
    setupMetaTags();
  }, [title, description, url]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default React.memo(SocialMetaTags);
