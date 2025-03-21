import React, { useEffect } from "react";

const SocialMetaTags = ({ title, image, description }) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    document.title = title;

    const setMetaTag = (name, content, property = false) => {
      let metaTag = document.querySelector(
        property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      );
      if (!metaTag) {
        metaTag = document.createElement("meta");
        if (property) {
          metaTag.setAttribute("property", name);
        } else {
          metaTag.setAttribute("name", name);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image || currentUrl, true);
    setMetaTag("og:url", currentUrl, true);
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image || currentUrl);
    setMetaTag("twitter:site", "@olhotografico");
    setMetaTag("twitter:card", "summary_large_image");
  }, [title, image, description, currentUrl]);

  return null;
};

export default React.memo(SocialMetaTags);