import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import About from './components/About';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SpiderWebScrollbar from './components/SpiderWebScrollbar';
import { siteConfig } from './config/site';
import { triggerSwarmRebuild } from './swarm-rebuild';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(true);

  // Initialize and track motion toggle
  useEffect(() => {
    const savedMotion = localStorage.getItem('portfolio_motion_active');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initialMotion = savedMotion !== null ? savedMotion === 'true' : !prefersReduced;
    setMotionEnabled(initialMotion);
    document.documentElement.setAttribute('data-motion', initialMotion ? 'on' : 'off');
  }, []);

  const toggleMotion = () => {
    const nextMotion = !motionEnabled;
    setMotionEnabled(nextMotion);
    localStorage.setItem('portfolio_motion_active', String(nextMotion));
    document.documentElement.setAttribute('data-motion', nextMotion ? 'on' : 'off');
  };

  // Automatically start Swarm Rebuild animation when the page loads
  useEffect(() => {
    if (siteConfig.preferences.autoStartSwarmRebuild) {
      const launch = () => {
        // Small delay ensures Google Fonts, layout, and images are fully computed for DOM blueprint scanning
        setTimeout(() => {
          triggerSwarmRebuild();
        }, 500);
      };

      if (document.readyState === 'complete') {
        launch();
      } else {
        window.addEventListener('load', launch, { once: true });
        return () => window.removeEventListener('load', launch);
      }
    }
  }, []);

  // Scroll reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener: Press 'S' or Alt+Shift+S anytime to run the Swarm Rebuild again
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.altKey && e.shiftKey && (e.key === 'S' || e.key === 's')) ||
        (e.key === 's' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.ctrlKey && !e.metaKey)
      ) {
        e.preventDefault();
        triggerSwarmRebuild();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className="reading-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      {/* Spider-Man Web Navigation Scroll Rail */}
      <SpiderWebScrollbar />

      {/* Persistent Navigation Header with Rebuild trigger */}
      <Header
        motionEnabled={motionEnabled}
        toggleMotion={toggleMotion}
        onTriggerRebuild={triggerSwarmRebuild}
      />

      {/* Main Content Landmark */}
      <main id="main-content">
        <Hero />
        <ProjectGrid />
        <About />
        <Experience />
        <Testimonials />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating In-Page Swarm Rebuild Button (Replay anytime) */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 80,
        }}
      >
        <button
          type="button"
          onClick={triggerSwarmRebuild}
          title="Replay Swarm Rebuild Animation (Press 'S' or Alt+Shift+S)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            background: 'radial-gradient(135% 150% at 50% -20%, rgba(255, 255, 255, 0.16) 0%, rgba(32, 20, 24, 0.55) 45%, rgba(10, 10, 14, 0.86) 100%)',
            backdropFilter: 'blur(28px) saturate(210%) contrast(105%)',
            WebkitBackdropFilter: 'blur(28px) saturate(210%) contrast(105%)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            boxShadow: '0 20px 44px -8px rgba(0, 0, 0, 0.75), 0 0 30px -4px rgba(239, 65, 81, 0.28), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.42)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--red)' }} />
          <span>REPLAY SWARM</span>
          <kbd
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              padding: '2px 7px',
              borderRadius: '999px',
              fontSize: '10px',
              fontFamily: 'monospace',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            S
          </kbd>
        </button>
      </div>
    </>
  );
}
