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

/**
 * High-performance 3D Galaxy & Starfield Travel Hook
 * Renders hundreds of cosmic stars drifting in 3D and stretching into
 * hyperspace warp streaks as the user scrolls through the galaxy.
 */
function useGalaxyStarfield(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;

    const STAR_COUNT = 850;
    const MAX_DEPTH = 2200;
    const MIN_DEPTH = 30;
    const FOCAL_LENGTH = 650;

    const colors = [
      '#ffffff', '#ffffff', '#ffffff', '#f8fafc', // 70% pure starlight
      '#60a5fa', '#38bdf8', '#93c5fd',             // 20% electric sapphire
      '#ef4151', '#f43f5e'                         // 10% crimson stardust
    ];

    function createStar(initialZ = null) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1200 + 40;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: initialZ !== null ? initialZ : Math.random() * MAX_DEPTH + MIN_DEPTH,
        prevZ: initialZ !== null ? initialZ : MAX_DEPTH,
        size: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.65 + 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2
      };
    }

    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(createStar(Math.random() * MAX_DEPTH + MIN_DEPTH));
    }

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
      cx = width / 2;
      cy = height / 2;
    }

    resize();
    window.addEventListener('resize', resize);

    // Track directional scroll & wheel velocity for forward & reverse hyperspace travel
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      const clampedDelta = Math.max(-60, Math.min(60, delta));
      // Positive when scrolling down (forward travel), Negative when scrolling up (reverse travel)
      scrollVelocity = Math.max(-50, Math.min(50, scrollVelocity + clampedDelta * 0.6));
      lastScrollY = currentScrollY;
    };

    const onWheel = (e) => {
      const clampedWheel = Math.max(-40, Math.min(40, e.deltaY));
      scrollVelocity = Math.max(-50, Math.min(50, scrollVelocity + clampedWheel * 0.45));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    let currentSpeed = 1.3;

    function render(time) {
      // Smooth friction dampening towards 0
      scrollVelocity *= 0.90;

      // Target speed: default idle forward drift (+1.3) + directional scroll velocity
      // When scrolling up/back, targetSpeed becomes negative (reversing star movement)
      const targetSpeed = 1.3 + scrollVelocity * 1.65;
      currentSpeed += (targetSpeed - currentSpeed) * 0.16;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle, ethereal cosmic nebula dust clouds (No harsh hotspots)
      const grad1 = ctx.createRadialGradient(cx - width * 0.25, cy + height * 0.12, 10, cx - width * 0.25, cy + height * 0.12, width * 0.42);
      grad1.addColorStop(0, 'rgba(0, 102, 255, 0.032)');
      grad1.addColorStop(1, 'rgba(0, 102, 255, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(cx + width * 0.28, cy - height * 0.1, 10, cx + width * 0.28, cy - height * 0.1, width * 0.4);
      grad2.addColorStop(0, 'rgba(239, 65, 81, 0.028)');
      grad2.addColorStop(1, 'rgba(239, 65, 81, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Render all stars & bidirectional warp streaks
      const speedMagnitude = Math.abs(currentSpeed);
      const isWarping = speedMagnitude > 2.8;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.prevZ = star.z;
        star.z -= currentSpeed;

        // Wrap around boundaries for forward and reverse motion
        if (currentSpeed > 0 && star.z <= MIN_DEPTH) {
          // Traveling forward: wrap from camera to deep cosmic horizon
          star.z = MAX_DEPTH;
          star.prevZ = MAX_DEPTH;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 1200 + 40;
          star.x = Math.cos(angle) * radius;
          star.y = Math.sin(angle) * radius;
        } else if (currentSpeed < 0 && star.z >= MAX_DEPTH) {
          // Traveling in reverse: wrap from cosmic horizon to foreground near camera
          star.z = MIN_DEPTH + Math.random() * 25;
          star.prevZ = star.z;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 1200 + 40;
          star.x = Math.cos(angle) * radius;
          star.y = Math.sin(angle) * radius;
        }

        // Current 2D projection
        const safeZ = Math.max(MIN_DEPTH, star.z);
        const k = FOCAL_LENGTH / safeZ;
        const sx = star.x * k + cx;
        const sy = star.y * k + cy;

        // Clip offscreen
        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) {
          continue;
        }

        const depthRatio = Math.max(0, Math.min(1, 1 - safeZ / MAX_DEPTH));
        const twinkle = 0.85 + 0.15 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = Math.min(1, Math.max(0.12, star.alpha * depthRatio * 1.35 * twinkle));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;

        if (isWarping) {
          // Relativistic warp streak along star's directional vector (forward or reverse)
          const safePrevZ = Math.max(MIN_DEPTH, star.prevZ);
          const prevK = FOCAL_LENGTH / safePrevZ;
          const px = star.x * prevK + cx;
          const py = star.y * prevK + cy;

          ctx.strokeStyle = star.color;
          ctx.lineWidth = Math.max(0.7, star.size * depthRatio * 1.25);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          // Circular star point with soft radiance
          const r = Math.max(0.65, star.size * depthRatio * 1.6);
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();

          if (r > 1.8 && alpha > 0.6) {
            ctx.globalAlpha = alpha * 0.25;
            ctx.beginPath();
            ctx.arc(sx, sy, r * 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
    };
  }, [canvasRef]);
}

export default function ProjectGrid() {
  const [activeProject, setActiveProject] = useState(null);

  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const galaxyCanvasRef = useRef(null);
  const gridContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const masterScrollTriggerRef = useRef(null);

  // Initialize interactive 3D Galaxy Starfield Voyage
  useGalaxyStarfield(galaxyCanvasRef);

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

        // Cards Animation: Cosmic Void Inception -> 3D Round through Stars -> Snap into 3-Column Grid
        cards.forEach((card, i) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const cardCenterY = cardRect.top + cardRect.height / 2;

          // Offset from grid slot to stage center
          const dx = Math.round(stageCenterX - cardCenterX);
          const dy = Math.round(stageCenterY - cardCenterY);

          // Parametric angles for the 3D "Round" through galaxy
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

          // Waypoint 0 (Start): Tiny cards emerging deep in the cosmic void
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

          // Phase 1 (0 -> 1.0s): Stream outward along the 3D loop through stars
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
            Scroll down for <strong style={{ color: '#ef4151' }}>Galaxy Fly-Through &rarr; 3-Col Bento Grid</strong>
          </span>
          <div className="scroll-prompt-pill" aria-hidden="true">
            <div className="scroll-prompt-dot" />
          </div>
        </div>
      </section>

      {/* =====================================================================
           MASTER PINNED GALAXY & STARFIELD 3D EXPERIENCE
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
          {/* Dynamic 3D Galaxy & Starfield Warp Canvas */}
          <canvas 
            ref={galaxyCanvasRef} 
            className="projects-galaxy-canvas" 
            aria-hidden="true" 
          />

          {/* Pinned Top-Center Header */}
          <div className="projects-pinned-header">
            <div className="projects-orbit-badge">
              <span className="orbit-badge-dot" />
              <span>Featured Production Architectures</span>
            </div>

            <h2 className="projects-pinned-title">
              PROJECTS<span className="crimson-dot-glow">.</span>
            </h2>

            <div className="projects-stage-subtext">
              <span className="active-stage-label">COSMIC VOYAGE</span>
              <span>&bull;</span>
              <span>SCROLL TO TRAVEL THROUGH GALAXY &bull; CLICK ANY PROJECT TO INSPECT</span>
            </div>
          </div>

          {/* MAIN 3D PERSPECTIVE VIEWPORT */}
          <div className="projects-stage-viewport">
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
            <span>Scroll down to travel through stars</span>
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
