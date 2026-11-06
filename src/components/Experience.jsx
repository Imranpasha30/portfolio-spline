import React from 'react';
import { experience, education, awards } from '../data/experience';
import { siteConfig } from '../config/site';
import { Briefcase, GraduationCap, Award, MapPin } from 'lucide-react';

export default function Experience() {
  const { preferences } = siteConfig;

  return (
    <section id="experience" className="section-wrap" aria-label="Experience and Credentials">
      {/* Section Header */}
      <div className="section-header">
        <span className="eyebrow">03 / Experience</span>
        <h2 className="section-title">CAREER & CREDENTIALS</h2>
        <p className="section-subtitle">
          Proven track record of architecting scalable platforms, leading technical teams, 
          and delivering resilient full-stack systems.
        </p>
      </div>

      <div className="experience-layout">
        {/* Left Column: Work Timeline */}
        {preferences.showExperience && (
          <div className="timeline-list">
            {experience.map((job) => (
              <div key={job.id} className="timeline-card">
                <div className="timeline-top">
                  <div>
                    <h3 className="timeline-role">{job.role}</h3>
                    <div className="timeline-company">
                      <span>{job.company}</span>
                      {job.location && (
                        <span className="muted" style={{ fontWeight: 400, marginLeft: '8px' }}>
                          · {job.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="timeline-period">{job.period}</span>
                </div>

                <p className="timeline-summary">{job.summary}</p>

                {job.highlights && job.highlights.length > 0 && (
                  <ul className="timeline-bullets">
                    {job.highlights.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {job.technologies && (
                  <div className="project-tags">
                    {job.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Right Column: Education & Awards */}
        <div className="edu-awards-col">
          {/* Education Block */}
          {preferences.showEducation && education && education.length > 0 && (
            <div className="credential-block">
              <h3>
                <GraduationCap size={16} />
                <span>Education & Formal Studies</span>
              </h3>
              {education.map((edu, idx) => (
                <div key={idx} className="edu-item">
                  <div className="edu-degree">{edu.degree}</div>
                  <div className="edu-institution">{edu.institution}</div>
                  <div className="edu-period">{edu.period}</div>
                  {edu.honors && (
                    <div className="muted" style={{ fontSize: '11px', marginTop: '4px' }}>
                      {edu.honors}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Awards Block */}
          {preferences.showAwards && awards && awards.length > 0 && (
            <div className="credential-block">
              <h3>
                <Award size={16} />
                <span>Industry Recognition</span>
              </h3>
              {awards.map((award, idx) => (
                <div key={idx} className="award-item">
                  <div className="award-title">{award.title}</div>
                  <div className="award-issuer">
                    {award.issuer} · {award.category}
                  </div>
                  <div className="award-year">{award.year}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

