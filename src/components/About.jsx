import React from 'react';
import { siteConfig } from '../config/site';
import { Cpu, Terminal, Shield, Zap } from 'lucide-react';

export default function About() {
  const { identity, skills, processSteps, preferences } = siteConfig;

  const categoryIcons = {
    'Backend & Secure APIs': <Terminal size={14} className="accent" />,
    'Data, Caching & Queues': <Cpu size={14} className="accent" />,
    'Security & DevSecOps': <Shield size={14} className="accent" />,
    'Cloud, AI & Media Pipelines': <Zap size={14} className="accent" />,
  };

  return (
    <section id="about" className="section-wrap" aria-label="About and Philosophy">
      {/* Section Header */}
      <div className="section-header">
        <span className="eyebrow">02 / About Me</span>
        <h2 className="section-title">ENGINEERING MEETS REFINED CRAFT</h2>
      </div>

      {/* Grid: Philosophy & Bio + Skills Column */}
      <div className="about-grid">
        {/* Left Column: Bio & Philosophy */}
        <div className="about-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {identity.avatar && (
              <img
                src={identity.avatar}
                alt={identity.fullName}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--red)'
                }}
              />
            )}
            <p className="handwriting" style={{ fontSize: '32px', color: 'var(--red)', margin: 0 }}>
              Behind the terminal
            </p>
          </div>

          <h3 className="about-lead">
            "{identity.aboutLead}"
          </h3>

          {identity.aboutBio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Right Column: Skills & Capabilities */}
        <div className="skills-column">
          {skills.map((cluster, i) => (
            <div key={i} className="skill-category-card">
              <div className="skill-cat-title">
                <span>{cluster.category}</span>
                {categoryIcons[cluster.category] || <Terminal size={14} className="accent" />}
              </div>

              <div className="skill-pills">
                {cluster.items.map((skill, j) => (
                  <span key={j} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section: 4-Step Methodology */}
      {preferences.showProcess && processSteps && processSteps.length > 0 && (
        <div className="process-section">
          <span className="eyebrow">Methodology & Process</span>
          <h3 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginTop: '8px' }}>
            HOW I TURN COMPLEX PROBLEMS INTO FLUID PRODUCTS
          </h3>

          <div className="process-grid">
            {processSteps.map((item, index) => (
              <div key={index} className="process-card">
                <div className="process-num">{item.step}</div>
                <h4 className="process-title">{item.title}</h4>
                <p className="process-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

