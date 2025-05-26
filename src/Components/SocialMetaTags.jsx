// SocialMetaTags.js
import { Helmet } from "react-helmet";

const SocialMetaTags = ({ title, description, image }) => {
  if (typeof window === "undefined") return null;

  const currentUrl = window.location.href;

  return (
    <Helmet>
      <title>{title}</title>

      {/* Meta geral */}
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || currentUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || currentUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@olhotografico" />
    </Helmet>
  );
};

export default SocialMetaTags;
