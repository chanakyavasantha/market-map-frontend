import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import Navbar from './Navbar';

const GlobeComponent = () => {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Load country data for visualization
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data.features);
      });

    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Sample data for points
  const sampleData = [
    { lat: 40.7128, lng: -74.0060, name: 'New York', population: 8000000 },
    { lat: 51.5074, lng: -0.1278, name: 'London', population: 9000000 },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo', population: 14000000 },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney', population: 5000000 },
    { lat: 55.7558, lng: 37.6176, name: 'Moscow', population: 12000000 },
    { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro', population: 6000000 },
  ];

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Navbar */}
      <Navbar />
      
      {/* Main content area with margin for sidebar */}
      <div style={{
        marginLeft: '280px',
        width: 'calc(100vw - 280px)',
        height: '100vh',
        position: 'relative'
      }}>
        {/* Glassy overlay effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          zIndex: 0
        }} />
        
        <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        
        // Countries polygons
        polygonsData={countries}
        polygonAltitude={0.01}
        polygonCapColor={() => '#1f2937'} //charcoal grey for landbodies
        polygonSideColor={() => 'rgba(207, 120, 20, 0.31)'}
        polygonStrokeColor={() => 'rgba(92, 62, 28, 0.15)'}
        polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b><br />
          Population: <i>${d.POP_EST}</i>
        `}
        
        // Points layer
        pointsData={sampleData}
        pointAltitude={0.02}
        pointColor={() => '#ffff00'}
        pointRadius={0.5}
        pointLabel={d => `
          <b>${d.name}</b><br />
          Population: ${d.population.toLocaleString()}
        `}
        
        // Animation and interaction
        animateIn={true}
        waitForGlobeReady={true}
        
        // Styling
        width={window.innerWidth - 280}
        height={window.innerHeight}
      />
        
        {/* News Card */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(20, 20, 40, 0.3)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#e0e0e0',
          padding: '16px',
          borderRadius: '12px',
          width: '260px',
          height: '350px',
          fontSize: '13px',
          zIndex: 1001,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#ffffff'
          }}>📰 Financial News</h3>
          
          {/* News Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '4px' }}>2 hours ago</div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Fed Signals Rate Cut Amid Global Market Volatility
              </div>
              <div style={{ fontSize: '12px', color: '#c0c0c0', lineHeight: '1.4' }}>
                Federal Reserve hints at potential interest rate adjustments as markets show increased volatility...
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '4px' }}>4 hours ago</div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Asian Markets Rally on Tech Sector Gains
              </div>
              <div style={{ fontSize: '12px', color: '#c0c0c0', lineHeight: '1.4' }}>
                Tokyo and Hong Kong exchanges see significant gains driven by semiconductor stocks...
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '4px' }}>6 hours ago</div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Oil Prices Surge on Supply Chain Concerns
              </div>
              <div style={{ fontSize: '12px', color: '#c0c0c0', lineHeight: '1.4' }}>
                Crude oil futures jump 3% as geopolitical tensions affect major shipping routes...
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(20, 20, 40, 0.3)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#e0e0e0',
          padding: '16px',
          borderRadius: '12px',
          width: '240px',
          fontSize: '13px',
          zIndex: 1001,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#ffffff'
          }}>🔍 Filters</h3>
          
          {/* View Toggle */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px', display: 'block' }}>
              View Toggle
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#e0e0e0',
                fontSize: '12px',
                cursor: 'pointer'
              }}>🌐</button>
              <button style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#a0a0a0',
                fontSize: '12px',
                cursor: 'pointer'
              }}>📊</button>
              <button style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#a0a0a0',
                fontSize: '12px',
                cursor: 'pointer'
              }}>✓</button>
            </div>
          </div>

          {/* Zoom Levels */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px', display: 'block' }}>
              Zoom Levels
            </label>
            <select style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(40, 40, 60, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#e0e0e0',
              fontSize: '13px'
            }}>
              <option>Global</option>
              <option>Regional</option>
              <option>City</option>
            </select>
          </div>

          {/* Data Sources */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px', display: 'block' }}>
              Data Sources
            </label>
            <select style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(40, 40, 60, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#e0e0e0',
              fontSize: '13px'
            }}>
              <option>Market Performance</option>
              <option>Live News</option>
              <option>Social Sentiment</option>
            </select>
          </div>

          {/* Sector Focus */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px', display: 'block' }}>
              Sector Focus
            </label>
            <select style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(40, 40, 60, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#e0e0e0',
              fontSize: '13px'
            }}>
              <option>All Sectors</option>
              <option>Technology</option>
              <option>Finance</option>
              <option>Energy</option>
            </select>
          </div>

          {/* Time Ranges */}
          <div>
            <label style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px', display: 'block' }}>
              Time Ranges
            </label>
            <select style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#e0e0e0',
              fontSize: '12px'
            }}>
              <option>Live</option>
              <option>1H</option>
              <option>6H</option>
              <option>1D</option>
              <option>1W</option>
              <option>1M</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeComponent;