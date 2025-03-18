import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

// https://metatags.io/
const SocialMetaTags = ({ title, image, description }) => {
  const [tituloAtual, setTituloAtual] = useState('');
  const [imagemAtual, setImagemAtual] = useState('');
  const [descricaoAtual, setdescricaoAtual] = useState('');
  const [urlAtual, setUrlAtual] = useState('');

  useEffect(() => {
    setUrlAtual(window.location.href);
    setTituloAtual(title);
    setImagemAtual(image);
    setdescricaoAtual(description);
  }, [description, image, title]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={tituloAtual} />
        <meta property="og:description" content={descricaoAtual} />
        <meta property="og:image" content={imagemAtual || urlAtual} />
        <meta property="og:url" content={urlAtual} />
        <meta name="twitter:title" content={tituloAtual} />
        <meta name="twitter:description" content={descricaoAtual} />
        <meta name="twitter:image" content={imagemAtual || urlAtual} />
        <meta name="twitter:site" content="@olhotofografico" />
      </Helmet>
    </>
  );
};

export default React.memo(SocialMetaTags);
