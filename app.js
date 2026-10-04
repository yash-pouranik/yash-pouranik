import 'dotenv/config';
import express from 'express';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import urBackend from '@urbackend/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- urBackend Visit Counter ---
const URBACKEND_BASE = 'https://api.ub.bitbros.in';
const URBACKEND_API_KEY = process.env.URBACKEND_API_KEY;
const COLLECTION = 'visits';

const client = urBackend({ apiKey: URBACKEND_API_KEY });

async function trackVisit() {
    try {
        const data = await client.db.getAll(COLLECTION, { sort: 'createdAt:desc', limit: 10 });

        const doc = data.items[0];
        if (!doc) return 1;

        const newCount = (doc.count || 0) + 1;

        await client.db.update(COLLECTION, doc._id, { count: newCount });

        return newCount;
    } catch (e) {
        console.error('Visit counter error:', e);
        return 1;
    }
}

function ordinalSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

import devlogData from "./data/devlogData.js";

const projects = [
    {
        slug: "urbackend",
        title: "urBackend",
        year: "2025 — 2026",
        category: "Infrastructure & Open Source",
        tagline: "Instant Backend-as-a-Service (BaaS) Platform",
        stats: "Node.js · Redis · MongoDB · AES-256-GCM · GSSoC'26 Maintainer",
        badge: "GSSoC'26 Official Project",
        stack: ["Node.js", "Redis", "MongoDB", "AES-256-GCM"],
        bullets: [
            "Auth latency cut 70% with Redis cache-aside",
            "AES-256-GCM encrypted DB connections + dynamic pooling",
            "GSSoC'26 official — 40+ contributors, 100+ PRs reviewed, 48 stars"
        ],
        desc: "urBackend is an open-source Backend-as-a-Service (BaaS) platform engineered to let developers spin up complete backend infrastructure — databases, authentication, file storage, and transactional emails — without writing server boilerplates.",
        highlights: [
            "Reduced authentication API latency by 70% (from 500ms down to 150ms) using a Redis cache-aside layer offloading MongoDB reads.",
            "Engineered AES-256-GCM encrypted database connections with dynamic connection pooling to prevent connection leaks under burst load.",
            "Implemented atomic MongoDB updates ($inc, $push) for quota enforcement, eliminating race conditions across concurrent API requests.",
            "Decoupled public developer gateway APIs from internal management services, enabling independent auto-scaling of developer traffic.",
            "Selected as an official GSSoC'2026 project — actively maintaining 40+ forks, 48 stars, and 100+ PR reviews from 40+ global open-source contributors."
        ],
        repo: "https://github.com/yash-pouranik/urBackend",
        live: "https://urbackend.bitbros.in/",
        docs: "https://docs.ub.bitbros.in/"
    },
    {
        slug: "errlocal",
        title: "Errlocal",
        year: "2026",
        category: "Developer Tooling & AI",
        tagline: "AI-powered Stack Trace Parser & CLI Debugger",
        stats: "Node.js · Groq LLM · Lingo.dev SDK · CLI · npm",
        badge: "Published on npm",
        stack: ["Node.js", "Groq LLM", "CLI", "npm"],
        bullets: [
            "Intercepts stack traces, streams AI fix suggestions instantly",
            "Error session tracking across development cycles",
            "Zero-config global CLI — published on npm"
        ],
        desc: "Errlocal is an automated CLI debugging utility for Node.js workflows. It intercepts raw terminal stack traces, parses error context, and streams code-aware resolution steps directly to the developer's terminal.",
        highlights: [
            "Parses Node.js stack traces into structured JSON and dispatches context to Groq LLM APIs for instantaneous, code-aware fix suggestions.",
            "Architected a persistent session log & error state tracking system to monitor error resolution rates across development cycles.",
            "Integrated Lingo.dev SDK to deliver localized error hints and progressive debugging guides in 4+ languages.",
            "Published on npm as a zero-config global CLI tool for instant developer adoption."
        ],
        repo: "https://github.com/yash-pouranik/errlocal",
        live: "https://www.npmjs.com/package/errlocal",
        npm: "https://www.npmjs.com/package/errlocal"
    },
    {
        slug: "kiroo",
        title: "Kiroo",
        year: "2025 — 2026",
        category: "Developer Tooling & SDK",
        tagline: "API Interaction Replay & Debugging Suite",
        stats: "Node.js · CLI + SDK · npm · 2nd Place National Tech Writing",
        badge: "2nd Place National Winner",
        stack: ["Node.js", "CLI", "SDK", "npm"],
        bullets: [
            "Replay HTTP API calls without touching source code",
            "Dual npm packages — @kiroo/sdk + @kiroo/cli",
            "2nd place nationally in technical writing contest"
        ],
        desc: "Kiroo is a developer tooling ecosystem built around the concept of 'Git for API Interactions' — capturing, replaying, and inspecting API payloads and headers directly from terminal sessions or via SDK integration.",
        highlights: [
            "Built @kiroo/sdk — reusable middleware for intercepting and logging API calls, integrated as core monitoring infrastructure in urBackend.",
            "Engineered @kiroo/cli — terminal tooling allowing backend engineers to replay recorded HTTP interactions without modifying source code.",
            "Awarded 2nd Place nationally in a technical writing contest for authoring an in-depth architecture breakdown of API replay systems.",
            "Published dual modular packages (@kiroo/sdk & @kiroo/cli) independently on npm."
        ],
        repo: "https://github.com/yash-pouranik/kiroo",
        live: "https://kiroo.bitbros.in/",
        docs: "https://kiroo.bitbros.in/docs.html",
        npm_cli: "https://www.npmjs.com/package/@kiroo/cli",
        npm_sdk: "https://www.npmjs.com/package/@kiroo/sdk",
        article: "https://medium.com/@yashpouranik124/stop-guessing-api-bugs-how-i-built-git-for-api-interactions-14a29d3bb428"
    },
    {
        slug: "campusnotes",
        title: "CampusNotes",
        year: "2025",
        category: "Production Web System",
        tagline: "High-Traffic Academic Notes Platform — Google Indexed",
        stats: "127 Signups · 8,077 Total Downloads · 6,450 Unique · Node.js · Cloudinary",
        badge: "127 Users · 8k+ Downloads",
        stack: ["Node.js", "MongoDB", "Cloudinary", "Express"],
        bullets: [
            "127 signups, 8,077 downloads — actively used in production",
            "Google indexed for 'svvv notes', 'campusnotes' keywords",
            "Round-robin Cloudinary across 3 accounts bypasses storage limits"
        ],
        desc: "CampusNotes is a production academic distribution platform serving university students with peer-verified study materials and PDF distribution. The platform is Google-indexed and ranks for targeted academic keywords like 'svvv notes' and 'campusnotes', driving organic traffic without any paid promotion.",
        highlights: [
            "Serves 127 verified signup users handling peak exam-season traffic with 8,077 total downloads (6,450 unique) across study materials.",
            "Google-indexed and organically ranking for academic search keywords including 'svvv notes' and 'campusnotes' — zero paid promotion.",
            "Architected a custom round-robin storage distribution algorithm across 3 Cloudinary accounts to bypass single-account free tier limits.",
            "Implemented direct signed client-side uploads, keeping backend workers stateless and eliminating upload proxy latency.",
            "Built upvote-weighted search algorithms to surface high-quality academic notes over low-quality submissions automatically."
        ],
        repo: "https://github.com/yash-pouranik/CampusNotes",
        live: "https://campusnotes.bitbros.in/"
    },
    {
        slug: "nirvirodh",
        title: "Nirvirodh",
        year: "2025",
        category: "Distributed Systems & Real-time",
        tagline: "Socket-level Lock Management & Conflict Resolution",
        stats: "Socket.IO · Node.js · MongoDB persistent locks",
        badge: "Real-time Concurrency",
        stack: ["Socket.IO", "Node.js", "MongoDB"],
        bullets: [
            "Single-writer socket locks prevent concurrent write conflicts",
            "Lock state synced in real-time across all connected clients",
            "Lock metadata persists across socket reconnections"
        ],
        desc: "Nirvirodh is a real-time collaborative editing platform engineered to prevent write-conflicts and file overwrites in multi-user concurrent editing environments.",
        highlights: [
            "Implemented a Socket.IO locking daemon enforcing granular, single-writer resource locks.",
            "Emits real-time synchronization states across connected clients to reflect live edit locks instantly.",
            "Enforced conflict detection at the socket protocol level, eliminating race conditions regardless of network jitter.",
            "Persisted locking metadata in MongoDB to survive server socket reconnections seamlessly."
        ],
        repo: "https://github.com/yash-pouranik/nirvirodh",
        live: "https://nirvirodh.onrender.com"
    },
    {
        slug: "gullybazar",
        title: "GullyBazar",
        year: "2024",
        category: "Hackathon Platform",
        tagline: "Hyperlocal B2B Marketplace (Top 25 / ~800 Teams)",
        stats: "Top 25 / ~800 Teams · Tutedude Solve for India · MERN",
        badge: "Top 25 / ~800 Teams",
        stack: ["MongoDB", "Express", "React", "Node.js"],
        bullets: [
            "Top 25 of ~800 teams at national hackathon",
            "Vendor + supplier dashboards with order flows",
            "Built end-to-end in 48 hours"
        ],
        desc: "GullyBazar is a hyperlocal supply chain marketplace built in 48 hours to connect informal street food vendors directly with wholesale raw material suppliers.",
        highlights: [
            "Ranked Top 25 out of ~800 competing teams nationally at the Tutedude — Solve for India Hackathon.",
            "Designed vendor and supplier dashboards with independent inventory and order settlement flows.",
            "Implemented trust & reputation rating systems tailored for informal market participants."
        ],
        repo: "https://github.com/yash-pouranik/gullybaza-bitbros",
        live: "https://gullybazar.bitbros.in/"
    },
    {
        slug: "trekstay",
        title: "TrekStay",
        year: "2025",
        category: "Full Stack Application",
        tagline: "Full Stack Accommodations & Booking System",
        stats: "Node.js · EJS · Express · MongoDB · Mapbox GL",
        stack: ["Node.js", "Express", "MongoDB", "Mapbox GL"],
        bullets: [
            "Role-based auth for guest and host dashboards",
            "Mapbox GL for geolocation-based listing search",
            "Server-side validation + multi-image upload handling"
        ],
        desc: "TrekStay is an end-to-end booking platform with role-based permissions, geolocation search, listing reviews, and clean MVC structure.",
        highlights: [
            "Role-based authentication & authorization protecting guest and host dashboards.",
            "Integrated Mapbox GL API for dynamic spatial listing visualization.",
            "Session authentication, strict server-side validation, and multi-image payload processing."
        ],
        repo: "https://github.com/yash-pouranik/trekStay",
        live: "https://trekstay.onrender.com/"
    },
    {
        slug: "pandey-dhudh-bhandar",
        title: "Pandey Ledger",
        year: "2025",
        category: "Real-world Utility",
        tagline: "Digital Credit Ledger & Settlement System",
        stats: "Node.js · MongoDB · Production Local Business App",
        badge: "Real-world Utility",
        stack: ["Node.js", "MongoDB", "Express"],
        bullets: [
            "Digitizes pen-and-paper udhaar (credit) registers",
            "Real-time balance calculations per customer",
            "Actively deployed for a real local business"
        ],
        desc: "Pandey Ledger is a custom financial utility application created for a local business to digitize pen-and-paper credit registers (udhaar).",
        highlights: [
            "Automated daily transaction logging with real-time balance calculations.",
            "Detailed customer credit histories simplifying monthly balance settlements.",
            "Deployed and actively utilized by a local business owner."
        ],
        repo: "https://github.com/yash-pouranik/PandeyDhudhBhandar",
        live: "https://pandeydudhbhandar.bitbros.in/"
    }
];

