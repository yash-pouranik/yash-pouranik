document.addEventListener("DOMContentLoaded", () => {
    // --- Define commands ---
    const commands = [
        { name: "Home", hotkey: "G H", action: () => window.location.href = "/" },
        { name: "About", hotkey: "G A", action: () => window.location.href = "/about" },
        { name: "Projects", hotkey: "G P", action: () => window.location.href = "/projects" },
        { name: "Devlog", hotkey: "G D", action: () => window.location.href = "/urbackend/devlog" },
        { name: "Send Email", hotkey: "E", action: () => window.location.href = "mailto:yashpouranik124@gmail.com" },
        { name: "View Source", hotkey: "S", action: () => window.location.href = "https://github.com/yash-pouranik/portfolio" },
        { name: "Copy Link", hotkey: "L", action: () => navigator.clipboard.writeText(window.location.href) },
    ];

    // --- Get Elements ---
    const overlay = document.getElementById("command-palette-overlay");
    const palette = document.getElementById("command-palette");
    const input = document.getElementById("command-input");
    const list = document.getElementById("command-list");
    const openBtn = document.getElementById("command-btn");

    // --- Functions ---
    function openPalette() {
        renderCommands(commands);
        overlay.style.display = "flex";
        input.focus();
    }

    function closePalette() {
        overlay.style.display = "none";
        input.value = "";
    }

    function renderCommands(commandsToRender) {
        list.innerHTML = ""; // Clear list
        commandsToRender.forEach((cmd, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${cmd.name} <kbd>${cmd.hotkey}</kbd>`;
            li.tabIndex = 0; // Make it focusable
            li.dataset.index = index;
            if (index === 0) {
                li.classList.add("selected"); // Select first item
            }
            li.addEventListener("click", cmd.action);
            list.appendChild(li);
        });
    }

    function filterCommands() {
        const query = input.value.toLowerCase();
        const filtered = commands.filter(cmd => cmd.name.toLowerCase().includes(query));
        renderCommands(filtered);
    }

    function getSelected() {
        return list.querySelector("li.selected");
    }

    function selectNext() {
        const selected = getSelected();
        if (selected && selected.nextElementSibling) {
            selected.classList.remove("selected");
            selected.nextElementSibling.classList.add("selected");
            selected.nextElementSibling.scrollIntoView({ block: "nearest" });
        }
    }

    function selectPrev() {
        const selected = getSelected();
        if (selected && selected.previousElementSibling) {
            selected.classList.remove("selected");
            selected.previousElementSibling.classList.add("selected");
            selected.previousElementSibling.scrollIntoView({ block: "nearest" });
        }
    }

    function runSelected() {
        const selected = getSelected();
        if (selected) {
            const index = selected.dataset.index;
            const query = input.value.toLowerCase();
            // Find the original command from the filtered list
            const filtered = commands.filter(cmd => cmd.name.toLowerCase().includes(query));
            const commandToRun = filtered[index];
            if (commandToRun) {
                commandToRun.action();
                closePalette();
            }
        }
    }

    // --- Event Listeners ---

    // 1. Global keydown (Ctrl+K)
    window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault(); // Prevent browser's "Search" shortcut
            if (overlay.style.display === "flex") {
                closePalette();
            } else {
                openPalette();
            }
        }

        // Close on Escape
        if (e.key === "Escape" && overlay.style.display === "flex") {
            closePalette();
        }
    });

    // 2. Open button click
    openBtn.addEventListener("click", openPalette);

    // 3. Close on overlay click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) { // Only if clicking the background
            closePalette();
        }
    });

    // 4. Input field filtering
    input.addEventListener("input", filterCommands);

    // 5. Input keydown (Enter, Up, Down)
    input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectNext();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectPrev();
        } else if (e.key === "Enter") {
            e.preventDefault();
            runSelected();
        }
    });

});