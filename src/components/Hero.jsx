import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../config/site';
import { ArrowDown, ArrowUpRight, MapPin, Sparkles, FileText } from 'lucide-react';
import CyberSpider3D from './CyberSpider3D';

export default function Hero() {
  const { identity, metrics, preferences } = siteConfig;
  const [visualMode, setVisualMode] = useState('portrait');

  // Synchronize visual mode with Swarm Rebuild lifecycle events
  useEffect(() => {
    const handleSetPortrait = () => setVisualMode('portrait');
    const handleSetSpider = () => setVisualMode('spider');

    window.addEventListener('hero-set-portrait', handleSetPortrait);
    window.addEventListener('hero-set-spider', handleSetSpider);

    return () => {
      window.removeEventListener('hero-set-portrait', handleSetPortrait);
      window.removeEventListener('hero-set-spider', handleSetSpider);
    };
  }, []);

  // Extract initials for fallback graphic
  const initials = identity.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <section id="hero" className="hero" aria-label="Introduction & Hero">
      {/* Top Status Bar */}
      <div className="hero-top">
        <div className="hero-profession">
          <Sparkles size={14} className="accent" aria-hidden="true" />
          <span>{identity.profession}</span>
        </div>

        {identity.availability && (
          <div className="availability-badge" role="status">
            <span className="pulse-dot" aria-hidden="true" />
            <span>{identity.availability.badgeText}</span>
          </div>
        )}
      </div>

      {/* Monumental Background Display Typography (Infinite Marquee) */}
      <div className="hero-backdrop-title" aria-hidden="true">
        <div className="hero-backdrop-track">
          <div className="hero-backdrop-group">
            <span>{identity.displayName}</span>
            <span className="hero-backdrop-sep">✦</span>
            <span>{identity.displayName}</span>
            <span className="hero-backdrop-sep">✦</span>
            <span>{identity.displayName}</span>
            <span className="hero-backdrop-sep">✦</span>
            <span>{identity.displayName}</span>
            <span className="hero-backdrop-sep">✦</span>
          </div>
          <div className="hero-backdrop-group" aria-hidden="true">
            <span>{identity.displayName}</span>
            <span className="hero-backdrop-sep">✦</span>
            <span>{identity.displayName}</span>
            <span className="hero-backdrop-sep">✦</span>
            <span>{identity.displayName}</span>
            <span className="hero-backdrop-sep">✦</span>
            <span>{identity.displayName}</span>
            <span className="hero-backdrop-sep">✦</span>
          </div>
        </div>
      </div>

      {/* Hero Center Grid */}
      <div className="hero-body">
        {/* Intro Text */}
        <div className="hero-intro">
          <p className="handwriting hero-handwriting">
            {identity.heroGreeting}
          </p>

          <h1 className="hero-headline">
            {identity.headline}
          </h1>

          <p className="hero-role-line">
            {identity.roleLine2}
          </p>

          <p className="hero-description">
            {identity.intro}
          </p>

          <div className="hero-actions">
            <a href="#work" className="btn-primary">
              <span>Explore Work</span>
              <ArrowDown size={15} aria-hidden="true" />
            </a>

            <a href="#contact" className="btn-secondary">
              <span>Get In Touch</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>

            {preferences.showDownloadResume && identity.resumeUrl && (
              <a 
                href={identity.resumeUrl} 
                className="btn-secondary"
                target={identity.resumeUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
              >
                <FileText size={15} aria-hidden="true" />
                <span>Resume</span>
              </a>
            )}
          </div>

          <div className="hero-location-pill">
            <MapPin size={13} className="accent" aria-hidden="true" />
            <span>{identity.location}</span>
          </div>
        </div>

        {/* Hero Visual Frame (Portrait & 3D Cyber Spider MK-IX) */}
        <div className="hero-visual">
          {/* Visual Mode Switcher Pill */}
          <div className="hero-visual-toggle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setVisualMode('spider')}
              className={`view-pill-btn ${visualMode === 'spider' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.04em',
                background: visualMode === 'spider' ? 'rgba(0, 102, 255, 0.28)' : 'rgba(255, 255, 255, 0.05)',
                border: visualMode === 'spider' ? '1px solid #0066ff' : '1px solid rgba(255, 255, 255, 0.14)',
                color: visualMode === 'spider' ? '#fff' : '#a1a1aa',
                boxShadow: visualMode === 'spider' ? '0 0 16px rgba(0, 102, 255, 0.45)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: visualMode === 'spider' ? '#0066ff' : '#71717a' }} />
              <span>🕷️ 3D ARACHNID MK-IX</span>
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('portrait')}
              className={`view-pill-btn ${visualMode === 'portrait' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.04em',
                background: visualMode === 'portrait' ? 'rgba(239, 65, 81, 0.28)' : 'rgba(255, 255, 255, 0.05)',
                border: visualMode === 'portrait' ? '1px solid #ef4151' : '1px solid rgba(255, 255, 255, 0.14)',
                color: visualMode === 'portrait' ? '#fff' : '#a1a1aa',
                boxShadow: visualMode === 'portrait' ? '0 0 16px rgba(239, 65, 81, 0.45)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: visualMode === 'portrait' ? '#ef4151' : '#71717a' }} />
              <span>📷 PORTRAIT</span>
            </button>
          </div>

          <div className="portrait-frame">
            {/* Pure Crystal Glass Specular Glare & Reflection */}
            <div className="tv-glass-glare" aria-hidden="true" />

            {/* Frosted Glass Floating HUD Status (Visible in Portrait Mode) */}
            {visualMode === 'portrait' && (
              <div className="tv-glass-hud" aria-hidden="true">
                <span className="tv-status-badge">
                  <span className="tv-dot" />
                  TRANSPARENT OLED // 120Hz
                </span>
                <span className="tv-tech-spec">TRANSMITTANCE 88%</span>
              </div>
            )}

            {visualMode === 'spider' ? (
              <CyberSpider3D height="100%" />
            ) : identity.portrait ? (
              <img
                src={identity.portrait}
                alt={identity.fullName}
                className="portrait-img"
                loading="eager"
              />
            ) : (
              <div className="portrait-placeholder" aria-label="Abstract Monogram Art">
                <div className="placeholder-grid" aria-hidden="true" />
                <div className="placeholder-initials">{initials}</div>
                <div className="placeholder-tag">DESIGN ARCHITECTURE</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Bottom Strip / Metrics */}
      {preferences.showMetrics && metrics && metrics.length > 0 && (
        <div className="hero-bottom">
          {metrics.map((stat, index) => (
            <div key={index} className="hero-stat-card">
              <div className="stat-value">
                {stat.value.replace(/(\D+)$/, '')}
                <span>{stat.value.match(/(\D+)$/)?.[0] || ''}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-desc">{stat.description}</div>
            </div>
          ))}

          <a href="#work" className="hero-scroll-cue" aria-label="Scroll down to work">
            <span>Scroll</span>
            <ArrowDown size={12} className="accent" />
          </a>
        </div>
      )}
    </section>
  );
}

