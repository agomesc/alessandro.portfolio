import React from 'react';
import { Helmet } from 'react-helmet';
import { useMetaTags } from './MetaTagsContext';

function SocialMetaTags() {

  const { metaTags } = useMetaTags();
  const host = window.location.hostname;
  const port = window.location.port || 3000; // Use a porta 3000 se não houver porta especificada
  const url = `http://${host}:${port}`;
  const image = url + metaTags.image;
  return (
    <Helmet>
      <title>{metaTags.title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaTags.url} />
      <meta property="og:title" content={metaTags.title} />
      <meta property="og:description" content={metaTags.description} />
      <meta property="og:image" content={image} />
      <meta property="twitter:card" content={image} />
      <meta property="twitter:url" content={metaTags.url} />
      <meta property="twitter:title" content={metaTags.title} />
      <meta property="twitter:description" content={metaTags.description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}

export default SocialMetaTags;
