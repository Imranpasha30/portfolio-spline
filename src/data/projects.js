/**
 * ==============================================================================
 * PROJECTS DATA (projects.js) - IMRAN PASHA
 * ==============================================================================
 * Production, Security, and Engineering projects by Imran Pasha.
 * ==============================================================================
 */

export const projects = [
  // -------------------------------------------------------------------------
  // PROFESSIONAL & PRODUCTION PROJECTS (Sharkify & Enterprise Platforms)
  // -------------------------------------------------------------------------
  {
    id: "kaizer-x-platform",
    title: "Kaizer X — AI Video Production Platform (Web SaaS & Windows Desktop)",
    subtitle: "Unified AI Media Engine: Distributed Backend, Live Streaming & Electron 33 Desktop",
    category: "Professional",
    year: "2026",
    summary: "Flagship AI video production platform: 765 REST/WebSocket routes, durable PostgreSQL & Redis Streams queues, process-isolated live streaming, and a supervised Electron 33 desktop edition.",
    description: "Kaizer X is a comprehensive AI video-production and multi-channel publishing ecosystem with both a cloud Web SaaS (live at kaizerx.com) and an offline-tolerant Windows Desktop edition. As founding backend engineer, rewrote the Django prototype into an asynchronous FastAPI and SQLAlchemy 2.0 architecture spanning 150 PostgreSQL tables and 765 routes. Designed durable publish queues on PostgreSQL FOR UPDATE SKIP LOCKED with lease fencing, heartbeat renewal, and jittered backoff. Built a Redis Streams consumer-group queue with priority lanes, XCLAIM crash recovery, dead-letter stream, and SHA-256 idempotency deduplication. For the Windows Desktop edition (163 commits), authored an Electron 33 shell supervising a frozen FastAPI backend with free-port probing, orphan process reaping, and direct memory-efficient uploads to Cloudflare R2.",
    role: "Founding Backend Engineer & Desktop Architect",
    client: "Sharkify Private Limited / Kaizer X",
    timeline: "Apr 2026 — Present",
    tools: ["Python 3.12", "FastAPI", "SQLAlchemy 2.0 (async)", "PostgreSQL 17", "Redis 7 Streams", "Electron 33", "Node.js", "Docker", "Cloudflare R2", "FFmpeg/NVENC", "OpenTelemetry"],
    featured: true,
    coverColor: "linear-gradient(135deg, #18090c 0%, #2b0c13 50%, #100608 100%)",
    accentColor: "#ef4151",
    tagline: "Web SaaS & Desktop: 765 routes, durable queues, and 141ms p95 latency",
    metrics: [
      { label: "p95 Latency", value: "141ms" },
      { label: "Routes Owned", value: "765" },
      { label: "Desktop Commits", value: "163" }
    ],
    features: [
      "Dual-platform unified architecture: Cloud SaaS (FastAPI on Docker) + Windows Desktop (Electron 33 with supervised frozen FastAPI)",
      "Durable PostgreSQL FOR UPDATE SKIP LOCKED queue with lease fencing and heartbeat renewal",
      "Redis Streams consumer group queue with XCLAIM recovery and SHA-256 idempotency keys",
      "Dual-engine speech-to-text with language failover, provider-agnostic LLM layer (Gemini, Claude, OpenAI), and FFmpeg rendering",
      "Process-isolated live streaming on dedicated Redis, ensuring zero broadcast interruptions during web tier deploys",
      "Offline-tolerant desktop licensing state machine (12h heartbeat, 72h grace) and direct R2 streaming without memory buffering"
    ],
    liveUrl: "https://kaizerx.com",
    sourceUrl: "https://github.com/Imranpasha30"
  },
  {
    id: "bose-american-academy",
    title: "Bose American Academy — Learning Platform API",
    subtitle: "TypeScript/Express API with InversifyJS Dependency Injection & PayU Payments",
    category: "Professional",
    year: "2025",
    summary: "Engineered user-identity domain, multi-role Google OAuth 2.0 authentication, and PayU payment fulfillment engine for a major learning academy.",
    description: "Bose American Academy is a specialized online learning platform operated by Sharkify Technology. As the 2nd of 9 contributors, architected the core user-identity domain of a TypeScript/Express API utilizing InversifyJS dependency injection. Built registration with email one-time passcodes (OTP), multi-role authorization, a three-step password reset workflow, and Google OAuth 2.0 code exchange. Implemented PayU post-payment fulfilment including gateway re-verification, coupon voucher consumption, cart clearing, and course enrolment, subsequently extending checkout to support multi-course bundled orders.",
    role: "Core Backend & Identity Architect (2nd of 9 Contributors)",
    client: "Sharkify Technology Private Limited",
    timeline: "Dec 2024 — Apr 2025",
    tools: ["Node.js", "TypeScript", "Express.js", "InversifyJS", "Sequelize to TypeORM", "PostgreSQL (AWS RDS)", "AWS S3", "PayU Payment Gateway"],
    featured: true,
    coverColor: "linear-gradient(135deg, #10141f 0%, #152238 50%, #0a0d14 100%)",
    accentColor: "#3b82f6",
    tagline: "Enterprise TypeScript API with dependency injection & PayU checkout",
    metrics: [
      { label: "Contributors Rank", value: "2nd / 9" },
      { label: "Architecture", value: "Dependency Injection" },
      { label: "Payment Gateway", value: "PayU Certified" }
    ],
    features: [
      "Modular TypeScript/Express API architected with InversifyJS inversion of control (IoC)",
      "Multi-role user authentication with email OTPs, 3-step password reset, and Google OAuth 2.0",
      "PayU post-payment webhook verification with cart clearing and atomic course enrollment",
      "Seamless database ORM migration from Sequelize (MSSQL) to TypeORM on PostgreSQL (AWS RDS)"
    ],
    liveUrl: "https://github.com/Imranpasha30",
    sourceUrl: "https://github.com/Imranpasha30"
  },
  {
    id: "ozone-wash-platform",
    title: "Ozone Wash — Field-Service Booking & Payments Platform",
    subtitle: "Multi-Gateway Payments with HMAC-SHA256 & Advisory Locks",
    category: "Professional",
    year: "2026",
    summary: "Sole backend engineer for 6 months: 23 modules, 200 endpoints, 68 tables, triple payment gateway facade, and advisory-lock anti-double-booking.",
    description: "Ozone Wash is a field-service booking, payments, and compliance platform. Architected the complete Node.js/Express backend from scratch: 23 feature modules, ~200 REST endpoints, and 37 transactional SQL migrations defining 68 tables. Integrated three payment gateways (Razorpay, PayU, Easebuzz) behind one unified facade with raw-body HMAC-SHA256 webhook verification, replay deduplication, and idempotent settlement. Engineered a reserve-pay-confirm booking flow under PostgreSQL advisory locks with cron sweep, completely eliminating double-booked service crews.",
    role: "Sole Backend Engineer (6 Months)",
    client: "Ozone Wash Services",
    timeline: "Mar 2026 — Oct 2026",
    tools: ["Node.js 20", "Express 4", "PostgreSQL (Supabase)", "Cloudflare R2", "Razorpay", "PayU", "Easebuzz", "node-cron", "Render"],
    featured: true,
    coverColor: "linear-gradient(135deg, #0f1813 0%, #15291e 50%, #09100c 100%)",
    accentColor: "#10b981",
    tagline: "Advisory-locked bookings and triple-gateway payment integrity",
    metrics: [
      { label: "REST Endpoints", value: "200+" },
      { label: "Database Tables", value: "68" },
      { label: "Double Bookings", value: "0" }
    ],
    features: [
      "Triple payment gateway facade (Razorpay, PayU, Easebuzz) with raw-body HMAC verification",
      "PostgreSQL advisory locks preventing double-booking race conditions during checkout",
      "Admin security plane with 5-tier RBAC, Helmet, CORS allowlist, and 8-hour session JWTs",
      "Automated cron sweeps reclaiming abandoned booking holds"
    ],
    liveUrl: "https://github.com/Imranpasha30/ozone-wash-backend",
    sourceUrl: "https://github.com/Imranpasha30/ozone-wash-backend"
  },
  {
    id: "voter-connect",
    title: "Voter Connect — Campaign Management Platform",
    subtitle: "High-Throughput 9.9M-Row Dataset Backend (Live on Google Play)",
    category: "Professional",
    year: "2026",
    summary: "High-concurrency campaign platform holding sub-second API latency across a 9.9M-row PostgreSQL dataset with Redis read caching.",
    description: "Voter Connect is a large-scale political campaign and volunteer management platform live on Google Play. Built and tuned the backend over a 9.9-million row PostgreSQL dataset. Designed geolocation-verified volunteer endpoints separating administrative powers from grassroots volunteers. Maintained sub-second API latency through composite indexing, execution query-plan analysis, and hot-path Redis caching.",
    role: "Backend Architect & Database Tuning Lead",
    client: "Political Campaign Operations",
    timeline: "Dec 2025 — Jun 2026",
    tools: ["FastAPI", "PostgreSQL", "Redis", "SQLAlchemy", "JWT", "Docker", "GitHub Actions CI/CD", "Dart/Flutter"],
    featured: true,
    coverColor: "linear-gradient(135deg, #0e161c 0%, #132533 50%, #080d12 100%)",
    accentColor: "#38bdf8",
    tagline: "Sub-second queries across 9.9 million PostgreSQL records",
    metrics: [
      { label: "Database Records", value: "9.9M+" },
      { label: "API Latency", value: "< 250ms" },
      { label: "Platform", value: "Google Play" }
    ],
    features: [
      "Composite index tuning and EXPLAIN ANALYZE optimization across 9.9M voter records",
      "Redis caching layer for hot read paths and geolocation volunteer lookup",
      "Strict JWT authorization separating field volunteers from central campaign admins",
      "Automated CI/CD pipeline on GitHub Actions with GitFlow branching model"
    ],
    liveUrl: "https://play.google.com/store",
    sourceUrl: "https://github.com/Imranpasha30/voter_connect"
  },
  {
    id: "editor-dashboard-kaizerfit",
    title: "Editor Dashboard & KaizerFit — FastAPI Services",
    subtitle: "Real-Time Newsroom CMS via pg_notify SSE & Atomic Bulk Ingestion",
    category: "Professional",
    year: "2025",
    summary: "Principal author (98% of code by git blame): 54 endpoints, revocable JWTs, real-time dashboards via PL/pgSQL triggers and SSE.",
    description: "Built a newsroom submission CMS and health tracking backend for Sharkify Private Limited. Engineered 54 REST endpoints with revocable JWTs and real-time live dashboard updates without client polling via PL/pgSQL database triggers, pg_notify, and Server-Sent Events (SSE). Led the KaizerFit backend (47 endpoints, 21 tables) with an offline-first sync engine ingesting five record types in a single atomic bulk transaction with hash-based deduplication.",
    role: "Principal Author (98% of Code by Git Blame)",
    client: "Sharkify Private Limited",
    timeline: "Jun 2025 — Oct 2025",
    tools: ["FastAPI", "SQLAlchemy (async)", "asyncpg", "PostgreSQL", "Alembic", "Server-Sent Events", "Telegram Bot API", "Docker", "AWS EC2"],
    featured: false,
    coverColor: "linear-gradient(135deg, #151119 0%, #25162e 50%, #0d0a11 100%)",
    accentColor: "#a855f7",
    tagline: "Zero-polling real-time dashboards via PL/pgSQL triggers & SSE",
    metrics: [
      { label: "Git Blame Share", value: "98%" },
      { label: "CMS Endpoints", value: "54" },
      { label: "Realtime Engine", value: "SSE + pg_notify" }
    ],
    features: [
      "Real-time newsroom updates without polling using PostgreSQL triggers and Server-Sent Events",
      "Revocable JWT authorization with fine-grained editorial permissions",
      "Offline-first atomic sync engine ingesting 5 record types in a single transaction",
      "Telegram Bot API integration for instant newsroom broadcast notifications"
    ],
    liveUrl: "https://github.com/Imranpasha30/EditerDashboardBackend",
    sourceUrl: "https://github.com/Imranpasha30/EditerDashboardBackend"
  },

  // -------------------------------------------------------------------------
  // CYBER SECURITY & RESEARCH PROJECTS
  // -------------------------------------------------------------------------
  {
    id: "llm-redteam",
    title: "LLM Red-Teaming & Adversarial Security Platform",
    subtitle: "Automated Fuzzing, Prompt Injection & Model Vulnerability Scanner",
    category: "Cyber Security",
    year: "2026",
    summary: "Security testing suite designed to evaluate LLMs against OWASP Top 10 for LLMs, prompt injections, and jailbreak vectors.",
    description: "Built an adversarial testing harness and API proxy for testing generative AI models against injection attacks, data exfiltration, and model jailbreaks. Features automated mutation fuzzing, system-prompt leakage detection, rate-limiting guards, and token inspection before upstream submission to OpenAI, Gemini, or Claude.",
    role: "Security Engineer & Creator",
    client: "Open Source / Security Lab",
    timeline: "2026",
    tools: ["Python", "FastAPI", "OpenAI", "Google Gemini", "Docker", "OWASP LLM Top 10"],
    featured: true,
    coverColor: "linear-gradient(135deg, #1b120f 0%, #2e1a14 50%, #110b08 100%)",
    accentColor: "#f97316",
    tagline: "Adversarial prompt injection detection & automated model fuzzing",
    metrics: [
      { label: "Vulnerabilities Tested", value: "OWASP Top 10" },
      { label: "Fuzzing Mutation", value: "Automated" },
      { label: "Upstream Guard", value: "Pre-Flight" }
    ],
    features: [
      "Automated prompt mutation fuzzing for testing guardrail resilience",
      "System prompt leakage and indirect injection signature detection",
      "API proxy with token introspection and rate-limiting throttling",
      "Comprehensive benchmark reports mapping compliance with ISO & OWASP standards"
    ],
    liveUrl: "https://github.com/Imranpasha30/llm-redteam-platform",
    sourceUrl: "https://github.com/Imranpasha30/llm-redteam-platform"
  },
  {
    id: "infoga-osint",
    title: "Infoga — Email OSINT & Header Security Analyzer",
    subtitle: "Detecting Forged Headers, SPF/DKIM/DMARC & SMTP Server Verification",
    category: "Cyber Security",
    year: "2025",
    summary: "Cyber security investigation utility verifying email header legitimacy, MX record availability, and spoofing vulnerability.",
    description: "Engineered an OSINT investigation tool that parses raw RFC 822 email headers to identify spoofing attempts, fake relay hops, and authentication mismatches. Analyzes SPF, DKIM, and DMARC alignment and tests target mail servers for open relays and account enumeration.",
    role: "Security Researcher",
    client: "IIT Roorkee Lab & Open Source",
    timeline: "2025",
    tools: ["Python", "OSINT", "SMTP", "DNS Sec", "RFC 822 Parsing"],
    featured: false,
    coverColor: "linear-gradient(135deg, #111417 0%, #162029 50%, #0a0d10 100%)",
    accentColor: "#38bdf8",
    tagline: "Forensic email header analysis and spoofing detection",
    metrics: [
      { label: "Header Checks", value: "RFC 822" },
      { label: "Verification", value: "DKIM / SPF" },
      { label: "DNS Analysis", value: "Live MX" }
    ],
    features: [
      "Extraction and timeline mapping of Received: header transit hops",
      "Automated DNS TXT query verification for SPF and DMARC enforcement policies",
      "SMTP handshake testing to verify mailbox existence without sending mail",
      "Detection of common spoofing indicators and phishing relays"
    ],
    liveUrl: "https://github.com/Imranpasha30/infoga",
    sourceUrl: "https://github.com/Imranpasha30/infoga"
  },

  // -------------------------------------------------------------------------
  // COLLEGE & ACADEMIC ENGINEERING PROJECTS (Sahyadri College / VTU)
  // -------------------------------------------------------------------------
  {
    id: "violence-detection-cv",
    title: "Real-Time Violence Detection on Live Video Streams",
    subtitle: "Computer Vision & Deep Learning (Selected to State Level)",
    category: "College Project",
    year: "2024",
    summary: "Final-year B.Tech engineering project selected to Karnataka state level (KSCST). Real-time violence detection on live feeds with automated police routing.",
    description: "Developed an asynchronous deep learning computer vision pipeline capable of detecting violent altercations and physical assaults on live surveillance streams in real time. Upon threshold classification, the system generates automated alerts, captures tamper-proof evidence frames, and calculates optimal navigation routing to the nearest law-enforcement station. Selected and recognized at the Karnataka state level by KSCST.",
    role: "Lead Machine Learning & Backend Engineer",
    client: "Sahyadri College of Engineering / KSCST",
    timeline: "Final Year B.Tech Project",
    tools: ["Python", "OpenCV", "TensorFlow / PyTorch", "Computer Vision", "Deep Learning", "FastAPI"],
    featured: true,
    coverColor: "linear-gradient(135deg, #180909 0%, #301010 50%, #0e0505 100%)",
    accentColor: "#ef4151",
    tagline: "State-level recognized AI surveillance & automated emergency routing",
    metrics: [
      { label: "Recognition", value: "State Level" },
      { label: "Detection Latency", value: "Real-Time" },
      { label: "Institution", value: "Sahyadri (VTU)" }
    ],
    features: [
      "Optical flow and spatio-temporal deep neural network for action recognition",
      "Asynchronous frame ingestion pipeline capable of multi-camera surveillance",
      "Automated emergency alert generation with cryptographic timestamping",
      "Integrated GPS navigation routing calculating nearest police station coordinates"
    ],
    liveUrl: "https://github.com/Imranpasha30/project",
    sourceUrl: "https://github.com/Imranpasha30/project"
  },
  {
    id: "chatz-android",
    title: "ChatZ — Real-Time Social Media Application",
    subtitle: "Native Android Social Chat with Firebase Cloud Messaging",
    category: "College Project",
    year: "2023",
    summary: "Native Android social application featuring end-to-end messaging, user profiles, image sharing, and real-time push notifications.",
    description: "Built a native Java Android social networking and instant messaging application named ChatZ. Featuring real-time bidirectional messaging, user authentication, profile customization, cloud image storage, and Firebase Cloud Messaging push notifications.",
    role: "Android Developer",
    client: "Academic Project",
    timeline: "2023",
    tools: ["Java", "Android SDK", "Firebase Realtime DB", "Firebase Auth", "Cloud Storage"],
    featured: false,
    coverColor: "linear-gradient(135deg, #151119 0%, #241630 50%, #0d0a11 100%)",
    accentColor: "#c084fc",
    tagline: "Native Android messaging with real-time Firebase synchronization",
    metrics: [
      { label: "Platform", value: "Native Android" },
      { label: "Sync Engine", value: "Realtime DB" },
      { label: "Language", value: "Java" }
    ],
    features: [
      "Instant 1-on-1 real-time chat with presence detection and typing status",
      "Firebase Authentication with secure password storage and email validation",
      "Direct photo and media sharing with automatic client-side compression",
      "Clean Material Design UI with custom adapters and RecyclerView caching"
    ],
    liveUrl: "https://github.com/Imranpasha30/androidapp",
    sourceUrl: "https://github.com/Imranpasha30/androidapp"
  }
];

export const projectCategories = [
  "All",
  "Professional",
  "Cyber Security",
  "College Project"
];
