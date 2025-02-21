import React from "react";
import { Helmet } from "react-helmet";

// https://metatags.io/
const SocialMetaTags = ({ title, image, description }) => {

  let url = window.location.href;

  return (<>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || url} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:alt" content={image || url} />
      <meta name="twitter:site" content="@olhotofografico" />
    </Helmet>
  </>
  );
};



export default React.memo(SocialMetaTags);
