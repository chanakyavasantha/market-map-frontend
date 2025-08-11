import React from 'react';
import Logo from './Logo';

const Navbar = () => {
  const [activeTab, setActiveTab] = React.useState('Market Map');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    console.log(`Clicked on ${tabName}`);
  };

  const getTabStyle = (tabName, isActive) => ({
    color: isActive ? '#e0e0e0' : '#a0a0a0',
    fontSize: '14px',
    fontWeight: isActive ? '500' : '400',
    padding: '12px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
    background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#e0e0e0'
    }
  });

  return (
    <nav style={{
      position: 'fixed',
      top: '0',
      left: '0',
      bottom: '0',
      width: '280px',
      background: 'rgba(20, 20, 40, 0.3)',
      backdropFilter: 'blur(20px)',
      border: 'none',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      zIndex: 1000,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '40px' }}>
        <Logo size="medium" />
      </div>
      
      {/* Navigation Items */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div 
          style={getTabStyle('Market Map', activeTab === 'Market Map')}
          onClick={() => handleTabClick('Market Map')}
          onMouseEnter={(e) => {
            if (activeTab !== 'Market Map') {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'Market Map') {
              e.target.style.background = 'transparent';
              e.target.style.color = '#a0a0a0';
            }
          }}
        >
          🌍 Market Map
        </div>
        
        <div 
          style={getTabStyle('Dhana', activeTab === 'Dhana')}
          onClick={() => handleTabClick('Dhana')}
          onMouseEnter={(e) => {
            if (activeTab !== 'Dhana') {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'Dhana') {
              e.target.style.background = 'transparent';
              e.target.style.color = '#a0a0a0';
            }
          }}
        >
          💰 Dhana
        </div>
        
        <div 
          style={getTabStyle('Analytics', activeTab === 'Analytics')}
          onClick={() => handleTabClick('Analytics')}
          onMouseEnter={(e) => {
            if (activeTab !== 'Analytics') {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'Analytics') {
              e.target.style.background = 'transparent';
              e.target.style.color = '#a0a0a0';
            }
          }}
        >
          📊 Analytics
        </div>
        
        <div 
          style={getTabStyle('Settings', activeTab === 'Settings')}
          onClick={() => handleTabClick('Settings')}
          onMouseEnter={(e) => {
            if (activeTab !== 'Settings') {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'Settings') {
              e.target.style.background = 'transparent';
              e.target.style.color = '#a0a0a0';
            }
          }}
        >
          ⚙️ Settings
        </div>
      </div>
    </nav>
  );
};

export default Navbar;