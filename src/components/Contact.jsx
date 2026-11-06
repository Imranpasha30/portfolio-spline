import React, { useState } from 'react';
import { siteConfig } from '../config/site';
import { Mail, Copy, Check, Send, MessageSquare, Phone } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, DribbbleIcon, CodeIcon } from './BrandIcons';

export default function Contact() {
  const { contact, preferences } = siteConfig;
  const [copied, setCopied] = useState(false);
  
  // Contact Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Web Application / Platform',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [formError, setFormError] = useState('');

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError('Please provide a valid email address.');
      return;
    }

    setFormStatus('sending');

    // Simulate sending with responsive feedback
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        projectType: 'Web Application / Platform',
        message: ''
      });
    }, 900);
  };

  const getSocialIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'github': return <GithubIcon size={15} />;
      case 'linkedin': return <LinkedinIcon size={15} />;
      case 'twitter':
      case 'twitter / x': return <TwitterIcon size={15} />;
      case 'dribbble': return <DribbbleIcon size={15} />;
      case 'codepen': return <CodeIcon size={15} />;
      default: return <MessageSquare size={15} />;
    }
  };

  return (
    <section id="contact" className="section-wrap" aria-label="Contact & Inquiries">
      <div className="section-header">
        <span className="eyebrow">05 / Get In Touch</span>
        <h2 className="section-title">LET'S ARCHITECT SOMETHING EXCEPTIONAL</h2>
      </div>

      <div className="contact-layout">
        {/* Left Column: Direct Contact & Socials */}
        <div className="contact-info">
          <p className="contact-headline">
            START A CONVERSATION.
          </p>
          <p className="contact-intro">
            Whether you have a breakthrough product in mind, need to scale an existing platform, 
            or want to consult on modern frontend architecture—my inbox is always open.
          </p>

          {/* Interactive Email Copy Card */}
          <div className="email-copy-card">
            <div>
              <small className="muted" style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Direct Inquiries
              </small>
              <div className="email-display">{contact.email}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`copy-email-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyEmail}
                aria-label="Copy email to clipboard"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <a
                href={`mailto:${contact.email}`}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '11px' }}
                aria-label="Send email directly via default mail app"
              >
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* WhatsApp Direct Link (if configured) */}
          {contact.whatsapp && (
            <div style={{ marginBottom: '24px' }}>
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent("Hello! I saw your portfolio and would like to discuss a project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ width: 'fit-content' }}
              >
                <Phone size={14} className="accent" />
                <span>Instant WhatsApp Message</span>
              </a>
            </div>
          )}

          {/* Social Profiles */}
          <div>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '14px' }}>
              Digital Presence & Profiles
            </h4>
            <div className="social-links-grid">
              {contact.socials.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill"
                >
                  {getSocialIcon(social.name)}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        {preferences.showContactForm && (
          <div className="contact-form-card">
            <h3 style={{ fontFamily: 'var(--display)', fontSize: '24px', marginBottom: '6px' }}>
              SEND A TRANSMISSION
            </h3>
            <p className="muted" style={{ fontSize: '13px', marginBottom: '24px' }}>
              Typically responding within 24 hours.
            </p>

            {formStatus === 'success' ? (
              <div className="form-success-banner" role="alert">
                <Check size={20} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                <strong>Transmission Received!</strong>
                <p style={{ marginTop: '6px', fontSize: '12px' }}>
                  Thank you for reaching out. I'll review your project details and follow up shortly.
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: '16px', fontSize: '11px', padding: '8px 16px' }}
                  onClick={() => setFormStatus('idle')}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {formError && (
                  <div style={{ color: 'var(--red)', fontSize: '12px', background: 'rgba(239, 65, 81, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid var(--red)' }}>
                    {formError}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Your Name / Organization *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="e.g. Sarah Connor"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="sarah@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="projectType" className="form-label">
                    Project Scope / Engagement
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    className="form-select"
                    value={formData.projectType}
                    onChange={handleInputChange}
                  >
                    <option value="High-Concurrency Backend / API Architecture">High-Concurrency Backend / API Architecture</option>
                    <option value="Database & Queue Optimization (PostgreSQL / Redis)">Database & Queue Optimization (PostgreSQL / Redis)</option>
                    <option value="Cyber Security & Code Audit / VAPT">Cyber Security & Code Audit / VAPT</option>
                    <option value="Desktop Application (Electron / FastAPI)">Desktop Application (Electron / FastAPI)</option>
                    <option value="Full-Stack Web Platform Architecture">Full-Stack Web Platform Architecture</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Project Details & Objectives *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    placeholder="Tell me about your product goals, timeline, and deliverables..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={formStatus === 'sending'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {formStatus === 'sending' ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
