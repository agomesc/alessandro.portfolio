import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom'; // 👈 Adicione isso

const SocialMetaTags = ({
  title,
  image,
  description,
  url,
  keywords = "",
  author = "",
  themeColor = "#ffffff",
  ogType = "website",
  locale = "pt_BR",
  updatedTime,
}) => {
  const location = useLocation(); // 👈 Pegando a URL atual do React Router

  const defaultImage = "https://olhofotografico.com.br/logo_512.png";
  const finalImage = image || defaultImage;

  const currentUrl = url || (typeof window !== "undefined"
    ? `${window.location.origin}${location.pathname}${location.search}`
    : '');

  const siteName = "Olho Fotográfico";
  const twitterHandle = "@olhofotografico";

  return (
    <Helmet>
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      {author && <meta name="author" content={author} />}
      <meta name="theme-color" content={themeColor} />
      <meta name="generator" content="React" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={description} />
      <meta property="og:logo" content={finalImage} />
      <meta property="og:locale" content={locale} />
      {updatedTime && <meta property="og:updated_time" content={updatedTime} />}
      <meta property="og:ttl" content="3600" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      {author && <meta name="twitter:label1" content="Author" />}
      {author && <meta name="twitter:data1" content={author} />}
    </Helmet>
  );
};

export default React.memo(SocialMetaTags);