const articles = [
    {
        title: "Why Telegram is Spending Crores for a New Web Domain Called .gram",
        url: "https://medium.com/@yashpouranik124/why-telegram-is-spending-crores-for-a-new-web-domain-called-gram-e6dd888f9302?sharedUserId=yashpouranik124",
        date: "Aug 18",
        readTime: "4 min read",
        tag: "Tech Strategy",
        description: "An analysis of Telegram's strategic application to ICANN for the '.gram' TLD and how registry ownership prevents platform DNS disruptions."
    },
    {
        title: "I Had Zero Idea What RLS Was, So I Built It for MongoDB",
        url: "https://medium.com/@yashpouranik124/i-had-zero-idea-what-rls-was-so-i-built-it-for-mongodb-9f1e11eeba8a",
        date: "Jul 25",
        readTime: "7 min read",
        tag: "System Design",
        description: "A deep dive into row-level security primitives and how I implemented custom RLS filters directly inside MongoDB queries for urBackend."
    },
    {
        title: "We Needed Soft Delete in Our Open-Source BaaS",
        url: "https://medium.com/@yashpouranik124/we-needed-soft-delete-in-our-open-source-baas-0659a5ba2e2f",
        date: "Jun 6, 2026",
        readTime: "5 min read",
        tag: "Data Architecture",
        description: "Why hard deletion breaks relational integrity in BaaS environments, and how we implemented recoverable soft-deletes without polluting queries."
    },
    {
        title: "Implementing a Redis-Backed Login Lockout System in Node.js",
        url: "https://medium.com/@yashpouranik124/implementing-a-redis-backed-login-lockout-system-in-node-js-76f6b342452d",
        date: "May 26, 2026",
        readTime: "3 min read",
        tag: "Security & Caching",
        description: "How to safeguard authentication routes against brute-force attacks using Redis sliding-window rate limiting and temporary lockouts."
    },
    {
        title: "Stop Guessing API Bugs: How I Built Git for API Interactions",
        url: "https://medium.com/@yashpouranik124/stop-guessing-api-bugs-how-i-built-git-for-api-interactions-14a29d3bb428",
        date: "Mar 16, 2026",
        readTime: "15 min read",
        tag: "Developer Tooling",
        description: "The architectural design story behind Kiroo — capturing deterministic API traffic snapshots for seamless debugging replays."
    }
];

