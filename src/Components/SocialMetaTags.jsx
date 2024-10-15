import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const SocialMetaTags = ({ title, description, url }) => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

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
