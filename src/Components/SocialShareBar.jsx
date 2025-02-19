import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp, FaPinterest } from 'react-icons/fa';
import Typography from '@mui/material/Typography';

const SocialShareBar = ({ url, title }) => {
  const socialNetworks = [
    { name: 'Facebook', icon: <FaFacebook />, shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: 'Twitter', icon: <FaTwitter />, shareUrl: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
    { name: 'LinkedIn', icon: <FaLinkedin />, shareUrl: `https://www.linkedin.com/shareArticle?url=${url}&title=${title}` },
    { name: 'Instagram', icon: <FaInstagram />, shareUrl: `https://www.instagram.com/?url=${url}` },
    { name: 'WhatsApp', icon: <FaWhatsapp />, shareUrl: `https://api.whatsapp.com/send?text=${title} ${url}` },
    { name: 'Pinterest', icon: <FaPinterest />, shareUrl: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}` }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '5px' }}>
      <Typography variant="subtitle1" style={{ marginBottom: '5px' }}>
        Compartilhe:
      </Typography>
      <div style={{ display: 'flex', gap: '10px' }}>
        {socialNetworks.map((network) => (
          <a key={network.name} href={network.shareUrl} target="_blank" rel="noopener noreferrer" title={`Compartilhar no ${network.name}`}>
            {network.icon}
          </a>
        ))}
      </div>
      <Typography variant="subtitle2" style={{ marginTop: '10px' }}>
        Ajude-nos!
      </Typography>
    </div>
  );
};

export default React.memo(SocialShareBar);
