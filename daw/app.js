/**
 * Empty studio chassis.
 * No project is loaded. Play must not start audio or move the clock.
 */

const STACKED_QUERY = "(max-width: 899px)";

const ui = {
    z: 20,
    bioMarkup: ""
};

function byId(id) {
    return document.getElementById(id);
}

function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function stackedLayout() {
    return window.matchMedia(STACKED_QUERY).matches;
}

function isTypingTarget(target) {
    if (!(target instanceof Element)) return false;
    const tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function isActivator(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest("a, button, input, textarea, select, summary, [role='button']"));
}

function hideLoadingScreen() {
    const screen = document.querySelector(".loading-screen");
    if (!screen) return;
    if (reducedMotion()) {
        screen.remove();
        return;
    }
    window.setTimeout(() => {
        screen.classList.add("is-done");
        window.setTimeout(() => screen.remove(), 420);
    }, 980);
}

function bringToFront(element) {
    if (!element) return;
    ui.z += 1;
    element.style.zIndex = String(ui.z);
    document.querySelectorAll(".fl-window").forEach((windowEl) => {
        windowEl.classList.toggle("is-focused", windowEl === element);
    });
}

function clearDockStyles(element) {
    element.style.position = "";
    element.style.left = "";
    element.style.top = "";
    element.style.width = "";
    element.style.height = "";
}

class DragDrop {
    constructor(element) {
        this.element = element;
        this.header = element.querySelector(".fl-window-header");
        this.isDragging = false;
        this.parent = null;
        this.dx = 0;
        this.dy = 0;
        if (!this.header) return;

        this.header.addEventListener("pointerdown", (event) => this.onStart(event));
        window.addEventListener("pointermove", (event) => this.onMove(event));
        window.addEventListener("pointerup", () => this.onEnd());
        window.addEventListener("pointercancel", () => this.onEnd());
    }

    onStart(event) {
        if (stackedLayout()) return;
        if (event.button != null && event.button !== 0) return;
        if (event.target instanceof Element && event.target.closest("button, a, input, textarea")) return;

        const parent = this.element.offsetParent || this.element.parentElement;
        if (!parent) return;

        const rect = this.element.getBoundingClientRect();
        this.parent = parent;
        this.isDragging = true;
        this.dx = event.clientX - rect.left;
        this.dy = event.clientY - rect.top;
        this.element.style.position = "absolute";
        this.element.style.width = `${rect.width}px`;
        this.element.style.height = `${rect.height}px`;
        this.place(event.clientX, event.clientY);
        bringToFront(this.element);

        if (this.header.setPointerCapture) {
            try {
                this.header.setPointerCapture(event.pointerId);
            } catch (error) {
                /* Pointer capture is optional. Drag still follows pointermove. */
            }
        }
        event.preventDefault();
    }

