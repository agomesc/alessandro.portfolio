import React from 'react';
import { Helmet } from 'react-helmet';
import { useMetaTags } from './MetaTagsContext';

function SocialMetaTags() {
  const { metaTags } = useMetaTags();
  const host = window.location.hostname;
  const image = host + metaTags.image;

  return (
    <Helmet>
      <title>{metaTags.title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTags.title} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content={metaTags.url} />
      <meta property="og:description" content={metaTags.description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />


      <meta name="twitter:card" content={image} />
      <meta name="twitter:title" content={metaTags.title} />
      <meta name="twitter:description" content={metaTags.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@AlePortolio" />
    </Helmet>
  );
}

export default SocialMetaTags;
