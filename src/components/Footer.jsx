import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/site';
import { ArrowUp, Clock } from 'lucide-react';

export default function Footer() {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeZone = siteConfig.identity.timezone || 'UTC';
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setLocalTime(formatted);
      } catch (e) {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      {/* Footer Left */}
      <div className="footer-left">
        <a href="#hero" className="wordmark">
          {siteConfig.identity.wordmark}
          <span>{siteConfig.identity.wordmarkDot}</span>
        </a>

        <div className="live-clock-badge" title="Local Time for Collaboration">
          <span className="live-clock-dot" aria-hidden="true" />
          <Clock size={12} className="muted" />
          <span>{localTime || 'LIVE TIME'}</span>
          <span className="muted" style={{ fontSize: '10px' }}>({siteConfig.identity.location.split(',')[0]})</span>
        </div>

        <p className="footer-copy">
          © {currentYear} {siteConfig.identity.fullName}. All rights reserved.
        </p>
      </div>

      {/* Footer Right */}
      <div>
        <button
          type="button"
          onClick={scrollToTop}
          className="back-to-top-btn"
          aria-label="Back to top of page"
        >
          <span>Return To Top</span>
          <ArrowUp size={13} />
        </button>
      </div>
    </footer>
  );
}

