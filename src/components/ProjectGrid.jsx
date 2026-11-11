import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { projects } from '../data/projects';
import ProjectDialog from './ProjectDialog';
import { 
  ArrowUpRight, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Rich, highly detailed project card component matching Image 5:
 * Curated photography, glowing status beacon, engineering telemetry, and tech stack chips.
 */
function ProjectCardContent({ project }) {
  const accent = project.accentColor || '#ef4151';
  const primaryMetric = project.metrics?.[0] || { label: 'STATUS', value: 'VERIFIED' };
  const secondaryMetric = project.metrics?.[1];

  const getCleanTitle = (proj) => {
    if (proj.id === 'llm-redteam') return 'LLM Red-Teaming Matrix';
    if (proj.id === 'infoga-osint') return 'Infoga OSINT';
    if (proj.id === 'violence-detection-cv') return 'Real-Time AI Vision';
    return (proj.title || '')
      .split(/[\u2014\u2013\u2212\u2015]|â€”/)[0]
      .trim();
  };
  const cleanTitle = getCleanTitle(project);

  return (
    <div className="project-card-glass">
      {/* Background Cover Image with Cinematic Gradients */}
      <div className="card-bg-wrap">
        <img
          src={project.image}
          alt={cleanTitle}
          className="card-bg-photo"
          loading="eager"
        />
        <div className="card-bg-gradient" />
        <div 
          className="card-accent-glow" 
          style={{ background: `radial-gradient(circle at 85% 15%, ${accent}38 0%, transparent 65%)` }} 
        />
      </div>

      {/* Floating Header Badges */}
      <div className="card-top-bar">
        <span 
          className="card-status-pill"
          style={{ 
            borderColor: `${accent}55`,
            background: 'rgba(8, 11, 18, 0.88)',
            boxShadow: `0 0 14px ${accent}25`
          }}
        >
          <span 
            className="status-beacon-dot" 
            style={{ 
              backgroundColor: accent,
              boxShadow: `0 0 8px ${accent}` 
            }} 
          />
          <span className="status-badge-text">{project.badge || 'PRODUCTION'}</span>
        </span>

        <span className="card-category-tag">
          {project.categoryTag || project.category}
        </span>
      </div>

      {/* Center Key Engineering Metric HUD Callout */}
      <div className="card-metric-hud">
        <div 
          className="metric-hud-pill"
          style={{ borderColor: `${accent}45` }}
        >
          <span className="metric-primary-val" style={{ color: accent }}>
            {primaryMetric.value}
          </span>
          <span className="metric-primary-lbl">
            {primaryMetric.label}
          </span>
        </div>
        {secondaryMetric && (
          <div className="metric-hud-secondary">
            <span className="sec-val">{secondaryMetric.value}</span>
            <span className="sec-lbl">{secondaryMetric.label}</span>
          </div>
        )}
      </div>

      {/* Bottom Content & Meta Info */}
      <div className="card-bottom-info">
        <div className="card-title-group">
          <h3 className="card-title-text" title={project.title}>
            {cleanTitle}
          </h3>
          <p className="card-subtitle-text">
            {project.tagline || project.subtitle}
          </p>
        </div>

        {/* Tech Chips */}
        <div className="card-tags-row">
          {project.tools.slice(0, 3).map((tool, i) => (
            <span key={i} className="card-tech-badge">
              {tool}
            </span>
          ))}
          {project.tools.length > 3 && (
            <span className="card-tech-badge tech-more">
              +{project.tools.length - 3}
            </span>
          )}
        </div>

        {/* Action Row */}
        <div className="card-action-bar">
          <span className="inspect-label">
            <span>Inspect Architecture</span>
            <ArrowUpRight size={12} className="inspect-arrow-icon" style={{ color: accent }} />
          </span>
          <span className="case-study-badge">CASE STUDY</span>
        </div>
      </div>
    </div>
  );
}

// 8 Featured Production Projects
const DISPLAY_PROJECTS = projects.slice(0, 8);

export default function ProjectGrid() {
  const [activeProject, setActiveProject] = useState(null);

  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const solarCoreRef = useRef(null);
  const gridContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const masterScrollTriggerRef = useRef(null);

  // 3D Card Hover Tilt when assembled in grid
  const handleCardMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardEl, {
      rotateY: relX * 14,
      rotateX: -relY * 14,
      scale: 1.03,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleCardMouseLeave = (cardEl) => {
    if (!cardEl) return;
    gsap.to(cardEl, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const stage = stageRef.current;
      const gridContainer = gridContainerRef.current;
      if (!cards.length || !stage || !gridContainer) return;

      const N = cards.length;

      // Master Pinned ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'projectsMasterPin',
          trigger: wrapperRef.current,
          pin: stageRef.current,
          start: 'top top',
          end: () => `+=${Math.min(2600, Math.max(1800, window.innerHeight * 2.4))}`,
          scrub: 0.65,
          anticipatePin: 1
        }
      });

      masterScrollTriggerRef.current = tl.scrollTrigger;

      // Function to calculate offsets from each card's grid slot to stage center
      const setupAnimation = () => {
        const stageRect = stage.getBoundingClientRect();
        const stageCenterX = stageRect.left + stageRect.width / 2;
        const stageCenterY = stageRect.top + stageRect.height / 2;

        // Clear existing tweens if re-running
        tl.clear();

        // 1. Central Solar Core Glow Animation
        if (solarCoreRef.current) {
          tl.fromTo(
            solarCoreRef.current,
            { scale: 0.3, opacity: 0.3 },
            { scale: 1.4, opacity: 0.95, duration: 1.5, ease: 'sine.inOut' },
            0
          );
          // Scale back softly behind the grid as cards assemble
          tl.to(
            solarCoreRef.current,
            { scale: 1.0, opacity: 0.55, duration: 1.5, ease: 'power2.out' },
            2.2
          );
        }

        // 2. Cards Animation: Center Inception -> 3D Round -> Snap into 3-Column Grid
        cards.forEach((card, i) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const cardCenterY = cardRect.top + cardRect.height / 2;

          // Offset from grid slot to stage center
          const dx = Math.round(stageCenterX - cardCenterX);
          const dy = Math.round(stageCenterY - cardCenterY);

          // Parametric angles for the 3D "Round"
          const angle1 = (i / N) * Math.PI * 2 - 0.6;
          const x1 = dx + Math.round(360 * Math.cos(angle1));
          const y1 = dy + Math.round(160 * Math.sin(angle1));
          const rotY1 = Math.round(-Math.sin(angle1) * 32);
          const rotX1 = Math.round(Math.cos(angle1) * 14);

          const angle2 = angle1 + 1.35;
          const x2 = Math.round(dx * 0.3 + 460 * Math.sin(angle2));
          const y2 = Math.round(dy * 0.3 + 190 * Math.cos(angle2));
          const rotY2 = Math.round(-Math.sin(angle2) * 22);
          const rotX2 = Math.round(Math.cos(angle2) * 10);

          const startTime = i * 0.14;

          // Waypoint 0 (Start): Tiny cards emerging deep in the glowing red center
          gsap.set(card, {
            x: dx,
            y: dy,
            z: -850,
            scale: 0.12,
            opacity: 0,
            rotateY: 0,
            rotateX: 0,
            transformPerspective: 1200
          });

          // Phase 1 (0 -> 1.0s): Stream outward along the 3D loop ("come do a round")
          tl.to(
            card,
            {
              x: x1,
              y: y1,
              z: -380,
              scale: 0.46,
              opacity: 0.88,
              rotateY: rotY1,
              rotateX: rotX1,
              duration: 1.0,
              ease: 'power2.inOut'
            },
            startTime
          );

          // Phase 2 (1.0 -> 2.1s): Sweep around the foreground in a wide 3D arc
          tl.to(
            card,
            {
              x: x2,
              y: y2,
              z: 90,
              scale: 0.88,
              opacity: 1,
              rotateY: rotY2,
              rotateX: rotX2,
              duration: 1.1,
              ease: 'sine.inOut'
            },
            startTime + 0.95
          );

          // Phase 3 (2.1 -> 3.1s): Snap cleanly into final 3-Column Grid slot
          tl.to(
            card,
            {
              x: 0,
              y: 0,
              z: 0,
              scale: 1.0,
              opacity: 1,
              rotateY: 0,
              rotateX: 0,
              duration: 1.05,
              ease: 'back.out(1.15)'
            },
            startTime + 2.05
          );
        });

        // Hold the completed grid so visitors can inspect & click cards before unpinning
        tl.to({}, { duration: 1.2 }, 3.8);
      };

      // Initial build after mount
      setupAnimation();

      // Recalculate on window resize
      const handleResize = () => {
        setupAnimation();
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    });

    return () => ctx.revert();
  }, []);

  // Synchronize ScrollTrigger with Swarm Rebuild lifecycle
  useEffect(() => {
    const handleSwarmStart = () => {
      if (masterScrollTriggerRef.current) {
        masterScrollTriggerRef.current.disable(false);
      }
    };
    const handleSwarmComplete = () => {
      if (masterScrollTriggerRef.current) {
        masterScrollTriggerRef.current.enable();
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('swarm-rebuild:start', handleSwarmStart);
    window.addEventListener('swarm-rebuild:complete', handleSwarmComplete);

    return () => {
      window.removeEventListener('swarm-rebuild:start', handleSwarmStart);
      window.removeEventListener('swarm-rebuild:complete', handleSwarmComplete);
    };
  }, []);

  return (
    <>
      {/* =====================================================================
           LEAD-IN STATS STRIP
           ===================================================================== */}
      <section id="work" className="projects-lead-in" aria-label="Projects Overview">
        {/* Subtle Category Pill */}
        <div className="projects-lead-pill">
          <span className="lead-dot" />
          <span>01 // Selected Work &amp; Architecture</span>
        </div>

        {/* 3 Glowing Stat Counter Cards */}
        <div className="projects-stats-grid">
          <div className="lead-stat-card group">
            <div className="lead-stat-glow" />
            <div className="lead-stat-value">
              <span>765</span>
              <span className="lead-stat-accent">+</span>
            </div>
            <div className="lead-stat-label">Routes Owned // Kaizer X</div>
          </div>

          <div className="lead-stat-card group">
            <div className="lead-stat-glow" />
            <div className="lead-stat-value">
              <span>141</span>
              <span className="lead-stat-accent">ms</span>
            </div>
            <div className="lead-stat-label">p95 Latency Achieved</div>
          </div>

          <div className="lead-stat-card group">
            <div className="lead-stat-glow" />
            <div className="lead-stat-value">
              <span>9.9</span>
              <span className="lead-stat-accent">M+</span>
            </div>
            <div className="lead-stat-label">PostgreSQL Rows Handled</div>
          </div>
        </div>

        {/* Scroll Prompt Indicator */}
        <div className="scroll-prompt-indicator">
          <span className="scroll-prompt-text">
            Scroll down for <strong style={{ color: '#ef4151' }}>3D Emergence &rarr; 3-Col Bento Grid</strong>
          </span>
          <div className="scroll-prompt-pill" aria-hidden="true">
            <div className="scroll-prompt-dot" />
          </div>
        </div>
      </section>

      {/* =====================================================================
           MASTER PINNED 3D CENTER -> ROUND -> GRID EXPERIENCE
           ===================================================================== */}
      <div 
        ref={wrapperRef} 
        id="projects-pin-wrapper" 
        className="projects-pin-wrapper"
      >
        <div 
          ref={stageRef} 
          id="projects-pinned-stage" 
          className="projects-pinned-stage select-none"
        >
          {/* Pinned Top-Center Header matching User Photo 1-5 */}
          <div className="projects-pinned-header">
            <div className="projects-orbit-badge">
              <span className="orbit-badge-dot" />
              <span>Featured Production Architectures</span>
            </div>

            <h2 className="projects-pinned-title">
              PROJECTS<span className="crimson-dot-glow">.</span>
            </h2>

            <div className="projects-stage-subtext">
              <span className="active-stage-label">3D FORMATION</span>
              <span>&bull;</span>
              <span>CLICK ANY PROJECT TO INSPECT SYSTEM ARCHITECTURE</span>
            </div>
          </div>

          {/* MAIN 3D PERSPECTIVE VIEWPORT */}
          <div className="projects-stage-viewport">
            {/* Ambient Glowing Solar Core in Center */}
            <div 
              ref={solarCoreRef} 
              className="center-solar-core" 
              aria-hidden="true" 
            />

            {/* 3-Column Bento Grid Container */}
            <div 
              ref={gridContainerRef}
              className="projects-bento-grid"
            >
              {DISPLAY_PROJECTS.map((project, idx) => (
                <div
                  key={`grid-${project.id}`}
                  ref={el => cardsRef.current[idx] = el}
                  className="grid-project-card group"
                  onClick={() => setActiveProject(project)}
                  onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveProject(project)}
                  aria-label={`Inspect ${project.title}`}
                >
                  <ProjectCardContent project={project} />
                </div>
              ))}
            </div>
          </div>

          {/* Stage Footer Hint */}
          <div className="projects-stage-hint">
            <span>Scroll to see 3D formation</span>
            <span>&bull;</span>
            <span>Click any card to inspect full case study</span>
          </div>
        </div>
      </div>

      {/* Project Detail Modal Dialog */}
      {activeProject && (
        <ProjectDialog
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  );
}
