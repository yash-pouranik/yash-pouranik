require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');

// --- urBackend Visit Counter ---
const URBACKEND_BASE = 'https://api.urbackend.bitbros.in';
const URBACKEND_API_KEY = process.env.URBACKEND_API_KEY;
const COLLECTION = 'visits';

async function trackVisit() {
    const headers = { 'x-api-key': URBACKEND_API_KEY, 'Content-Type': 'application/json' };

    const getRes = await fetch(`${URBACKEND_BASE}/api/data/${COLLECTION}`, { headers });
    const all = await getRes.json();
    const doc = Array.isArray(all) ? all[0] : null;
    if (!doc) return 1;

    const newCount = (doc.count || 0) + 1;

    await fetch(`${URBACKEND_BASE}/api/data/${COLLECTION}/${doc._id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ count: newCount })
    });

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


const devlogData = require("./data/devlogData");

const projects = [
    {
        slug: "urbackend",
        title: "urBackend",
        year: "2025 - DEC",
        tagline: "Instant Backend-as-a-Service (BaaS)",
        stats: "Node.js, React, MongoDB, JWT, REST APIs",
        desc: "urBackend is an instant Backend-as-a-Service platform built to help developers quickly set up databases, authentication, and storage without writing backend code. It provides JWT-based authentication, API key access, rate limiting for security, schema validation for data consistency, and a visual dashboard to monitor API usage and traffic.",
        repo: "https://github.com/yash-pouranik/urBackend",
        live: "https://urbackend.bitbros.in/"
    },
    {
        slug: "campusnotes",
        title: "CampusNotes",
        year: "2025 - SEPT",
        tagline: "notes sharing platform - 42GB+ pdfs Delivered",
        stats: "750+ Active Users | Node.js, EJS, MongoDB",
        desc: "CampusNotes is a production-deployed academic notes sharing platform that allows students to upload, verify, and download study materials. It features secure session-based authentication, role-based access control, and an AI assistant for note summarization and contextual chat, while handling real-world traffic and file delivery at scale.",
        repo: "https://github.com/yash-pouranik/CampusNotes",
        live: "https://campusnotes.bitbros.in/"
    },
    {
        slug: "nirvirodh",
        title: "Nirvirodh",
        year: "2025 - AUG",
        tagline: "Real-time collaboration tool",
        stats: "Socket.IO, Node.js, MongoDB",
        desc: "Nirvirodh is a real-time collaboration platform designed to prevent editing conflicts in team environments. It implements a secure file-locking mechanism using Socket.IO, ensuring that only one user can edit a resource at a time while keeping all collaborators in sync.",
        repo: "https://github.com/yash-pouranik/nirvirodh",
        live: "https://nirvirodh.onrender.com"
    },
    {
        slug: "edubridge",
        title: "EduBridge Kids",
        year: "2025 - NOV",
        tagline: "Offline-first LMS with AI & Live Classes",
        stats: "Void Hack 7.0 | MERN, PWA, Gemini AI",
        desc: "Built for Void Hack 7.0, EduBridge Kids is an offline-first learning management system designed for students in low-connectivity regions. It supports role-based access for students and teachers, progressive web app (PWA) capabilities for offline usage, and a Gemini-powered AI study assistant to help with learning and doubt resolution.",
        repo: "https://github.com/KushagraJaiswar02/EduPlatform",
        live: "https://eduplatform.bitbros.in/"
    },
    {
        slug: "trekstay",
        title: "TrekStay",
        year: "2025 - JUNE",
        tagline: "Airbnb-inspired stay booking",
        stats: "Node.js, EJS, MongoDB, Mapbox",
        desc: "TrekStay is a full-stack stay booking platform inspired by Airbnb, supporting user and admin roles. Users can explore listings, make bookings, and leave reviews, while admins manage listings and users. The application integrates Mapbox GL for location-based visualization and follows a clean MVC backend architecture.",
        repo: "https://github.com/yash-pouranik/trekStay",
        live: "https://trekstay.onrender.com/"
    },
    {
        slug: "gullybazar",
        title: "GullyBazar",
        year: "2024 - JULY",
        tagline: "Hyperlocal marketplace for vendors",
        stats: "Solve for India Hackathon | MERN Stack",
        desc: "Built during a 48-hour national hackathon (Solve for India), GullyBazar is a hyperlocal marketplace that connects street food vendors with raw material suppliers. The platform includes secure authentication, vendor and supplier profiles, and a review system to build trust within the local ecosystem.",
        repo: "https://github.com/yash-pouranik/gullybaza-bitbros",
        live: "https://gullybazar.bitbros.in/"
    },
    {
        slug: "pandey-dhudh-bhandar",
        title: "Pandey Ledger",
        year: "2025 - SEPT",
        tagline: "Digital credit manager",
        stats: "Practical Use Case | Node.js, MongoDB",
        desc: "Pandey Ledger is a custom-built digital ledger application for a local milk vendor to manage customer credit (udhaar). It supports daily transaction logging, automatic balance calculations, and provides a simple interface to digitize and streamline traditional record-keeping.",
        repo: "https://github.com/yash-pouranik/PandeyDhudhBhandar",
        live: "https://pandeydudhbhandar.bitbros.in/"
    }
];



// Root route
app.get('/', async (req, res) => {
    try {
        const count = await trackVisit();
        res.render("index", { featuredProjects: projects.slice(0, 2), visitNumber: ordinalSuffix(count) });
    } catch (err) {
        console.error('Visit counter error:', err.message);
        res.render("index", { featuredProjects: projects.slice(0, 2), visitNumber: '...' });
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