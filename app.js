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
    const data = await client.db.getAll(COLLECTION, { sort: 'createdAt:desc', limit: 10 });

    const doc = data.items[0];
    if (!doc) return 1;

    const newCount = (doc.count || 0) + 1;

    await client.db.update(COLLECTION, doc._id, { count: newCount });

    return newCount;
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
        tagline: "Instant Backend-as-a-Service (BaaS) Platform",
        stats: "Node.js, Redis, MongoDB, JWT, REST APIs | GSSoC'2026 Open Source",
        desc: "urBackend is an Instant Backend-as-a-Service platform that lets developers spin up a full backend — databases, auth, storage, and mail — without writing any server code. It ships with a developer dashboard, API key management, schema validation, and a growing SDK ecosystem.",
        highlights: [
            "Engineered AES-256-GCM encrypted database connections with a dynamic connection manager, preventing memory leaks at scale.",
            "Built a Redis caching layer that reduced authentication API response times by 70% — from 500ms down to 150ms — by offloading MongoDB reads.",
            "Implemented atomic MongoDB operations for quota management, ensuring zero race conditions on plan limits under concurrent load.",
            "Decoupled infrastructure into independent internal and public APIs, allowing safe scaling of developer-facing routes separately.",
            "Selected as official GSSoC'2026 open-source project — 40+ forks, 30 stars, 40+ PRs reviewed from 25+ external contributors worldwide."
        ],
        repo: "https://github.com/yash-pouranik/urBackend",
        live: "https://urbackend.bitbros.in/",
        docs: "https://docs.ub.bitbros.in/"
    },
    {
        slug: "campusnotes",
        title: "CampusNotes",
        year: "2025",
        tagline: "Academic Notes Sharing Platform — 5.7k+ downloads",
        stats: "800+ Users | 114 Verified Signups | Node.js, EJS, MongoDB",
        desc: "CampusNotes is a production-deployed notes-sharing platform where students upload, verify, and download study materials. It was built to solve a real problem — juniors couldn't find reliable notes, and existing tools had no quality control.",
        highlights: [
            "Actively serving 800+ users with 114 verified signups, handling real academic traffic every semester.",
            "Processed 5.7k+ total document downloads with 4,200+ unique downloads across 180+ notes.",
            "Built a round-robin storage algorithm across three Cloudinary accounts to maximize free-tier capacity and prevent storage bottlenecks.",
            "Implemented secure, direct client-side PDF uploads to Cloudinary, keeping the server stateless and reducing upload latency.",
            "Designed upvote-driven sorting and advanced search filters so the best notes always surface first."
        ],
        repo: "https://github.com/yash-pouranik/CampusNotes",
        live: "https://campusnotes.bitbros.in/"
    },
    {
        slug: "errlocal",
        title: "Errlocal",
        year: "2026",
        tagline: "AI-powered Node.js CLI Debugger",
        stats: "Node.js, Groq LLM, Lingo.dev | CLI Tool | npm",
        desc: "Errlocal is a CLI tool that plugs into your Node.js workflow and transforms raw stack traces into actionable, AI-generated fixes. Built for developers who are tired of copy-pasting errors into ChatGPT manually.",
        highlights: [
            "Parses Node.js stack traces and sends structured context to Groq LLM APIs to generate precise, code-aware fix suggestions.",
            "Designed a backend sync system for structured error logging, resolution state management, and history tracking across sessions.",
            "Integrated Lingo.dev SDK to deliver localized error explanations and progressive hints in 4+ languages — making debugging accessible to global developers.",
            "Published on npm with a clean CLI interface — install once, run anywhere in any Node.js project."
        ],
        repo: "https://github.com/yash-pouranik/errlocal",
        live: "https://www.npmjs.com/package/errlocal",
        npm: "https://www.npmjs.com/package/errlocal"
    },
    {
        slug: "kiroo",
        title: "Kiroo",
        year: "2025 — 2026",
        tagline: "API Interaction Replay & Debugging SDK",
        stats: "Node.js, CLI + SDK | npm | Technical Writing 2nd Place",
        desc: "Kiroo is a developer tooling project built around the idea of API interaction replay — recording, replaying, and debugging API calls from the terminal or via SDK integration. The @kiroo/sdk powers urBackend's infrastructure, and @kiroo/cli brings replay to any terminal.",
        highlights: [
            "Built @kiroo/sdk — a reusable SDK for API interaction replay, integrated directly into urBackend's core infrastructure.",
            "Built @kiroo/cli — a terminal tool that lets developers replay and inspect API calls without touching their codebase.",
            "Won 2nd place in a national technical writing competition by authoring a deep-dive Medium article on API replay systems and debugging workflows.",
            "Published both packages independently on npm with clean, minimal APIs designed for developer ergonomics."
        ],
        repo: "https://github.com/yash-pouranik/kiroo",
        live: "http://kiroo.bitbros.in/",
        docs: "https://kiroo.bitbros.in/docs.html",
        npm_cli: "https://www.npmjs.com/package/@kiroo/cli",
        npm_sdk: "https://www.npmjs.com/package/@kiroo/sdk",
        article: "https://medium.com/@yashpouranik124/stop-guessing-api-bugs-how-i-built-git-for-api-interactions-14a29d3bb428"
    },
    {
        slug: "nirvirodh",
        title: "Nirvirodh",
        year: "2025",
        tagline: "Real-time conflict-free collaboration",
        stats: "Socket.IO, Node.js, MongoDB",
        desc: "Nirvirodh is a real-time collaboration platform that solves the classic problem of editing conflicts in team environments — two people editing the same file at the same time, overwriting each other's work.",
        highlights: [
            "Implemented a Socket.IO-based file-locking mechanism ensuring only one user can edit a resource at a time.",
            "All collaborators receive real-time lock/unlock events so they always know who is currently editing.",
            "Built conflict detection at the socket layer, not just the UI — preventing race conditions even on slow connections.",
            "Persistent lock state stored in MongoDB so page refreshes don't silently break the locking guarantee."
        ],
        repo: "https://github.com/yash-pouranik/nirvirodh",
        live: "https://nirvirodh.onrender.com"
    },
    {
        slug: "trekstay",
        title: "TrekStay",
        year: "2025",
        tagline: "Airbnb-inspired stay booking",
        stats: "Node.js, EJS, MongoDB, Mapbox",
        desc: "TrekStay is a full-stack stay booking platform inspired by Airbnb, built to learn and demonstrate end-to-end product development — from user auth and listing management to map integration and reviews.",
        highlights: [
            "Role-based access control for both guests (browse, book, review) and admins (manage listings and users).",
            "Integrated Mapbox GL for location-based listing visualization with interactive maps.",
            "Clean MVC backend architecture with session-based auth, form validation, and image upload support.",
            "Users can leave star reviews tied to specific listings, with computed average ratings."
        ],
        repo: "https://github.com/yash-pouranik/trekStay",
        live: "https://trekstay.onrender.com/"
    },
    {
        slug: "gullybazar",
        title: "GullyBazar",
        year: "2024",
        tagline: "Hyperlocal marketplace for vendors",
        stats: "Top 25 / ~800 Teams — Solve for India | MERN Stack",
        desc: "GullyBazar was built in 48 hours at Tutedude's Solve for India national hackathon with a team of 3. It connects street food vendors with raw material suppliers in a hyperlocal marketplace, addressing a gap in the informal economy.",
        highlights: [
            "Ranked Top 25 out of ~800 competing teams at the Tutedude–Solve for India national hackathon.",
            "Built end-to-end in 48 hours — vendor profiles, supplier listings, secure auth, and a review system.",
            "Vendor and supplier roles with separate dashboards for managing inventory, orders, and trust signals.",
            "Review and rating system to build credibility within a marketplace where trust is the key barrier to adoption."
        ],
        repo: "https://github.com/yash-pouranik/gullybaza-bitbros",
        live: "https://gullybazar.bitbros.in/"
    },
    {
        slug: "pandey-dhudh-bhandar",
        title: "Pandey Ledger",
        year: "2025",
        tagline: "Digital credit manager for a local vendor",
        stats: "Practical Use Case | Node.js, MongoDB",
        desc: "Pandey Ledger is a real-world utility app built for a local milk vendor to replace his handwritten udhaar (credit) register with a digital system. A small project with a very real user.",
        highlights: [
            "Daily transaction logging with automatic running balance calculation — no manual math needed.",
            "Customer profiles with full transaction history, making monthly settlement transparent and easy.",
            "Built and deployed for actual use by a local vendor, not just as a portfolio demo.",
            "Simple, distraction-free UI designed for someone with minimal tech experience."
        ],
        repo: "https://github.com/yash-pouranik/PandeyDhudhBhandar",
        live: "https://pandeydudhbhandar.bitbros.in/"
    }
];

