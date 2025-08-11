import React from 'react';

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: { fontSize: '18px', padding: '8px 12px' },
    medium: { fontSize: '24px', padding: '12px 16px' },
    large: { fontSize: '32px', padding: '16px 20px' }
  };

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: '700',
      color: '#e0e0e0',
      background: 'rgba(20, 20, 40, 0.3)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: sizes[size].padding,
      fontSize: sizes[size].fontSize,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      letterSpacing: '-0.02em'
    }}>
      Vayonomics
    </div>
  );
};

export default Logo;