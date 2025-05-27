import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaPinterest } from 'react-icons/fa';
import Typography from '@mui/material/Typography';

const SocialShareBar = ({ url, title }) => {
  const socialNetworks = [
    { name: 'Facebook', icon: <FaFacebook />, shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: 'Twitter', icon: <FaTwitter />, shareUrl: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
    { name: 'LinkedIn', icon: <FaLinkedin />, shareUrl: `https://www.linkedin.com/shareArticle?url=${url}&title=${title}` },
    { name: 'WhatsApp', icon: <FaWhatsapp />, shareUrl: `https://api.whatsapp.com/send?text=${title} ${url}` },
    { name: 'Pinterest', icon: <FaPinterest />, shareUrl: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}` }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '5px' }}>
      <Typography component="div" variant="subtitle1" style={{ marginBottom: '5px' }}>
        Compartilhe
      </Typography>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '5%' }}>
        {socialNetworks.map((network) => (
          <a
            key={network.name}
            href={network.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${network.name}`}
            title={`Compartilhar no ${network.name}`}
            style={{ fontSize: '1.5rem', color: '#444', transition: 'color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#c0810d')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#444')}
          >
            {network.icon}
          </a>
        ))}
        <Typography component="div" variant="subtitle2" style={{ marginTop: '10px' }}>
          Ajude-nos!
        </Typography>
      </div>
    </div>
  );
};

export default React.memo(SocialShareBar);
