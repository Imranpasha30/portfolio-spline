/**
 * ==============================================================================
 * EXPERIENCE & CREDENTIALS DATA (experience.js) - IMRAN PASHA
 * ==============================================================================
 */

export const experience = [
  {
    id: "exp-1",
    role: "Backend Engineer",
    company: "Sharkify Private Limited",
    period: "Dec 2024 — Present (2 Years)",
    location: "Hyderabad, India",
    summary: "Founding backend engineer on Kaizer X (an AI video-production SaaS) and sole backend architect on payments-heavy platforms. Designed durable job queues, idempotency keys, and process isolation across 765+ REST and WebSocket endpoints.",
    highlights: [
      "Founded Kaizer X backend, rewriting a Django prototype to FastAPI & async SQLAlchemy 2.0; now serves 765 routes across 150 PostgreSQL tables.",
      "Designed a durable publish queue on PostgreSQL FOR UPDATE SKIP LOCKED with lease fencing, heartbeat renewal, and jittered backoff.",
      "Engineered a Redis Streams consumer-group queue with priority lanes, XCLAIM crash recovery, dead-letter stream, and SHA-256 idempotency deduplication.",
      "Orchestrated the AI media pipeline: dual-engine speech-to-text with language failover, provider-agnostic LLM layer (Gemini, Claude, OpenAI) with circuit breakers, and FFmpeg/NVENC rendering.",
      "Re-architected live streaming into separate API, control, relay and encode processes on dedicated Redis, so web tier deploys never interrupt on-air broadcasts.",
      "Instrumented 14 Prometheus metrics and OpenTelemetry tracing; load testing cut p95 latency from 12s to 141ms by right-sizing synchronous route threadpools."
    ],
    technologies: ["Python 3.12", "FastAPI", "SQLAlchemy 2.0 (async)", "PostgreSQL 17", "Redis 7 Streams", "Docker", "Cloudflare R2", "FFmpeg/NVENC", "OpenTelemetry"]
  },
  {
    id: "exp-2",
    role: "Sole Backend Architect — Ozone Wash & Voter Connect",
    company: "Field Platforms & Consumer Apps",
    period: "2025 — 2026",
    location: "Hyderabad / Remote",
    summary: "Architected and shipped production backends for high-concurrency mobile and field-service applications with rigorous transaction consistency and multi-gateway payments.",
    highlights: [
      "Ozone Wash: Architected the Node.js/Express backend as sole engineer (23 modules, ~200 REST endpoints, 37 migrations, 68 tables) with multi-gateway payments (Razorpay, PayU, Easebuzz) and HMAC-SHA256 verification.",
      "Designed reserve-pay-confirm booking flow with PostgreSQL advisory locks and cron sweeps, completely eliminating double-booked service crews.",
      "Voter Connect (Live on Google Play): Built backend over a 9.9M-row PostgreSQL dataset, maintaining sub-second latency through composite indexing, query-plan tuning, and Redis caching.",
      "Kaizer X Desktop (Windows Edition): Shipped an Electron 33 shell supervising a frozen FastAPI backend with free-port probing, orphan reaping, and offline licensing state machines."
    ],
    technologies: ["Node.js 20", "Express", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "Electron 33", "Razorpay", "Cloudflare R2"]
  },
  {
    id: "exp-3",
    role: "Cyber Security & Secure Backend Engineer",
    company: "Tech Solutions & Security Architecture",
    period: "2022 — 2024",
    location: "Remote / Hybrid",
    summary: "Applied defensive and offensive cyber security practices directly to API design, authentication flows, and CI/CD pipelines.",
    highlights: [
      "Conducted vulnerability assessments and penetration testing across 25+ web portals and microservices, remediating BOLA, SQLi, and CORS vulnerabilities.",
      "Engineered an SSRF guard that resolves DNS before refusing loopback, private, link-local and cloud-metadata addresses.",
      "Integrated static application security testing (SAST) and software composition analysis (SCA) into CI/CD pipelines to block high-severity CVEs.",
      "Designed zero-trust API gateways with mTLS, dynamic rate limiting, and byte-level magic-number MIME verification."
    ],
    technologies: ["VAPT", "OWASP Top 10", "Burp Suite", "Python", "FastAPI", "Docker", "Wazuh SIEM", "mTLS", "Linux"]
  }
];

export const education = [
  {
    degree: "B.Tech in Computer Science",
    institution: "Sahyadri College of Engineering (VTU), Mangalore",
    period: "2020 — 2024",
    honors: "CGPA: 7.05 · Core Focus on Distributed Systems, Networks, and Operating Systems"
  },
  {
    degree: "Executive Post Graduate Certification in Cyber Security & Ethical Hacking",
    institution: "Indian Institute of Technology (IIT), Roorkee",
    period: "Issued May 2026",
    honors: "iHUB DivyaSampark, IIT Roorkee (Credential ID: IPTIH26050044) · 49 hands-on lab rooms across Web VAPT, Network Security, Cryptography, and Digital Forensics"
  }
];

export const testimonials = [
  {
    id: "test-1",
    quote: "Imran owns the backend like a seasoned principal architect. When rewriting our prototype to FastAPI, he single-handedly stood up 765 routes, cut our p95 response time from 12s to 141ms, and designed queue architectures that never drop a frame during live video streaming.",
    author: "Sharkify Engineering Lead",
    role: "VP of Engineering",
    company: "Kaizer X / Sharkify",
    initials: "SX"
  },
  {
    id: "test-2",
    quote: "His rare blend of deep systems knowledge and IIT Roorkee cyber security training means our APIs are not only blazing fast under millions of rows, but bulletproof against OWASP Top 10, BOLA, and SSRF attacks by design.",
    author: "Technical Co-Founder",
    role: "Co-Founder & CTO",
    company: "Ozone Wash Platform",
    initials: "OW"
  },
  {
    id: "test-3",
    quote: "Imran's real-time violence detection deep learning system was selected to the state level for a reason: he knows how to take complex asynchronous pipelines and make them run reliably in mission-critical environments.",
    author: "Department of Computer Science",
    role: "Project Evaluation Committee",
    company: "Sahyadri College of Engineering",
    initials: "SC"
  }
];

export const awards = [
  {
    title: "Executive Post Graduate Certification in Cyber Security",
    issuer: "IIT Roorkee (iHUB DivyaSampark)",
    year: "2026",
    category: "Credential ID: IPTIH26050044 · 49 Hands-on Labs"
  },
  {
    title: "State-Level Selection: Real-Time AI Video Detection",
    issuer: "Karnataka State Council for Science & Technology (KSCST)",
    year: "2024",
    category: "Final-Year Computer Vision & Deep Learning Engineering Project"
  },
  {
    title: "Production Queue Runaway Elimination",
    issuer: "Sharkify / Kaizer X Infrastructure",
    year: "2026",
    category: "Diagnosed & Resolved 619,000-entry Redis stream TOCTOU race via atomic conditional claims"
  }
];