    place(clientX, clientY) {
        const parent = this.parent;
        if (!parent) return;
        const parentRect = parent.getBoundingClientRect();
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
        const maxX = Math.max(0, parent.clientWidth - width);
        const maxY = Math.max(0, parent.clientHeight - height);
        const x = Math.min(Math.max(0, clientX - parentRect.left - this.dx + parent.scrollLeft), maxX);
        const y = Math.min(Math.max(0, clientY - parentRect.top - this.dy + parent.scrollTop), maxY);
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    onMove(event) {
        if (!this.isDragging) return;
        this.place(event.clientX, event.clientY);
    }

    onEnd() {
        this.isDragging = false;
    }
}

function settleFaders() {
    const knobs = document.querySelectorAll(".fader-knob");
    knobs.forEach((knob) => {
        knob.style.top = "auto";
        knob.style.bottom = "0px";
    });
    if (!knobs.length || reducedMotion() || typeof window.gsap === "undefined") return;

    window.gsap.fromTo(knobs, { bottom: 16 }, {
        bottom: 0,
        duration: 0.55,
        ease: "power2.out",
        overwrite: true,
        onComplete() {
            window.gsap.killTweensOf(knobs);
        }
    });
}

function setClock() {
    const lcd = byId("lcdTime");
    if (lcd) lcd.textContent = "000:00:00";
}

function resetClock() {
    setClock();
    const stopBtn = byId("stopBtn");
    if (!stopBtn) return;
    stopBtn.classList.add("is-down");
    window.setTimeout(() => stopBtn.classList.remove("is-down"), 160);
}

function refusePlayback() {
    const status = byId("transportStatus");
    if (!status) return;
    status.textContent = "";
    window.requestAnimationFrame(() => {
        status.textContent = "No project loaded";
    });
}

function slotCountLabel(count) {
    return count === 1 ? "1 empty slot" : `${count} empty slots`;
}

function filterSlots(rawQuery) {
    const grid = byId("slotsGrid");
    const count = byId("slotsCount");
    if (!grid) return;

    const query = String(rawQuery || "").trim().toLowerCase();
    const cards = grid.querySelectorAll(".slot-card");
    let shown = 0;

    cards.forEach((card) => {
        const haystack = (card.getAttribute("data-slot") || "").toLowerCase();
        const match = !query || haystack.includes(query);
        card.hidden = !match;
        if (match) shown += 1;
    });

    if (count) count.textContent = slotCountLabel(shown);

    let note = grid.querySelector(".slots-nomatch");
    if (shown === 0) {
        if (!note) {
            note = document.createElement("p");
            note.className = "slots-nomatch";
            grid.appendChild(note);
        }
        note.textContent = "No empty slots match";
        note.hidden = false;
    } else if (note) {
        note.hidden = true;
    }
}

function openChannelRack() {
    const panel = byId("channelRack");
    if (!panel) return;
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    bringToFront(panel);
    const search = byId("slotsSearch");
    if (search) search.focus();
}

function closeChannelRack() {
    const panel = byId("channelRack");
    if (!panel) return;
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
}

function openNotepad(mode) {
    const notepad = byId("notepad");
    const title = byId("notepadTitle");
    const body = byId("notepadBody");
    if (!notepad || !title || !body) return;

    if (mode === "resume") {
        title.textContent = "Resume";
        body.textContent = "Not posted";
    } else {
        title.textContent = "Bio.txt";
        body.innerHTML = ui.bioMarkup;
    }

    notepad.classList.add("is-open");
    notepad.setAttribute("aria-hidden", "false");
    bringToFront(notepad);
    const closeBtn = byId("closeNotepad");
    if (closeBtn) closeBtn.focus();
}

function closeNotepad() {
    const notepad = byId("notepad");
    if (!notepad) return;
    notepad.classList.remove("is-open");
    notepad.setAttribute("aria-hidden", "true");
}

function selectFile(item) {
    document.querySelectorAll(".file-item").forEach((row) => {
        row.classList.toggle("is-selected", row === item);
    });
}

function initFileBrowser() {
    document.querySelectorAll(".folder-header").forEach((header) => {
        header.addEventListener("click", () => {
            const folder = header.closest(".folder");
            if (!folder) return;
            const open = !folder.classList.contains("open");
            folder.classList.toggle("open", open);
            header.setAttribute("aria-expanded", open ? "true" : "false");
        });
    });

    document.querySelectorAll(".file-item").forEach((item) => {
        item.addEventListener("click", () => {
            selectFile(item);
            const link = item.getAttribute("data-link");
            if (link && item.tagName !== "A") {
                window.open(link, "_blank", "noopener,noreferrer");
            }
        });
    });

    const openSlots = byId("openSlots");
    if (openSlots) openSlots.addEventListener("click", openChannelRack);

    const bioFile = byId("bioFile");
    if (bioFile) bioFile.addEventListener("click", () => openNotepad("bio"));

    const resumeFile = byId("resumeFile");
    if (resumeFile) resumeFile.addEventListener("click", () => openNotepad("resume"));
}

function initSlots() {
    const form = byId("slotsSearchForm");
    const search = byId("slotsSearch");
    if (form) {
        form.addEventListener("submit", (event) => event.preventDefault());
    }
    if (search) {
        search.addEventListener("input", () => filterSlots(search.value));
        search.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && search.value) {
                search.value = "";
                filterSlots("");
                event.stopPropagation();
            }
        });
    }
    const closeBtn = byId("closeChannelRack");
    if (closeBtn) closeBtn.addEventListener("click", closeChannelRack);
    filterSlots("");
}

function initTransport() {
    const playBtn = byId("playBtn");
    const stopBtn = byId("stopBtn");

    if (playBtn) {
        playBtn.setAttribute("aria-disabled", "true");
        playBtn.addEventListener("click", (event) => {
            event.preventDefault();
            refusePlayback();
        });
        playBtn.addEventListener("keydown", (event) => {
            if (event.code === "Space" || event.code === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                refusePlayback();
            }
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener("click", (event) => {
            event.preventDefault();
            resetClock();
        });
    }
}

function initKeyboard() {
    document.addEventListener("keydown", (event) => {
        try {
            const target = event.target;
            if (isTypingTarget(target)) return;

            if (event.code === "Space") {
                const onPlay = target instanceof Element && target.closest("#playBtn");
                if (onPlay) {
                    event.preventDefault();
                    return;
                }
                if (!isActivator(target)) {
                    event.preventDefault();
                    refusePlayback();
                }
                return;
            }

            if (event.code === "Enter" && !isActivator(target)) {
                event.preventDefault();
                resetClock();
                return;
            }

            if (event.code === "Escape") {
                closeNotepad();
                return;
            }

            if ((event.ctrlKey || event.metaKey) && event.code === "KeyB") {
                event.preventDefault();
                openNotepad("bio");
            }
        } catch (error) {
            if (event.code === "Space") event.preventDefault();
        }
    });
}

function initWindows() {
    ["playlist", "mixer", "channelRack", "notepad"].forEach((id) => {
        const element = byId(id);
        if (element) new DragDrop(element);
    });

    const closeNotepadBtn = byId("closeNotepad");
    if (closeNotepadBtn) closeNotepadBtn.addEventListener("click", closeNotepad);

    window.addEventListener("resize", () => {
        if (!stackedLayout()) return;
        document.querySelectorAll(".fl-window").forEach((element) => {
            clearDockStyles(element);
        });
    });
}

function init() {
    const body = byId("notepadBody");
    ui.bioMarkup = body ? body.innerHTML : "";

    initWindows();
    initFileBrowser();
    initSlots();
    initTransport();
    initKeyboard();
    settleFaders();
    setClock();
    hideLoadingScreen();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
