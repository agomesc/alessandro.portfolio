import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const SocialShareBar = ({ url, title }) => {
  const socialNetworks = [
    { name: 'Facebook', icon: <FaFacebook />, shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: 'Twitter', icon: <FaTwitter />, shareUrl: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
    { name: 'LinkedIn', icon: <FaLinkedin />, shareUrl: `https://www.linkedin.com/shareArticle?url=${url}&title=${title}` },
    { name: 'Instagram', icon: <FaInstagram />, shareUrl: `https://www.instagram.com/?url=${url}` },
    { name: 'WhatsApp', icon: <FaWhatsapp />, shareUrl: `https://api.whatsapp.com/send?text=${title} ${url}` }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '5px' }}>
      {socialNetworks.map((network) => (
        <a key={network.name} href={network.shareUrl} target="_blank" rel="noopener noreferrer" title={`Compartilhar no ${network.name}`}>
          {network.icon}
        </a>
      ))}
    </div>
  );
};

export default React.memo(SocialShareBar);
