import { Helmet } from 'react-helmet-async';

const SocialMetaTags = ({ title, image, description }) => {
  // Define a default image if none is provided.
  // IMPORTANT: Replace with the actual URL of your default image.
  const defaultImage = "https://olhofotografico.com.br/logo_192.png"; 
  const finalImage = image || defaultImage;
  let url = window.location.origin;
  // Use the provided URL or window.location.href as a fallback.
  // window.location.href is only available in the client-side environment.
  // For Server-Side Rendering (SSR) frameworks, ensure 'url' is always provided.
  const currentUrl = url || (typeof window !== "undefined" ? window.location.origin : '');

  // Define a default site name and Twitter handle
  const siteName = "Olho Fotográfico"; // Replace with your actual site name
  const twitterHandle = "@olhofotografico"; // Replace with your actual Twitter handle

  return (
    <Helmet>
      {/* Page Title (for browser tab and SEO) */}
      <title>{title} | {siteName}</title> {/* Added site name to title for better branding */}

      {/* General SEO Meta Tags */}
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Tags (Facebook, LinkedIn, WhatsApp, etc.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" /> {/* 'article', 'product', etc. depending on content */}
      <meta property="og:site_name" content={siteName} /> {/* Essential for branding */}
      <meta property="og:image:width" content="1200" /> {/* Recommended image width for Open Graph */}
      <meta property="og:image:height" content="630" /> {/* Recommended image height for Open Graph */}
      <meta property="og:image:alt" content={description} />
      <meta property="og:logo" content={finalImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" /> {/* 'summary' for smaller images */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content={twitterHandle} /> {/* Your Twitter handle */}
      <meta name="twitter:creator" content={twitterHandle} /> {/* Your Twitter handle */}
      {/* For Twitter, make sure your image meets the recommended dimensions (e.g., 1200x675 for summary_large_image) */}
    </Helmet>
  );
};

export default SocialMetaTags;