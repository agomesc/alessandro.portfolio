import React from 'react';

const SocialMetaTags = ({ title, description, url }) => {

  return (
    <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={url} />
        <meta property="og:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={url} />
    </>
  );
};

export default React.memo(SocialMetaTags);
