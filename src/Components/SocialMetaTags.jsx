import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

const SocialMetaTags = ({ initialTitle, initialDescription, initialUrl }) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setUrl(initialUrl);
  }, [initialTitle, initialDescription, initialUrl]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={url} />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={url} />
    </Helmet>
  );
};

export default SocialMetaTags;
