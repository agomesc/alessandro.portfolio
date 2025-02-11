import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { hydrate, render } from "react-dom";

const SocialMetaTags = ({ title, description, url }) => {

  return (

    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={url} />
        <meta property="og:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={url} />
      </Helmet>
    </HelmetProvider>

  );
};

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(SocialMetaTags, rootElement);
} else {
  render(SocialMetaTags, rootElement);
}

const prefersColorSchemeWatcher = window.matchMedia("(prefers-color-scheme: dark)");

prefersColorSchemeWatcher.addEventListener("change", () => {
  const favicon = document.querySelector('link[rel="icon"]');
  favicon.href = null;
  favicon.href = "/favicon.ico";
});

export default React.memo(SocialMetaTags);
