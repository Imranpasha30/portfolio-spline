import React from 'react';
import { testimonials } from '../data/experience';
import { siteConfig } from '../config/site';

export default function Testimonials() {
  const { preferences } = siteConfig;

  if (!preferences.showTestimonials || !testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-wrap" aria-label="Client Testimonials and Endorsements">
      <div className="section-header">
        <span className="eyebrow">04 / Endorsements</span>
        <h2 className="section-title">CLIENT & PEER RECOGNITION</h2>
        <p className="section-subtitle">
          Direct feedback from founders, executives, and engineering directors on collaboration, 
          product velocity, and technical execution.
        </p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((item) => (
          <div key={item.id} className="testimonial-card">
            <div>
              <div className="quote-icon" aria-hidden="true">“</div>
              <p className="quote-text">{item.quote}</p>
            </div>

            <div className="quote-author">
              <div className="author-avatar">{item.initials}</div>
              <div className="author-info">
                <div className="author-name">{item.author}</div>
                <div className="author-role">
                  {item.role}, {item.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

