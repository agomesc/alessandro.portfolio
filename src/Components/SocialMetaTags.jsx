import React from 'react';
import { Helmet } from 'react-helmet-async';

const SocialMetaTags = ({
  title,
  image,
  description,
  url, // You can now optionally pass the URL as a prop
  keywords = "", // New prop for keywords
  author = "", // New prop for author
  themeColor = "#ffffff", // New prop for theme color
  ogType = "website", // Allow overriding default Open Graph type
  locale = "pt_BR", // New prop for locale
  updatedTime, // New prop for last updated time (ISO 8601 string)
}) => {
  // Define a default image if none is provided.
  // IMPORTANT: Replace with the actual URL of your default image.
  const defaultImage = "https://olhofotografico.com.br/logo_512.png";
  const finalImage = image || defaultImage;

  // Use the provided URL prop, or fallback to window.location.origin
  // For Server-Side Rendering (SSR) frameworks, ensure 'url' is always provided.
  const currentUrl = url || (typeof window !== "undefined" ? window.location.origin : '');

  // Define a default site name and Twitter handle
  const siteName = "Olho Fotográfico"; // Replace with your actual site name
  const twitterHandle = "@olhofotografico"; // Replace with your actual Twitter handle

  return (
    <Helmet>
      {/* Page Title (for browser tab and SEO) */}
      <title>{title} | {siteName}</title>

      {/* General SEO Meta Tags */}
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      {keywords && <meta name="keywords" content={keywords} />} {/* New: Keywords */}
      <meta name="robots" content="index, follow" /> {/* New: Robots directive */}
      {author && <meta name="author" content={author} />} {/* New: Author */}
      <meta name="theme-color" content={themeColor} /> {/* New: Theme Color for mobile browsers */}
      <meta name="generator" content="React" /> {/* Example: Generator tag */}

      {/* Open Graph Tags (Facebook, LinkedIn, WhatsApp, etc.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} /> {/* Now configurable via prop */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={description} />
      <meta property="og:logo" content={finalImage} />
      <meta property="og:locale" content={locale} /> {/* New: Locale */}
      {updatedTime && <meta property="og:updated_time" content={updatedTime} />} {/* New: Updated Time */}
      <meta property="og:ttl" content="3600" /> {/* New: Cache Time To Live (1 hour) */}


      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      {/* Example: Custom Twitter Card labels and data */}
      {author && <meta name="twitter:label1" content="Author" />}
      {author && <meta name="twitter:data1" content={author} />}
      {/* You can add more twitter:labelX and twitter:dataX as needed */}

    </Helmet>
  );
};

export default React.memo(SocialMetaTags);