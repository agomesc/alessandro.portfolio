import React from 'react';
import { Helmet } from 'react-helmet';
import { useMetaTags } from './MetaTagsContext';

function SocialMetaTags() {
  const { metaTags } = useMetaTags();
  return (
    <Helmet>
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaTags.url} />
      <meta property="og:title" content={metaTags.title} />
      <meta property="og:description" content={metaTags.description} />
      <meta property="og:image" content={metaTags.image} />
      <meta property="twitter:card" content={metaTags.image} />
      <meta property="twitter:url" content={metaTags.url} />
      <meta property="twitter:title" content={metaTags.title} />
      <meta property="twitter:description" content={metaTags.description} />
      <meta property="twitter:image" content={metaTags.image} />
    </Helmet>
  );
}

export default SocialMetaTags;
