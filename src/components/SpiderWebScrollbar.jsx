import React, { useState, useEffect, useRef, useCallback } from 'react';

const SECTIONS = [
  { id: 'hero', label: 'HERO', icon: '🕷️' },
  { id: 'work', label: 'WORK', icon: '💼' },
  { id: 'about', label: 'ABOUT', icon: '⚡' },
  { id: 'experience', label: 'EXP', icon: '🏢' },
  { id: 'contact', label: 'CONTACT', icon: '📡' }
];

export default function SpiderWebScrollbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('HERO');
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const trackRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Compute active section and progress
  const updateScroll = useCallback(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;

    const progress = Math.min(1, Math.max(0, window.scrollY / total));
    setScrollProgress(progress);

    // Detect section in view
    const sy = window.scrollY + window.innerHeight * 0.35;
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTIONS[i].id);
      if (el) {
        const top = el.offsetTop;
        if (sy >= top - 100) {
          setActiveSection(SECTIONS[i].label);
          break;
        }
      }
    }

    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 450);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    updateScroll();
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [updateScroll]);

  // Scrubbing / Dragging
  const handleScrollToFraction = useCallback((fraction) => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = fraction * total;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }, []);

  const handleTrackClick = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const fraction = Math.min(1, Math.max(0, clickY / rect.height));
    handleScrollToFraction(fraction);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    const onPointerMove = (moveEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const curY = moveEvent.clientY - rect.top;
      const fraction = Math.min(1, Math.max(0, curY / rect.height));
      const total = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: fraction * total,
        behavior: 'auto'
      });
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Section quick jump
  const scrollToSection = (id, e) => {
    e.stopPropagation();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const percentText = Math.round(scrollProgress * 100);

  return (
    <aside
      className="spider-web-scroll-rail"
      aria-label="Spider-Man Web Navigation Rail"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Silk Anchor Node */}
      <div className="web-rail-anchor top" title="Top of Page" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <circle cx="12" cy="12" r="5" stroke="#0066ff" strokeWidth="1.5" />
          <path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="#0066ff" strokeWidth="1.2" opacity="0.6" />
          <circle cx="12" cy="12" r="2" fill="#ef4151" />
        </svg>
      </div>

      {/* Vertical Interactive Silk Track */}
      <div
        ref={trackRef}
        className={`web-rail-track ${isScrolling ? 'scrolling' : ''} ${isHovered || isDragging ? 'active' : ''}`}
        onClick={handleTrackClick}
      >
        {/* Background Passive Guide Filament */}
        <div className="web-filament-guide" />

        {/* Taut Active Laser Silk Line (stretches from top down to spider thumb) */}
        <div
          className="web-active-silk"
          style={{ height: `${scrollProgress * 100}%` }}
        />

        {/* Section Milestones Nodes */}
        {SECTIONS.map((sec, idx) => {
          const fraction = idx / (SECTIONS.length - 1);
          const topPercent = fraction * 100;
          const isPassed = scrollProgress >= fraction - 0.04;
          return (
            <div
              key={sec.id}
              className={`web-milestone-node ${isPassed ? 'passed' : ''}`}
              style={{ top: `${topPercent}%` }}
              onClick={(e) => scrollToSection(sec.id, e)}
              title={`Jump to ${sec.label}`}
            >
              <div className="milestone-ring" />
              <div className="milestone-core" />
              <span className="milestone-tag">{sec.label}</span>
            </div>
          );
        })}

        {/* The Spider-Man Web Silk Thumb / Glider */}
        <div
          className={`web-spider-thumb ${isDragging ? 'dragging' : ''}`}
          style={{ top: `${scrollProgress * 100}%` }}
          onPointerDown={handlePointerDown}
        >
          {/* Glowing Silk Tension Filament Tail */}
          <div className="thumb-silk-tail" />

          {/* Spider-Man Arachnid Micro-Rig */}
          <div className="spider-emblem-badge">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none" className="spider-svg">
              <defs>
                <linearGradient id="spiderSpidermanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4151" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
                <filter id="spiderGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ef4151" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* 8 Biomimetic Cyber Spider Legs */}
              <g stroke="url(#spiderSpidermanGrad)" strokeWidth="1.3" strokeLinecap="round">
                {/* Left Legs */}
                <path d="M12 11 L7 8 L4 12" />
                <path d="M11 14 L5 13 L3 17" />
                <path d="M11 17 L5 19 L4 23" />
                <path d="M12 20 L8 24 L6 27" />

                {/* Right Legs */}
                <path d="M20 11 L25 8 L28 12" />
                <path d="M21 14 L27 13 L29 17" />
                <path d="M21 17 L27 19 L28 23" />
                <path d="M20 20 L24 24 L26 27" />
              </g>

              {/* Spider Body Chassis (Split Red / Blue Dual Aesthetic) */}
              {/* Cephalothorax */}
              <ellipse cx="16" cy="11.5" rx="3.5" ry="3.0" fill="#ef4151" filter="url(#spiderGlow)" />
              {/* Abdomen */}
              <ellipse cx="16" cy="18.5" rx="4.5" ry="5.5" fill="#0066ff" />

              {/* Spider-Man Angular Mask Eyes */}
              <polygon points="14.2,10.2 15.6,12.0 14.5,12.5" fill="#ffffff" />
              <polygon points="17.8,10.2 16.4,12.0 17.5,12.5" fill="#ffffff" />

              {/* Spinneret Glow Point */}
              <circle cx="16" cy="23.5" r="1.0" fill="#00f0ff" />
            </svg>
          </div>

          {/* Sci-Fi HUD Tooltip (Reveals percentage & active section) */}
          <div className={`web-thumb-hud ${isHovered || isDragging || isScrolling ? 'visible' : ''}`}>
            <span className="hud-icon">🕷️</span>
            <span className="hud-pct">{percentText}%</span>
            <span className="hud-sep">//</span>
            <span className="hud-sec">{activeSection}</span>
          </div>
        </div>
      </div>

      {/* Bottom Silk Anchor Node */}
      <div
        className="web-rail-anchor bottom"
        title="Scroll to Contact"
        onClick={() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <circle cx="12" cy="12" r="5" stroke="#ef4151" strokeWidth="1.5" />
          <path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="#ef4151" strokeWidth="1.2" opacity="0.6" />
          <circle cx="12" cy="12" r="2" fill="#0066ff" />
        </svg>
      </div>
    </aside>
  );
}

