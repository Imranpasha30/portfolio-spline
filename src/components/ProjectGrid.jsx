import React, { useState, useMemo } from 'react';
import { projects, projectCategories } from '../data/projects';
import Projects3DStage from './Projects3DStage';
import ProjectDialog from './ProjectDialog';
import { Search, X, ArrowUpRight, Layers, Sparkles, Grid } from 'lucide-react';

export default function ProjectGrid() {
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'grid'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState(null);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="work" className="section-wrap" aria-label="Selected Work & Projects">
      {/* Section Header */}
      <div className="section-header">
        <span className="eyebrow">01 / Selected Work</span>
        <h2 className="section-title">FEATURED RELEASES & ARCHITECTURE</h2>
        <p className="section-subtitle">
          A curated selection of mission-critical web applications, enterprise systems, 
          and bespoke digital products built for scale, speed, and precision.
        </p>
      </div>

      {/* Filter and View Mode Controls */}
      <div className="portfolio-controls">
        {/* Category Tabs */}
        <div className="category-tabs" role="tablist" aria-label="Project Categories">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Toggle & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* 3D Stage vs Grid Switcher */}
          <div className="projects-view-toggle" role="group" aria-label="Project View Layout">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
              aria-pressed={viewMode === '3d'}
            >
              <Sparkles size={13} />
              <span>3D STAGE</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
            >
              <Grid size={13} />
              <span>LIST ARCHIVE</span>
            </button>
          </div>

          {/* Search Box (Always functional, especially useful in List Archive) */}
          <div className="search-box">
            <Search size={14} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              className="search-input"
              placeholder="Search projects or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects by title, summary, or tech stack"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE 3D WEBGL FLOATING STAGE */}
      {viewMode === '3d' && (
        <Projects3DStage
          projects={filteredProjects.length > 0 ? filteredProjects : projects}
          activeCategory={selectedCategory}
          onSelectProject={(project) => setActiveProject(project)}
        />
      )}

      {/* VIEW 2: TRADITIONAL LIST ARCHIVE GRID */}
      {viewMode === 'grid' && (
        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <article
                key={project.id}
                className="project-card"
                onClick={() => setActiveProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveProject(project);
                  }
                }}
                aria-haspopup="dialog"
                aria-label={`Open details for ${project.title}`}
              >
                {/* Project Card Cover Art */}
                <div className="project-thumbnail">
                  <div
                    className="project-cover-art"
                    style={{ background: project.coverColor }}
                  >
                    <div className="art-grid" aria-hidden="true" />
                    
                    <div className="art-badge">
                      <Layers size={11} className="accent" />
                      <span>{project.category}</span>
                    </div>

                    <div className="art-center">
                      <div className="art-symbol">{project.title.split(' ')[0]}</div>
                      <div className="art-tagline">{project.tagline}</div>
                    </div>

                    <div className="art-footer">
                      <span>{project.client || 'Internal Product'}</span>
                      <span style={{ fontFamily: 'monospace' }}>RELEASE {project.year}</span>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="project-details">
                  <div className="project-header-row">
                    <h3 className="project-title">{project.title}</h3>
                    <span className="project-year">{project.year}</span>
                  </div>

                  <p className="project-summary">{project.summary}</p>

                  {/* Tech Stack Tags */}
                  <div className="project-tags">
                    {project.tools.slice(0, 4).map((tool, i) => (
                      <span key={i} className="tech-tag">
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 4 && (
                      <span className="tech-tag" style={{ color: 'var(--red)' }}>
                        +{project.tools.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="project-action-link">
                    <span>View Case Study</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                No projects found
              </p>
              <p className="muted" style={{ fontSize: '13px', marginBottom: '16px' }}>
                No projects match your current filter or search criteria.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeProject && (
        <ProjectDialog
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  );
}
