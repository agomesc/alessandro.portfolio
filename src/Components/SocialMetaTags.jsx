import React, { useEffect } from "react";

const SocialMetaTags = ({ title, image, description }) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    document.title = title;

    const setMetaTag = (name, content, isProperty = false) => {
      let selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector);

      if (!metaTag) {
        metaTag = document.createElement("meta");
        if (isProperty) {
          metaTag.setAttribute("property", name);
        } else {
          metaTag.setAttribute("name", name);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    // Open Graph
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image || currentUrl, true);
    setMetaTag("og:url", currentUrl, true);
    setMetaTag("og:type", "website", true);

    // Twitter Cards
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image || currentUrl);
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:site", "@olhotografico");

  }, [title, image, description, currentUrl]);

  return null;
};

export default React.memo(SocialMetaTags);
