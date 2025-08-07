import React, { useEffect, useState } from "react";

const FlickrToWebP = ({ flickrUrl, alt = "", style = {}, className = "" }) => {
  const [webpSrc, setWebpSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const convertToWebP = async () => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous"; // necessário para imagens externas
        img.src = flickrUrl;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              const webpURL = URL.createObjectURL(blob);
              setWebpSrc(webpURL);
              setLoading(false);
            },
            "image/webp",
            0.85
          );
        };
      } catch (error) {
        console.error("Erro ao converter para WebP:", error);
        setLoading(false);
      }
    };

    convertToWebP();
  }, [flickrUrl]);

  return (
    <div style={{ ...style, position: "relative" }} className={className}>
      {loading && <p>Carregando imagem...</p>}
      {!loading && webpSrc && (
        <img
          src={webpSrc}
          alt={alt}
          style={{ width: "100%", display: "block" }}
        />
      )}
    </div>
  );
};

export default FlickrToWebP;
