import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaPinterest } from 'react-icons/fa';


const SocialShareBar = ({ url, title }) => {
  const socialNetworks = [
    { name: 'Facebook', icon: <FaFacebook />, shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: 'Twitter', icon: <FaTwitter />, shareUrl: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
    { name: 'LinkedIn', icon: <FaLinkedin />, shareUrl: `https://www.linkedin.com/shareArticle?url=${url}&title=${title}` },
    { name: 'WhatsApp', icon: <FaWhatsapp />, shareUrl: `https://api.whatsapp.com/send?text=${title} ${url}` },
    { name: 'Pinterest', icon: <FaPinterest />, shareUrl: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}` }
  ];

  return (
     <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px', 
        position: 'relative',
        
      }}
    >
      <div style={{ display: 'flex', gap: '15px', marginBottom: '5%' }}>
        {socialNetworks.map((network) => (
          <a
            key={network.name}
            href={network.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${network.name}`}
            title={`Compartilhar no ${network.name}`}
            style={{ fontSize: '1.5rem', color: 'var(--primary-color)', transition: 'color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--secundary-color)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--primary-color)')}
          >
            {network.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SocialShareBar);
