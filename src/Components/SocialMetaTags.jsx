import React from "react";
import { Helmet } from "react-helmet";

const SocialMetaTags = ({ title, image, description }) => {
  const urlAtual = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || urlAtual} />
      <meta property="og:url" content={urlAtual} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || urlAtual} />
      <meta name="twitter:site" content="@olhotofografico" />
    </Helmet>
  );
};

export default React.memo(SocialMetaTags);
