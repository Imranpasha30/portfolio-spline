import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, CheckCircle2, Calendar, User, Building, Clock } from 'lucide-react';
import { GithubIcon } from './BrandIcons';

export default function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when dialog is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!project) return null;

  return (
    <div
      className="dialog-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="dialog-modal"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        {/* Close Button */}
        <button
          type="button"
          className="dialog-close-btn"
          onClick={onClose}
          aria-label="Close project modal"
        >
          <X size={18} />
        </button>

        {/* Modal Banner Header */}
        <div
          className="dialog-banner"
          style={{
            background: project.coverColor || '#121212',
          }}
        >
          <div className="dialog-meta-strip">
            <span className="art-badge">{project.category}</span>
            <span className="project-year">{project.year}</span>
          </div>

          <h2 id="dialog-title" className="dialog-title">
            {project.title}
          </h2>

          <p className="dialog-subtitle">
            {project.subtitle}
          </p>

          <div className="dialog-links">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <span>Live Demonstration</span>
                <ExternalLink size={14} />
              </a>
            )}

            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <GithubIcon size={14} />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="dialog-body">
          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
            }}
          >
            {project.role && (
              <div>
                <small className="muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} className="accent" /> Role
                </small>
                <p style={{ fontSize: '13px', fontWeight: '600', marginTop: '3px' }}>{project.role}</p>
              </div>
            )}
            {project.client && (
              <div>
                <small className="muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={12} className="accent" /> Client
                </small>
                <p style={{ fontSize: '13px', fontWeight: '600', marginTop: '3px' }}>{project.client}</p>
              </div>
            )}
            {project.timeline && (
              <div>
                <small className="muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} className="accent" /> Duration
                </small>
                <p style={{ fontSize: '13px', fontWeight: '600', marginTop: '3px' }}>{project.timeline}</p>
              </div>
            )}
          </div>

          {/* Key Impact Stats */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="dialog-stats-grid">
              {project.metrics.map((metric, i) => (
                <div key={i} className="dialog-stat-item">
                  <div className="dialog-stat-value">{metric.value}</div>
                  <div className="dialog-stat-label">{metric.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Architectural Overview */}
          <div>
            <h3 className="dialog-section-h3">Architecture & Execution</h3>
            <p className="dialog-desc-p">{project.description}</p>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="dialog-section-h3">Core Engineering Capabilities</h3>
              <ul className="features-list">
                {project.features.map((feature, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Pills */}
          <div>
            <h3 className="dialog-section-h3">Technologies & Systems Utilized</h3>
            <div className="project-tags">
              {project.tools.map((tool, i) => (
                <span key={i} className="tech-tag" style={{ fontSize: '12px', padding: '5px 12px' }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
