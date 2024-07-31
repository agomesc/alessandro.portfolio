import React from 'react';
import { Helmet } from 'react-helmet';


function SocialMetaTags({ title, url, description, imageUrl }) {

  return (
    <Helmet >
      <title>{title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content={url} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="300" />

      <meta name="twitter:card" content={imageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@AlePortolio" />
    </Helmet >
  );
}

export default SocialMetaTags;
