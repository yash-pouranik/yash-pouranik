document.addEventListener("DOMContentLoaded", () => {
    // ─── Command Registry (Grouped) ──────────────────────────────────────────
    const commandGroups = [
        {
            group: "Navigation",
            commands: [
                { name: "Home",      hint: "Go to homepage",       hotkey: "G H", action: () => window.location.href = "/" },
                { name: "Projects",  hint: "Browse all projects",  hotkey: "G P", action: () => window.location.href = "/projects" },
                { name: "Videos",    hint: "Watch talk & demo videos", hotkey: "G V", action: () => window.location.href = "/videos" },
                { name: "About",     hint: "About me",             hotkey: "G A", action: () => window.location.href = "/about" },
                { name: "Articles",  hint: "Technical writing",    hotkey: "G R", action: () => window.location.href = "/articles" },
                { name: "Devlog",    hint: "Engineering log",      hotkey: "G D", action: () => window.location.href = "/urbackend/devlog" },
            ]
        },
        {
            group: "Connect",
            commands: [
                { name: "GitHub",    hint: "github.com/yash-pouranik",    hotkey: "G G", action: () => window.open("https://github.com/yash-pouranik", "_blank") },
                { name: "LinkedIn",  hint: "linkedin.com/in/yash-pouranik30", hotkey: "G L", action: () => window.open("https://linkedin.com/in/yash-pouranik30", "_blank") },
                { name: "X / Twitter", hint: "x.com/yash_pouranik",       hotkey: "G X", action: () => window.open("https://x.com/yash_pouranik", "_blank") },
                { name: "Medium",    hint: "Engineering articles",         hotkey: "G M", action: () => window.open("https://medium.com/@yashpouranik124", "_blank") },
                { name: "Email",     hint: "yashpouranik124@gmail.com",    hotkey: "E",   action: () => window.location.href = "mailto:yashpouranik124@gmail.com" },
            ]
        },
        {
            group: "Actions",
            commands: [
                { name: "View Resume",        hint: "Open Google Doc in new tab",   hotkey: "V R", action: () => window.open("https://docs.google.com/document/d/1rK6SaLtP3orhxonM8mJkxzjCMNdicj2lJK_Yn3N8v-g/edit?usp=sharing", "_blank") },
                { name: "Copy Page URL",      hint: "Copy link to clipboard",hotkey: "C",   action: () => { navigator.clipboard.writeText(window.location.href); showToast("Link copied"); } },
                { name: "Portfolio Source",   hint: "View code on GitHub",   hotkey: "S",   action: () => window.open("https://github.com/yash-pouranik/portfolio", "_blank") },
            ]
        }
    ];

    // Flatten for searching
    const allCommands = commandGroups.flatMap(g => g.commands.map(c => ({ ...c, _group: g.group })));

    // ─── Toast ───────────────────────────────────────────────────────────────
    function showToast(message) {
        let toast = document.getElementById("toast-notification");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-notification";
            toast.className = "toast-notification";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2200);
    }

    // ─── Elements ────────────────────────────────────────────────────────────
    const overlay = document.getElementById("command-palette-overlay");
    const input   = document.getElementById("command-input");
    const list    = document.getElementById("command-list");
    const openBtn = document.getElementById("command-btn");

    if (!overlay || !input || !list) return;

    let flatFiltered = [];
    let selectedIdx  = 0;

    // ─── Render ──────────────────────────────────────────────────────────────
    function renderGrouped(groups) {
        list.innerHTML = "";
        flatFiltered = [];

        if (groups.length === 0) {
            list.innerHTML = `<div class="cmd-empty">No results found</div>`;
            return;
        }

        groups.forEach(({ group, commands }) => {
            const label = document.createElement("div");
            label.className = "cmd-group-label";
            label.textContent = group;
            list.appendChild(label);

            commands.forEach(cmd => {
                const idx = flatFiltered.length;
                flatFiltered.push(cmd);

                const item = document.createElement("div");
                item.className = "cmd-item";
                item.dataset.idx = idx;
                item.innerHTML = `
                    <div class="cmd-item-left">
                        <span class="cmd-item-name">${cmd.name}</span>
                        <span class="cmd-item-hint">${cmd.hint}</span>
                    </div>
                    <kbd class="cmd-item-hotkey">${cmd.hotkey}</kbd>
                `;
                item.addEventListener("mouseenter", () => setSelected(idx));
                item.addEventListener("click", () => execute(idx));
                list.appendChild(item);
            });
        });

        setSelected(0);
    }

    function renderFlat(commands) {
        list.innerHTML = "";
        flatFiltered = commands;

        if (!commands.length) {
            list.innerHTML = `<div class="cmd-empty">No results found</div>`;
            return;
        }

        commands.forEach((cmd, idx) => {
            const item = document.createElement("div");
            item.className = "cmd-item";
            item.dataset.idx = idx;
            item.innerHTML = `
                <div class="cmd-item-left">
                    <span class="cmd-item-name">${cmd.name}</span>
                    <span class="cmd-item-hint">${cmd.hint}</span>
                </div>
                <kbd class="cmd-item-hotkey">${cmd.hotkey}</kbd>
            `;
            item.addEventListener("mouseenter", () => setSelected(idx));
            item.addEventListener("click", () => execute(idx));
            list.appendChild(item);
        });

        setSelected(0);
    }

    function setSelected(idx) {
        selectedIdx = idx;
        list.querySelectorAll(".cmd-item").forEach(el => el.classList.remove("selected"));
        const target = list.querySelector(`.cmd-item[data-idx="${idx}"]`);
        if (target) {
            target.classList.add("selected");
            target.scrollIntoView({ block: "nearest" });
        }
    }

    function execute(idx) {
        const cmd = flatFiltered[idx];
        if (cmd) { closePalette(); cmd.action(); }
    }

    // ─── Open / Close ─────────────────────────────────────────────────────
    function openPalette() {
        input.value = "";
        renderGrouped(commandGroups);
        overlay.classList.add("open");
        requestAnimationFrame(() => input.focus());
    }

    function closePalette() {
        overlay.classList.remove("open");
        input.value = "";
    }

    // ─── Events ───────────────────────────────────────────────────────────
    window.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            overlay.classList.contains("open") ? closePalette() : openPalette();
        }
        if (e.key === "Escape" && overlay.classList.contains("open")) closePalette();
    });

    if (openBtn) openBtn.addEventListener("click", openPalette);

    overlay.addEventListener("click", e => { if (e.target === overlay) closePalette(); });

    input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
            renderGrouped(commandGroups);
        } else {
            const filtered = allCommands.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.hint.toLowerCase().includes(q) ||
                c.hotkey.toLowerCase().includes(q)
            );
            renderFlat(filtered);
        }
    });

    input.addEventListener("keydown", e => {
        if (e.key === "ArrowDown") { e.preventDefault(); setSelected(Math.min(selectedIdx + 1, flatFiltered.length - 1)); }
        if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(Math.max(selectedIdx - 1, 0)); }
        if (e.key === "Enter")     { e.preventDefault(); execute(selectedIdx); }
    });
});
