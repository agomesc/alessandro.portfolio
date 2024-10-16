import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const SocialMetaTags = ({ title, description, url }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isDomLoaded, setIsDomLoaded] = useState(false);

  useEffect(() => {
    const handleDomLoaded = () => {
      setCurrentUrl(window.location.href);
      setIsDomLoaded(true);
    };

    if (document.readyState === 'complete') {
      handleDomLoaded();
    } else {
      window.addEventListener('load', handleDomLoaded);
    }

    return () => window.removeEventListener('load', handleDomLoaded);
  }, []);

  useEffect(() => {
    if (isDomLoaded) {
      if (title) document.title = title;

      if (description) {
        let descMeta = document.querySelector("meta[name='description']");
        if (!descMeta) {
          descMeta = document.createElement('meta');
          descMeta.name = 'description';
          document.head.appendChild(descMeta);
        }
        descMeta.setAttribute('content', description);
      }

      if (url) {
        let ogImageMeta = document.querySelector("meta[property='og:image']");
        if (!ogImageMeta) {
          ogImageMeta = document.createElement('meta');
          ogImageMeta.setAttribute('property', 'og:image');
          document.head.appendChild(ogImageMeta);
        }
        ogImageMeta.setAttribute('content', url);

        let twitterImageMeta = document.querySelector("meta[name='twitter:image']");
        if (!twitterImageMeta) {
          twitterImageMeta = document.createElement('meta');
          twitterImageMeta.name = 'twitter:image';
          document.head.appendChild(twitterImageMeta);
        }
        twitterImageMeta.setAttribute('content', url);
      }
    }
  }, [isDomLoaded, title, description, url]);

  if (!isDomLoaded) return null;

  return (
    <Helmet>
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SocialMetaTags;
