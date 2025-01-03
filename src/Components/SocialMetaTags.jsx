import { useState, useEffect } from 'react';

const SocialMetaTags = ({ title, description, url }) => {
  const [metaTitle, setMetaTitle] = useState(title);
  const [metaDescription, setMetaDescription] = useState(description);
  const [metaUrl, setMetaUrl] = useState(url);

  useEffect(() => {
    const updateMetaTag = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(name.includes('og:') || name.includes('twitter:') ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    document.title = metaTitle;

    updateMetaTag('description', metaDescription);
    updateMetaTag('og:title', metaTitle);
    updateMetaTag('og:description', metaDescription);
    updateMetaTag('og:image', metaUrl);
    updateMetaTag('og:url', metaUrl);
    updateMetaTag('twitter:title', metaTitle);
    updateMetaTag('twitter:description', metaDescription);
    updateMetaTag('twitter:image', metaUrl);

  }, [metaTitle, metaDescription, metaUrl]);

  useEffect(() => {
    setMetaTitle(title);
    setMetaDescription(description);
    setMetaUrl(url);
  }, [title, description, url]);

  return null;
};

export default SocialMetaTags;
