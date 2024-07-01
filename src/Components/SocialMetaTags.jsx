import React from 'react';
import { Helmet } from 'react-helmet';
import { useMetaTags } from './MetaTagsContext';

// https://cards-dev.twitter.com/validator

function SocialMetaTags() {
  const { metaTags } = useMetaTags();

  return (
    <Helmet>
      <title>{metaTags.title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTags.title} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content={metaTags.url} />
      <meta property="og:description" content={metaTags.description} />
      <meta property="og:image" content={metaTags.image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="300" />

      <meta name="twitter:card" content={metaTags.image} />
      <meta name="twitter:title" content={metaTags.title} />
      <meta name="twitter:description" content={metaTags.description} />
      <meta name="twitter:image" content={metaTags.image} />
      <meta name="twitter:creator" content="@AlePortolio" />
    </Helmet>
  );
}

export default SocialMetaTags;
