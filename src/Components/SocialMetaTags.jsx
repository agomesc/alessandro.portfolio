import React from 'react';
import { Helmet } from 'react-helmet';
import { useMetaTags } from './MetaTagsContext';

// https://cards-dev.twitter.com/validator

function SocialMetaTags() {
  const { metaTags } = useMetaTags();
  const image = `${window.location.protocol}//${window.location.host}${metaTags.image}`;

  console.log(metaTags);
  console.log(image);

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
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="300" />

      <meta name="twitter:card" content={image} />
      <meta name="twitter:title" content={metaTags.title} />
      <meta name="twitter:description" content={metaTags.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@AlePortolio" />
    </Helmet>
  );
}

export default SocialMetaTags;