const videos = [
    {
        id: "BxfQUFHwpLk",
        title: "AI CLI that FIXES your code in the terminal! (errlocal v0.3.0 Demo)",
        description: "A comprehensive demo of Errlocal CLI parsing raw terminal stack traces and streaming AI-suggested error fixes in real time.",
        url: "https://youtu.be/BxfQUFHwpLk?si=jMPhC3fG6_a9VsGD",
        date: "2026",
        duration: "1:42"
    },
    {
        id: "OKY3gWdeg4k",
        title: "Stop Guessing API Bugs: How I Built “Git” for API Interactions | kiroo",
        description: "Deep dive explaining the core concept of Kiroo — deterministic API recording, inspection, and replay logs directly in development.",
        url: "https://youtu.be/OKY3gWdeg4k?si=Yi3kFtGYJ0_wVfmU",
        date: "2026",
        duration: "4:15"
    }
];

// Videos route
app.get("/videos", (req, res) => {
    res.render("videos", {
        title: "Videos & Demos — Yash Pouranik",
        description: "Watch video demos, walk-throughs, and technical breakdowns of urBackend, Errlocal, and Kiroo.",
        canonical: "https://yashpouranik.urbackend.in/videos",
        activePage: "videos",
        videos: videos
    });
});

// Root route
app.get('/', async (req, res) => {
    try {
        const count = await trackVisit();
        res.render("index", {
            title: "Yash Pouranik — Backend Engineer",
            description: "Backend Engineer specializing in Node.js, Redis, MongoDB, auth systems, and developer tooling. Creator of urBackend and Errlocal.",
            canonical: "https://yashpouranik.urbackend.in/",
            activePage: "home",
            featuredProjects: projects.slice(0, 4), // Top 4 backend-heavy projects
            featuredArticles: articles,
            visitNumber: ordinalSuffix(count)
        });
    } catch (err) {
        console.error('Visit counter error:', err);
        res.render("index", {
            title: "Yash Pouranik — Backend Engineer",
            description: "Backend Engineer specializing in Node.js, Redis, MongoDB, auth systems, and developer tooling.",
            canonical: "https://yashpouranik.urbackend.in/",
            activePage: "home",
            featuredProjects: projects.slice(0, 4),
            featuredArticles: articles,
            visitNumber: '1st'
        });
    }
});

