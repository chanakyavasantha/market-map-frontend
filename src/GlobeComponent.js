import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import Navbar from './Navbar';

const GlobeComponent = () => {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);
  const [indices, setIndices] = useState([]);

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

  useEffect(() => {
    // Fetch indices status from backend
    const fetchIndices = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/indices/status');
        const json = await res.json();
        const points = (json.data || []).map((d) => ({
          lat: d.lat,
          lng: d.lng,
          name: d.name,
          symbol: d.symbol,
          exchange: d.exchange,
          city: d.city,
          country: d.country,
          current_price: d.current_price,
          change_percent: d.change_percent,
          last_updated: d.last_updated
        }));
        setIndices(points);
      } catch (e) {
        console.error('Failed to fetch indices', e);
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const colorFromChange = (cp) => {
    if (cp === null || cp === undefined) return '#9aa0a6'; // neutral grey
    const min = -4, max = 4;
    const v = Math.max(min, Math.min(max, cp));
    const mag = Math.min(Math.abs(v) / max, 1); // 0..1

    // Clean two-tone palette without yellow
    const negBase = [255, 102, 102]; // light red
    const negStrong = [255, 45, 85]; // bright red
    const posBase = [102, 255, 178]; // light green
    const posStrong = [48, 209, 88]; // bright green

    const lerp = (a, b, t) => Math.round(a + (b - a) * t);

    if (v < -0.1) {
      const c = negBase.map((c, i) => lerp(c, negStrong[i], mag));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    } else if (v > 0.1) {
      const c = posBase.map((c, i) => lerp(c, posStrong[i], mag));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
    return '#9aa0a6'; // near-neutral
  };

  // Tighter size range for a cleaner look
  const radiusFromChange = (cp) => {
    if (cp === null || cp === undefined) return 0.42;
    const magnitude = Math.min(Math.abs(cp), 5);
    return 0.42 + magnitude * 0.06; // 0.42..0.72
  };

  // Lighten the base color and add transparency so rings remain visible over varied land textures
  const ringColorFromChange = (cp) => {
    const base = colorFromChange(cp);
    const toRGBA = (rgbStr, lighten = 0.7, alpha = 0.35) => {
      const m = /rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/.exec(rgbStr);
      if (!m) return `rgba(255,255,255,${alpha})`;
      let r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10);
      r = Math.round(r + (255 - r) * lighten);
      g = Math.round(g + (255 - g) * lighten);
      b = Math.round(b + (255 - b) * lighten);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    return toRGBA(base, 0.75, 0.4);
  };

  const handleMouseEnter = () => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = false;
    }
  };

  const handleMouseLeave = () => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  };

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
          background: 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(2px)',
          zIndex: 0,
          pointerEvents: 'none' // ensure overlay doesn't block globe interactions
        }} />
        
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
            pointsData={indices}
            pointAltitude={0.025}
            pointColor={(d) => colorFromChange(d.change_percent)}
            pointRadius={(d) => radiusFromChange(d.change_percent)}
            pointResolution={6}
            pointsMerge={false}
            pointLabel={d => `
              <div style="
                font-size: 13px; 
                background: rgba(255, 255, 255, 0.08);
                color: #f5f6f7; 
                padding: 10px 12px; 
                border-radius: 12px; 
                border: 1px solid rgba(255, 255, 255, 0.14);
                box-shadow: 0 8px 32px rgba(0,0,0,0.25);
                backdrop-filter: blur(12px) saturate(120%);
                -webkit-backdrop-filter: blur(12px) saturate(120%);
                background-clip: padding-box;
              ">
                <div style="font-weight: 600; margin-bottom: 6px; color: ${colorFromChange(d.change_percent)};">
                  ${d.name} (${d.symbol})
                </div>
                <div style="opacity: 0.9; margin-bottom: 4px;">📍 ${d.city}, ${d.country}</div>
                <div style="opacity: 0.9; margin-bottom: 4px;">💰 ${d.current_price !== null && d.current_price !== undefined ? '$' + Number(d.current_price).toFixed(2) : '—'}</div>
                <div style="font-weight: 500; color: ${colorFromChange(d.change_percent)};">
                  📈 ${d.change_percent !== null && d.change_percent !== undefined ? (d.change_percent > 0 ? '+' : '') + Number(d.change_percent).toFixed(2) + '%' : '—'}
                </div>
                <div style="opacity: 0.7; font-size: 11px; margin-top: 6px;">
                  🕒 ${d.last_updated ? new Date(d.last_updated).toLocaleString() : 'No data'}
                </div>
              </div>
            `}

            // Wave-like ring effects around points (subtle)
            ringsData={indices}
            ringColor={(d) => ringColorFromChange(d.change_percent)}
            ringMaxRadius={(d) => 1.6 + Math.min(Math.abs(d.change_percent || 0), 5) * 0.4}
            ringPropagationSpeed={0.55}
            ringRepeatPeriod={1700}
            
            // Animation and interaction
            animateIn={true}
            waitForGlobeReady={true}
            
            // Styling
            width={window.innerWidth - 280}
            height={window.innerHeight}
          />
        </div>
        
        {/* News Card */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px) saturate(130%)',
          WebkitBackdropFilter: 'blur(20px) saturate(130%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#f0f0f0',
          padding: '20px',
          borderRadius: '16px',
          width: '280px',
          height: '360px',
          fontSize: '13px',
          zIndex: 1001,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '17px', 
            fontWeight: '600',
            color: '#ffffff'
          }}>📰 Financial News</h3>
          
          {/* News Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '6px' }}>2 hours ago</div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Fed Signals Rate Cut Amid Global Market Volatility
              </div>
              <div style={{ fontSize: '12px', color: '#d0d0d0', lineHeight: '1.5' }}>
                Federal Reserve hints at potential interest rate adjustments as markets show increased volatility...
              </div>
            </div>
            
            <div style={{
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '6px' }}>4 hours ago</div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Asian Markets Rally on Tech Sector Gains
              </div>
              <div style={{ fontSize: '12px', color: '#d0d0d0', lineHeight: '1.5' }}>
                Tokyo and Hong Kong exchanges see significant gains driven by semiconductor stocks...
              </div>
            </div>
            
            <div style={{
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '6px' }}>6 hours ago</div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Oil Prices Surge on Supply Chain Concerns
              </div>
              <div style={{ fontSize: '12px', color: '#d0d0d0', lineHeight: '1.5' }}>
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
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px) saturate(130%)',
          WebkitBackdropFilter: 'blur(20px) saturate(130%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#f0f0f0',
          padding: '20px',
          borderRadius: '16px',
          width: '260px',
          fontSize: '13px',
          zIndex: 1001,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          <h3 style={{ 
            margin: '0 0 18px 0', 
            fontSize: '17px', 
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