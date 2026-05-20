import React, { useState } from 'react';
import { Partner } from '../types';

interface SafePartnerImageProps {
  partner: Partner;
  imageUrl?: string;
  className?: string;
  alt?: string;
}

const categoryFallbacks: Record<string, string> = {
  cafeteria: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
  empório: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&q=80',
  restaurante: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
  padaria: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
  posto: 'https://images.unsplash.com/photo-1545642412-1c60eb4d35c4?auto=format&fit=crop&q=80',
  'rota cofcof': 'https://images.unsplash.com/photo-1545642412-1c60eb4d35c4?auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80'
};

export const SafePartnerImage: React.FC<SafePartnerImageProps> = ({ 
  partner, 
  imageUrl,
  className = "w-full h-full object-cover", 
  alt 
}) => {
  const [error, setError] = useState(false);
  
  const getFallback = () => {
    const cat = (partner.category || '').toLowerCase();
    return categoryFallbacks[cat] || categoryFallbacks.default;
  };
  
  const targetImage = imageUrl || partner.coverImage;
  const source = (!error && targetImage && !targetImage.includes('source.unsplash')) 
    ? targetImage 
    : getFallback();

  return (
    <img
      src={source}
      alt={alt || partner.publicName || 'Parceiro CofCof'}
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
