import React from "react";
import { Helmet } from "react-helmet";

const SocialMetaTags = ({ title, image, description }) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet defaultTitle={title}>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || currentUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || currentUrl} />
      <meta name="twitter:site" content="@olhotografico" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default React.memo(SocialMetaTags);
