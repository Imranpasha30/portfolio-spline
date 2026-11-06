/**
 * ==============================================================================
 * MASTER CONFIGURATION FILE (site.js) - IMRAN PASHA
 * ==============================================================================
 * Backend Engineer | Secure Backend Architect & DevSecOps Engineer
 * ==============================================================================
 */

export const siteConfig = {
  // Reference & Metadata
  meta: {
    siteTitle: "IMRAN PASHA | Backend Engineer & Secure Systems Architect",
    siteDescription: "Backend Engineer with 2+ years of experience building production APIs and distributed systems in Python (FastAPI), PostgreSQL, Redis, and Node.js. Certified in Cyber Security through IIT Roorkee.",
    siteUrl: "https://imranpasha.vercel.app",
    ogImage: "/assets/og-image.jpg",
  },

  // Personal Identity & Branding
  identity: {
    fullName: "Imran Pasha",
    displayName: "IMRAN PASHA",
    shortName: "Imran",
    wordmark: "PASHA",
    wordmarkDot: ".",
    profession: "Backend Engineer | Secure Systems Architect",
    roleLine2: "Python (FastAPI) · PostgreSQL 17 · Redis 7 Streams · Node.js · Cyber Security & DevSecOps",
    location: "Hyderabad / Hassan, Karnataka, India (Open to Remote / Hybrid)",
    timezone: "Asia/Kolkata", // Live IST time in footer
    availability: {
      status: "Available for Immediate Full-Time / Contracts",
      badgeText: "AVAILABLE FOR HIRE",
      isOpen: true,
    },
    heroGreeting: "Hey, I'm Imran Pasha",
    headline: "ARCHITECTING RESILIENT, HIGH-CONCURRENCY BACKENDS & SECURE APIS.",
    intro: "Founding backend engineer on Kaizer X (an AI video-production SaaS serving 765 routes) and sole backend architect on payments-heavy platforms. I design for failure rather than the happy path: durable PostgreSQL & Redis job queues, idempotency keys, plan-aware rate limiting, and process isolation. Certified in Cyber Security through IIT Roorkee.",
    aboutLead: "I design for failure rather than the happy path: systems that never drop a job, leak a secret, or interrupt a broadcast.",
    aboutBio: [
      "I am a Backend Engineer and Secure Systems Architect with deep expertise in Python (FastAPI, asyncio, SQLAlchemy 2.0), Node.js (Express, TypeScript), PostgreSQL 17, and Redis 7 Streams.",
      "As founding backend engineer at Sharkify Private Limited, I redesigned architectures from the ground up: rewriting Django prototypes into high-throughput FastAPI systems serving 765 routes, building durable worker queues with PostgreSQL FOR UPDATE SKIP LOCKED and Redis Streams, cutting p95 latency from 12s to 141ms, and isolating streaming processes so web deploys never interrupt on-air broadcasts.",
      "With an Executive Post-Graduate certification in Cyber Security and Ethical Hacking from IIT Roorkee's iHUB DivyaSampark, I bridge offensive security (VAPT, OWASP Top 10, STRIDE threat modeling, Burp Suite) directly into resilient API design."
    ],
    // Studio portrait generated from uploaded photograph (Transparent PNG for OLED glassmorphism)
    portrait: "/assets/portrait.png?v=clean3",
    portraitBlue: "/assets/portrait-blue.png?v=clean1",
    avatar: "/assets/avatar.jpg",
    resumeUrl: "#contact", // or link to PDF
  },

  // Key Statistics / Highlights (from authentic production metrics)
  metrics: [
    { value: "765+", label: "Routes Architected", description: "REST & WebSocket endpoints on Kaizer X" },
    { value: "141ms", label: "p95 Latency Achieved", description: "Down from 12s via threadpool & query tuning" },
    { value: "9.9M+", label: "Rows Handled", description: "Sub-second queries on PostgreSQL & Redis" },
  ],

  // Contact Information
  contact: {
    email: "imranpasha.ahmed@gmail.com",
    phone: "+91 98445 48537",
    whatsapp: "+919844548537",
    location: "Hyderabad / Hassan, Karnataka, India",
    calendlyUrl: "",
    socials: [
      { name: "GitHub", url: "https://github.com/Imranpasha30", icon: "Github" },
      { name: "LinkedIn", url: "https://linkedin.com/in/imran-pasha-019b2b213", icon: "Linkedin" },
    ],
  },

  // Skills & Technical Capabilities
  skills: [
    {
      category: "Backend & Secure APIs",
      items: ["Python 3.12", "FastAPI", "Node.js 20", "Express.js", "TypeScript", "SQLAlchemy 2.0 (async)", "Pydantic v2", "Django", "Alembic", "REST & WebSockets", "asyncio"]
    },
    {
      category: "Data, Caching & Queues",
      items: ["PostgreSQL 17", "FOR UPDATE SKIP LOCKED", "Query Plan Tuning", "Redis 7 Streams", "Consumer Groups", "Advisory Locks", "Supabase", "SQLite"]
    },
    {
      category: "Security & DevSecOps",
      items: ["VAPT", "OWASP Top 10", "Burp Suite", "Nmap", "Metasploit", "STRIDE Threat Modeling", "HMAC Webhook Verification", "SSRF / IDOR Mitigation", "mTLS", "RBAC / OAuth 2.0"]
    },
    {
      category: "Cloud, AI & Media Pipelines",
      items: ["AWS (EC2, S3, Lambda)", "Cloudflare R2", "Docker", "FFmpeg / NVENC", "Google Gemini", "Anthropic Claude", "OpenAI", "Deepgram ASR", "Prometheus", "OpenTelemetry"]
    }
  ],

  // 4-Step Engineering & Design Process
  processSteps: [
    {
      step: "01",
      title: "Threat Modeling & Domain Design",
      description: "Deconstructing domain boundaries, modeling STRIDE security threats, defining relational schemas, and establishing API contracts via OpenAPI."
    },
    {
      step: "02",
      title: "Resilient Systems Architecture",
      description: "Implementing durable queues (PostgreSQL SKIP LOCKED & Redis Streams), idempotency keys, advisory locks, and circuit breakers."
    },
    {
      step: "03",
      title: "High-Throughput Engineering",
      description: "Developing async I/O routes, tuning threadpools, writing raw SQL migrations, and integrating external payment / AI media pipelines."
    },
    {
      step: "04",
      title: "Observability, VAPT & Deployment",
      description: "Instrumenting Prometheus & OpenTelemetry tracing, conducting adversarial security reviews, Docker container hardening, and zero-downtime CI/CD."
    }
  ],

  // Visual Theme Tokens & Typography (touquirakhtar.com inspired)
  appearance: {
    theme: "dark",
    background: "#090909",
    panel: "#121212",
    panelElevated: "#181818",
    ink: "#f2efeb",
    muted: "#a09c9a",
    accent: "#ef4151",      // Signature crimson red accent
    accentHover: "#ff5d65",
    line: "#242020",
    displayFont: "'Anton', Impact, sans-serif",
    bodyFont: "'Manrope', sans-serif",
    accentFont: "'Caveat', cursive",
  },

  // Section Visibility & Behavior Toggles
  preferences: {
    autoStartSwarmRebuild: true, // Automatically triggers the Swarm Rebuild animation on first load
    showAwards: true,
    showExperience: true,
    showEducation: true,
    showTestimonials: true,
    showContactForm: true,
    showDownloadResume: true,
    showMetrics: true,
    showProcess: true,
  }
};
