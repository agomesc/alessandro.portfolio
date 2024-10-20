import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

const SocialMetaTags = ({ title, description, url, imageUrl }) => {
  const [metaTitle, setMetaTitle] = useState(title || ''); // Use default for empty title
  const [metaDescription, setMetaDescription] = useState(description || ''); // Default for empty description
  const [metaUrl, setMetaUrl] = useState(url || window.location.href); // Default to current URL
  const [metaImageUrl, setMetaImageUrl] = useState(imageUrl || ''); // Default for empty image URL

  // Fetch initial meta tags from index.html (if possible)
  useEffect(() => {
    const fetchInitialMeta = async () => {
      try {
        const response = await fetch('/index.html');
        const html = await response.text();

        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        const descriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
        const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/);

        if (titleMatch) {
          setMetaTitle(titleMatch[1]);
        }
        if (descriptionMatch) {
          setMetaDescription(descriptionMatch[1]);
        }
        if (ogImageMatch) {
          setMetaImageUrl(ogImageMatch[1]);
        }
      } catch (error) {
        console.warn('Failed to fetch initial meta tags from index.html:', error);
      }
    };

    // Only attempt fetching if not running in a server-side rendered environment
    if (typeof window !== 'undefined') {
      fetchInitialMeta();
    }
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    setMetaTitle(title);
    setMetaDescription(description);
    setMetaUrl(url);
    setMetaImageUrl(imageUrl);
  }, [title, description, url, imageUrl]); // Update on prop changes

  const ogLocale = 'pt-BR'; // Replace with your desired locale

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta property="og:type" content="website" />
      <meta property="og:logo" content="%PUBLIC_URL%/logo_512.png" />
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImageUrl} />
      <meta property="og:url" content={metaUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImageUrl} />
      <link rel="canonical" href={metaUrl} />
      <meta property="og:locale" content={ogLocale} />
    </Helmet>
  );
};

export default SocialMetaTags;