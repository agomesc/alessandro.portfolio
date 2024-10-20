import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

const SocialMetaTags = ({ title, description, url }) => {
  const [metaTitle, setMetaTitle] = useState(title);
  const [metaDescription, setMetaDescription] = useState(description);
  const [metaUrl, setMetaUrl] = useState(url);

  useEffect(() => {
    setMetaTitle(title);
    setMetaDescription(description);
    setMetaUrl(url);
  }, [title, description, url]);

  return (
    <Helmet>

      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaUrl} />
      <meta property="og:url" content={window.location.search} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaUrl} />
      <link rel="canonical" href={metaUrl} />
      <meta property="og:locale" content="pt-BR" />

    </Helmet>
  );
};

export default SocialMetaTags;