// About route
app.get("/about", (req, res) => {
    res.render("about", {
        title: "About — Yash Pouranik | Backend Engineer",
        description: "Learn about Yash Pouranik — computer science student, open-source maintainer, and backend engineer building distributed systems and developer tooling.",
        canonical: "https://yashpouranik.urbackend.in/about",
        activePage: "about"
    });
});

// Projects route
app.get("/projects", (req, res) => {
    res.render("projects", {
        title: "Projects — Yash Pouranik | Backend Engineer",
        description: "Explore backend infrastructure, developer CLI tools, SDKs, and high-traffic web applications built by Yash Pouranik.",
        canonical: "https://yashpouranik.urbackend.in/projects",
        activePage: "projects",
        projects: projects
    });
});

// Articles route
app.get("/articles", (req, res) => {
    res.render("articles", {
        title: "Articles & Engineering Logs — Yash Pouranik",
        description: "Technical write-ups by Yash Pouranik on Row-Level Security, Redis caching, soft-deletes, and API replay systems.",
        canonical: "https://yashpouranik.urbackend.in/articles",
        activePage: "articles",
        articles: articles
    });
});

// Devlog route
app.get("/urbackend/devlog", (req, res) => {
    res.render("devlog", {
        title: "urBackend Engineering Log — Yash Pouranik",
        description: "Detailed devlog entries covering query optimization, Redis auth caching, database connection pooling, and latency reductions.",
        canonical: "https://yashpouranik.urbackend.in/urbackend/devlog",
        activePage: "devlog",
        entries: devlogData
    });
});

// Project detail route
app.get("/projects/:slug", (req, res) => {
    const project = projects.find(p => p.slug === req.params.slug);
    if (project) {
        res.render("project-detail", {
            title: `${project.title} — Yash Pouranik`,
            description: `${project.title}: ${project.tagline}. ${project.desc.substring(0, 140)}...`,
            canonical: `https://yashpouranik.urbackend.in/projects/${project.slug}`,
            activePage: "projects",
            project: project
        });
    } else {
        res.redirect("/projects");
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render("index", {
        title: "404 - Page Not Found — Yash Pouranik",
        description: "The page you are looking for does not exist.",
        canonical: "https://yashpouranik.urbackend.in/",
        activePage: "",
        featuredProjects: projects.slice(0, 4),
        featuredArticles: articles,
        visitNumber: '1st'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
