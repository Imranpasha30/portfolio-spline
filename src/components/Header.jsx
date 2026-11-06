import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/site';
import { Menu, X, ArrowUpRight, Zap, ZapOff } from 'lucide-react';

export default function Header({ motionEnabled, toggleMotion, onTriggerRebuild }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'work', 'about', 'experience', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header className="site-header" role="banner">
      {/* Brand Wordmark */}
      <a href="#hero" className="wordmark" aria-label={`${siteConfig.identity.displayName} home`} style={{ display: 'inline-flex', alignItems: 'center' }}>
        {siteConfig.identity.avatar && (
          <img
            src={siteConfig.identity.avatar}
            alt=""
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: '10px',
              border: '1.5px solid var(--red)',
            }}
          />
        )}
        <span>{siteConfig.identity.wordmark}</span>
        <span>{siteConfig.identity.wordmarkDot}</span>
      </a>

      {/* Desktop Navigation */}
      <nav className="desktop-nav" aria-label="Main Navigation">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={activeSection === link.id ? 'active' : ''}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Swarm Rebuild Button */}
        <button
          type="button"
          onClick={onTriggerRebuild}
          className="header-swarm-btn"
          title="Trigger Swarm Rebuild Animation (Shortcut: S or Alt+Shift+S)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            color: 'var(--red)',
            background: 'rgba(239, 65, 81, 0.08)',
            border: '1px solid rgba(239, 65, 81, 0.3)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', animation: 'pulseAnimation 2s infinite' }} />
          <span>REBUILD</span>
        </button>

        {/* 3D Cyber Spider Lab Link */}
        <a
          href="/spider-3d.html"
          target="_blank"
          rel="noopener noreferrer"
          className="header-spider-btn"
          title="Open Full 3D Cyber Spider Simulation Lab (MK-IX Arachnid)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            color: '#e2e8f0',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 11px',
            borderRadius: 'var(--radius-full)',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: '11px' }}>🕷️</span>
          <span>3D SPIDER</span>
        </a>

        {/* Motion On / Off Toggle */}
        <button
          type="button"
          onClick={toggleMotion}
          className={`motion-toggle ${!motionEnabled ? 'off' : ''}`}
          title={motionEnabled ? 'Disable animations (prefers-reduced-motion)' : 'Enable animations'}
          aria-label={motionEnabled ? 'Disable animation motion' : 'Enable animation motion'}
        >
          <span className="motion-dot" aria-hidden="true" />
          <span>{motionEnabled ? 'MOTION ON' : 'MOTION OFF'}</span>
        </button>

        {/* Let's Talk CTA button */}
        <a href="#contact" className="header-contact-btn">
          <span>Let's Talk</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={activeSection === link.id ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div className="mobile-drawer-footer">
            <button
              type="button"
              onClick={toggleMotion}
              className={`motion-toggle ${!motionEnabled ? 'off' : ''}`}
              style={{ width: 'fit-content' }}
            >
              <span className="motion-dot" aria-hidden="true" />
              <span>{motionEnabled ? 'MOTION ACTIVE' : 'MOTION DISABLED'}</span>
            </button>
            <p className="muted" style={{ fontSize: '13px' }}>
              {siteConfig.identity.location}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