const articles = [
    {
        title: "I Had Zero Idea What RLS Was, So I Built It for MongoDB",
        url: "https://medium.com/@yashpouranik124/i-had-zero-idea-what-rls-was-so-i-built-it-for-mongodb-9f1e11eeba8a",
        date: "25 July",
        readTime: "7 min read",
        description: "A practical breakdown of row-level security concepts, rebuilt from scratch for MongoDB in urBackend."
    },
    {
        title: "We Needed Soft Delete in Our Open-Source BaaS",
        url: "https://medium.com/@yashpouranik124/we-needed-soft-delete-in-our-open-source-baas-0659a5ba2e2f",
        date: "Jun 6, 2026",
        readTime: "5 min read",
        description: "Why soft delete mattered in a production BaaS, and how the implementation balanced recoverability with clean data access."
    },
    {
        title: "Implementing a Redis-Backed Login Lockout System in Node.js",
        url: "https://medium.com/@yashpouranik124/implementing-a-redis-backed-login-lockout-system-in-node-js-76f6b342452d",
        date: "May 26, 2026",
        readTime: "3 min read",
        description: "A short engineering write-up on protecting auth flows with Redis-backed rate limiting and temporary account lockouts."
    },
    {
        title: "Stop Guessing API Bugs: How I Built Git for API Interactions",
        url: "https://medium.com/@yashpouranik124/stop-guessing-api-bugs-how-i-built-git-for-api-interactions-14a29d3bb428",
        date: "Mar 16, 2026",
        readTime: "15 min read",
        description: "The design story behind Kiroo and the idea of replayable API interactions for debugging."
    }
];



// Root route
app.get('/', async (req, res) => {
    try {
        const count = await trackVisit();
        res.render("index", {
            featuredProjects: projects.slice(0, 2),
            featuredArticles: articles.slice(0, 2),
            visitNumber: ordinalSuffix(count)
        });
    } catch (err) {
        console.error('Visit counter error:', err);
        res.render("index", {
            featuredProjects: projects.slice(0, 2),
            featuredArticles: articles.slice(0, 2),
            visitNumber: '1'
        });
    }
});

// About route
app.get("/about", (req, res) => {
    res.render("about");
});

// Projects route
app.get("/projects", (req, res) => {
    res.render("projects", { projects: projects });
});

// Articles route
app.get("/articles", (req, res) => {
    res.render("articles", { articles });
});

// Devlog route
app.get("/urbackend/devlog", (req, res) => {
    res.render("devlog", { entries: devlogData });
});

// Project detail route
app.get("/projects/:slug", (req, res) => {
    const project = projects.find(p => p.slug === req.params.slug);
    if (project) {
        res.render("project-detail", { project: project });
    } else {
        res.redirect("/projects");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
