/**
 * FL Studio Portfolio - Enhanced JavaScript
 * Version 2.0
 * 
 * Features:
 * - Draggable window system with z-index management
 * - Web Audio API visualizer
 * - Keyboard shortcuts
 * - Loading screen management
 * - Smooth animations and interactions
 */

// ========================================
// GLOBAL STATE
// ========================================
const state = {
    isPlaying: false,
    bars: 1,
    beats: 1,
    ticks: 0,
    highestZIndex: 100,
    audioContext: null,
    analyser: null,
    oscillators: [],
    animationId: null,
    barsBeatInterval: null,
    cpuHistory: new Array(35).fill(15),
    skills: [
        'Python', 'Robotics', 'React', 'CAD', 'C++',
        'JavaScript', 'ML/AI', 'Embedded', 'PCB', 'MATLAB'
    ],
    // FL Studio Projects with Google Drive download links
    // UPDATE THESE LINKS WITH YOUR ACTUAL GOOGLE DRIVE SHARE LINKS
    projects: {
        'midnight_dreams': {
            id: 'midnight_dreams',
            title: 'Midnight Dreams',
            filename: 'Midnight_Dreams.flp',
            icon: '🌙',
            description: 'Deep house track with atmospheric pads, rolling basslines, and ethereal vocal chops. Features custom-designed synths and layered percussion.',
            genre: 'Deep House',
            bpm: 124,
            key: 'Am',
            tags: ['Deep House', 'Atmospheric', 'Vocal Chops', 'Serum', 'Vital'],
            driveLink: 'https://drive.google.com/file/d/YOUR_FILE_ID_1/view?usp=sharing',
            downloadLink: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_1',
            fileSize: '45 MB'
        },
        'neon_pulse': {
            id: 'neon_pulse',
            title: 'Neon Pulse',
            filename: 'Neon_Pulse.flp',
            icon: '💜',
            description: 'Synthwave/Retrowave production with classic 80s-inspired synths, punchy drums, and arpeggiated melodies. Perfect for studying or late-night drives.',
            genre: 'Synthwave',
            bpm: 118,
            key: 'Dm',
            tags: ['Synthwave', 'Retrowave', '80s', 'Analog', 'Diva'],
            driveLink: 'https://drive.google.com/file/d/YOUR_FILE_ID_2/view?usp=sharing',
            downloadLink: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_2',
            fileSize: '52 MB'
        },
        'crystal_caves': {
            id: 'crystal_caves',
            title: 'Crystal Caves',
            filename: 'Crystal_Caves.flp',
            icon: '💎',
            description: 'Melodic dubstep with intricate sound design, emotional chord progressions, and heavy drops. Features complex automation and layered basses.',
            genre: 'Melodic Dubstep',
            bpm: 150,
            key: 'F#m',
            tags: ['Dubstep', 'Melodic', 'Sound Design', 'Serum', 'OTT'],
            driveLink: 'https://drive.google.com/file/d/YOUR_FILE_ID_3/view?usp=sharing',
            downloadLink: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_3',
            fileSize: '68 MB'
        },
        'golden_hour': {
            id: 'golden_hour',
            title: 'Golden Hour',
            filename: 'Golden_Hour.flp',
            icon: '🌅',
            description: 'Chill lo-fi hip hop beat with warm vinyl textures, jazzy samples, and relaxing vibes. Perfect for studying, working, or unwinding.',
            genre: 'Lo-Fi Hip Hop',
            bpm: 85,
            key: 'Cmaj',
            tags: ['Lo-Fi', 'Hip Hop', 'Chill', 'Vinyl', 'Jazz Samples'],
            driveLink: 'https://drive.google.com/file/d/YOUR_FILE_ID_4/view?usp=sharing',
            downloadLink: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_4',
            fileSize: '32 MB'
        },
        'techno_ritual': {
            id: 'techno_ritual',
            title: 'Techno Ritual',
            filename: 'Techno_Ritual.flp',
            icon: '🔊',
            description: 'Dark, driving techno with hypnotic grooves, industrial textures, and relentless energy. Built for the club.',
            genre: 'Techno',
            bpm: 138,
            key: 'Em',
            tags: ['Techno', 'Dark', 'Industrial', 'Analog', 'Kick Design'],
            driveLink: 'https://drive.google.com/file/d/YOUR_FILE_ID_5/view?usp=sharing',
            downloadLink: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_5',
            fileSize: '41 MB'
        }
    },
    currentProject: null
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ========================================
// LOADING SCREEN
// ========================================
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = $('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 500);
        }
    }, 1200);
}

// ========================================
// DRAGGABLE WINDOW SYSTEM
// ========================================
class DragDrop {
    constructor(element) {
        this.element = element;
        this.header = element.querySelector('.fl-window-header');
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.init();
    }

    init() {
        // Mouse events
        this.header.addEventListener('mousedown', (e) => this.onStart(e));
        document.addEventListener('mousemove', (e) => this.onMove(e));
        document.addEventListener('mouseup', () => this.onEnd());

        // Touch events for mobile
        this.header.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        document.addEventListener('touchend', () => this.onEnd());

        // Bring to front on any click
        this.element.addEventListener('mousedown', () => this.bringToFront());
        this.element.addEventListener('touchstart', () => this.bringToFront(), { passive: true });
    }

    onStart(e) {
        if (e.target.classList.contains('window-btn')) return;

        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.offsetX = this.element.offsetLeft;
        this.offsetY = this.element.offsetTop;
        this.bringToFront();
        this.element.style.transition = 'none';
        e.preventDefault();
    }

    onTouchStart(e) {
        if (e.target.classList.contains('window-btn')) return;

        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.offsetX = this.element.offsetLeft;
        this.offsetY = this.element.offsetTop;
        this.bringToFront();
        this.element.style.transition = 'none';
    }

    onMove(e) {
        if (!this.isDragging) return;

        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;

        const newX = clamp(this.offsetX + dx, 0, window.innerWidth - 100);
        const newY = clamp(this.offsetY + dy, 0, window.innerHeight - 50);

        this.element.style.left = `${newX}px`;
        this.element.style.top = `${newY}px`;
    }

    onTouchMove(e) {
        if (!this.isDragging) return;

        const dx = e.touches[0].clientX - this.startX;
        const dy = e.touches[0].clientY - this.startY;

        const newX = clamp(this.offsetX + dx, 0, window.innerWidth - 100);
        const newY = clamp(this.offsetY + dy, 0, window.innerHeight - 50);

        this.element.style.left = `${newX}px`;
        this.element.style.top = `${newY}px`;

        e.preventDefault();
    }

    onEnd() {
        if (this.isDragging) {
            this.isDragging = false;
            this.element.style.transition = '';
        }
    }

    bringToFront() {
        // Remove focused class from all windows
        $$('.fl-window').forEach(w => w.classList.remove('focused'));

        // Add focused class and update z-index
        state.highestZIndex++;
        this.element.style.zIndex = state.highestZIndex;
        this.element.classList.add('focused');
    }
}

// ========================================
// AUDIO ENGINE - Classical Music (Canon in D)
// ========================================

// Canon in D melody notes with timing (simplified arrangement)
const classicalMelody = {
    // Notes as MIDI numbers, durations in beats
    melody: [
        // Bar 1-2: Canon in D Theme
        { note: 74, duration: 1 },    // D5
        { note: 73, duration: 1 },    // C#5
        { note: 71, duration: 1 },    // B4
        { note: 69, duration: 1 },    // A4
        { note: 67, duration: 1 },    // G4
        { note: 66, duration: 1 },    // F#4
        { note: 67, duration: 1 },    // G4
        { note: 69, duration: 1 },    // A4

        // Bar 3-4
        { note: 74, duration: 0.5 },  // D5
        { note: 73, duration: 0.5 },  // C#5
        { note: 74, duration: 0.5 },  // D5
        { note: 69, duration: 0.5 },  // A4
        { note: 67, duration: 0.5 },  // G4
        { note: 69, duration: 0.5 },  // A4
        { note: 74, duration: 1 },    // D5
        { note: 67, duration: 1 },    // G4

        // Bar 5-6
        { note: 66, duration: 0.5 },  // F#4
        { note: 67, duration: 0.5 },  // G4
        { note: 69, duration: 1 },    // A4
        { note: 66, duration: 0.5 },  // F#4
        { note: 67, duration: 0.5 },  // G4
        { note: 69, duration: 0.5 },  // A4
        { note: 71, duration: 0.5 },  // B4
        { note: 69, duration: 0.5 },  // A4
        { note: 67, duration: 0.5 },  // G4

        // Bar 7-8
        { note: 66, duration: 1 },    // F#4
        { note: 62, duration: 0.5 },  // D4
        { note: 64, duration: 0.5 },  // E4
        { note: 66, duration: 1 },    // F#4
        { note: 66, duration: 0.5 },  // F#4
        { note: 67, duration: 0.5 },  // G4
        { note: 69, duration: 1 },    // A4
    ],
    bass: [
        // Bass line (lower octave)
        { note: 50, duration: 2 },    // D3
        { note: 45, duration: 2 },    // A2
        { note: 47, duration: 2 },    // B2
        { note: 42, duration: 2 },    // F#2
        { note: 43, duration: 2 },    // G2
        { note: 50, duration: 2 },    // D3
        { note: 43, duration: 2 },    // G2
        { note: 45, duration: 2 },    // A2
    ],
    bpm: 72
};

function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}

function initAudio() {
    if (state.audioContext) return;

    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    state.analyser = state.audioContext.createAnalyser();
    state.analyser.fftSize = 64;
    state.analyser.smoothingTimeConstant = 0.8;

    state.masterGain = state.audioContext.createGain();
    state.masterGain.gain.value = 0.3;

    // Reverb simulation with delay
    state.reverbGain = state.audioContext.createGain();
    state.reverbGain.gain.value = 0.2;

    state.analyser.connect(state.masterGain);
    state.masterGain.connect(state.audioContext.destination);

    state.melodyIndex = 0;
    state.bassIndex = 0;
    state.scheduledNotes = [];
}

function createPianoNote(frequency, startTime, duration, velocity = 0.5) {
    const ctx = state.audioContext;

    // Piano-like timbre with multiple harmonics
    const fundamental = ctx.createOscillator();
    const harmonic2 = ctx.createOscillator();
    const harmonic3 = ctx.createOscillator();

    fundamental.type = 'sine';
    harmonic2.type = 'sine';
    harmonic3.type = 'triangle';

    fundamental.frequency.value = frequency;
    harmonic2.frequency.value = frequency * 2;
    harmonic3.frequency.value = frequency * 3;

    // Gain nodes for each harmonic
    const fundGain = ctx.createGain();
    const harm2Gain = ctx.createGain();
    const harm3Gain = ctx.createGain();

    fundGain.gain.value = velocity;
    harm2Gain.gain.value = velocity * 0.3;
    harm3Gain.gain.value = velocity * 0.1;

    // ADSR envelope
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(velocity, startTime + 0.02);  // Attack
    envelope.gain.linearRampToValueAtTime(velocity * 0.7, startTime + 0.1);  // Decay
    envelope.gain.setValueAtTime(velocity * 0.7, startTime + duration - 0.1);  // Sustain
    envelope.gain.linearRampToValueAtTime(0, startTime + duration);  // Release

    // Connect
    fundamental.connect(fundGain);
    harmonic2.connect(harm2Gain);
    harmonic3.connect(harm3Gain);

    fundGain.connect(envelope);
    harm2Gain.connect(envelope);
    harm3Gain.connect(envelope);

    envelope.connect(state.analyser);

    // Schedule
    fundamental.start(startTime);
    harmonic2.start(startTime);
    harmonic3.start(startTime);

    fundamental.stop(startTime + duration + 0.1);
    harmonic2.stop(startTime + duration + 0.1);
    harmonic3.stop(startTime + duration + 0.1);

    return { fundamental, harmonic2, harmonic3 };
}

function scheduleClassicalMusic() {
    if (!state.isPlaying || !state.audioContext) return;

    const ctx = state.audioContext;
    const now = ctx.currentTime;
    const beatDuration = 60 / classicalMelody.bpm;

    // Schedule ahead by 2 seconds
    const scheduleAhead = 2;

    // Initialize scheduling time if needed
    if (!state.nextMelodyTime || state.nextMelodyTime < now) {
        state.nextMelodyTime = now;
        state.nextBassTime = now;
        state.melodyIndex = 0;
        state.bassIndex = 0;
    }

    // Schedule melody notes
    while (state.nextMelodyTime < now + scheduleAhead) {
        const note = classicalMelody.melody[state.melodyIndex];
        const duration = note.duration * beatDuration;

        createPianoNote(
            midiToFreq(note.note),
            state.nextMelodyTime,
            duration,
            0.4
        );

        state.nextMelodyTime += duration;
        state.melodyIndex = (state.melodyIndex + 1) % classicalMelody.melody.length;
    }

    // Schedule bass notes
    while (state.nextBassTime < now + scheduleAhead) {
        const note = classicalMelody.bass[state.bassIndex];
        const duration = note.duration * beatDuration;

        createPianoNote(
            midiToFreq(note.note),
            state.nextBassTime,
            duration,
            0.25
        );

        state.nextBassTime += duration;
        state.bassIndex = (state.bassIndex + 1) % classicalMelody.bass.length;
    }

    // Continue scheduling
    state.musicScheduler = setTimeout(scheduleClassicalMusic, 500);
}

function startAudio() {
    if (!state.audioContext) initAudio();

    if (state.audioContext.state === 'suspended') {
        state.audioContext.resume();
    }

    // Reset timing
    state.nextMelodyTime = null;
    state.nextBassTime = null;

    // Start scheduling classical music
    scheduleClassicalMusic();
}

function stopAudio() {
    if (state.musicScheduler) {
        clearTimeout(state.musicScheduler);
        state.musicScheduler = null;
    }

    // Reset scheduling
    state.nextMelodyTime = null;
    state.nextBassTime = null;
}

// ========================================
// MIXER VISUALIZATION
// ========================================
function createMixerChannels() {
    const container = $('#mixerContainer');
    if (!container) return;

    container.innerHTML = '';

    state.skills.forEach((skill, index) => {
        const channel = document.createElement('div');
        channel.className = 'mixer-channel';
        channel.innerHTML = `
            <div class="channel-label">${skill}</div>
            <div class="channel-meter">
                <div class="meter-fill" id="meter${index}" style="height: 15%;"></div>
                <div class="meter-segments"></div>
            </div>
            <div class="channel-fader">
                <div class="fader-knob"></div>
            </div>
            <div class="channel-number">${index + 1}</div>
        `;
        container.appendChild(channel);
    });
}

function updateVisualizer() {
    if (!state.analyser) {
        state.animationId = requestAnimationFrame(updateVisualizer);
        return;
    }

    const bufferLength = state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    state.analyser.getByteFrequencyData(dataArray);

    state.skills.forEach((_, index) => {
        const meter = $(`#meter${index}`);
        if (meter) {
            let value = dataArray[index % bufferLength] || 0;

            // Add some baseline movement even when not playing
            if (!state.isPlaying) {
                value = 10 + Math.sin(Date.now() / 500 + index) * 8;
            } else {
                // Boost visualization for visual impact
                value = Math.min(255, value * 1.5);
            }

            const height = clamp((value / 255) * 100, 5, 100);
            meter.style.height = `${height}%`;
        }
    });

    state.animationId = requestAnimationFrame(updateVisualizer);
}

// ========================================
// LCD DISPLAY
// ========================================
function updateLCD() {
    const lcdTime = $('#lcdTime');
    if (!lcdTime) return;

    state.ticks += 12;
    if (state.ticks >= 96) {
        state.ticks = 0;
        state.beats++;
        if (state.beats > 4) {
            state.beats = 1;
            state.bars++;
            if (state.bars > 999) state.bars = 1;
        }
    }

    const display = `${String(state.bars).padStart(3, '0')}:${String(state.beats).padStart(2, '0')}:${String(state.ticks).padStart(2, '0')}`;
    lcdTime.textContent = display;
}

function resetLCD() {
    state.bars = 1;
    state.beats = 1;
    state.ticks = 0;
    const lcdTime = $('#lcdTime');
    if (lcdTime) {
        lcdTime.textContent = '001:01:00';
        lcdTime.classList.remove('playing');
    }
}

// ========================================
// CPU GRAPH
// ========================================
function updateCPUGraph() {
    const canvas = $('#cpuGraph');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Add new value based on playing state
    if (state.isPlaying) {
        state.cpuHistory.push(25 + Math.random() * 55 + Math.sin(Date.now() / 200) * 10);
    } else {
        state.cpuHistory.push(8 + Math.random() * 12);
    }
    state.cpuHistory.shift();

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw graph line
    ctx.beginPath();
    ctx.strokeStyle = state.isPlaying ? '#44ff66' : '#448844';
    ctx.lineWidth = 1.5;

    const width = canvas.width;
    const height = canvas.height;

    state.cpuHistory.forEach((val, i) => {
        const x = (i / (state.cpuHistory.length - 1)) * width;
        const y = height - (clamp(val, 0, 100) / 100) * (height - 2);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Add glow effect when playing
    if (state.isPlaying) {
        ctx.strokeStyle = 'rgba(68, 255, 102, 0.3)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

// ========================================
// TRANSPORT CONTROLS
// ========================================
function play() {
    if (state.isPlaying) return;

    state.isPlaying = true;

    const playBtn = $('#playBtn');
    const stopBtn = $('#stopBtn');
    const lcdTime = $('#lcdTime');

    if (playBtn) playBtn.classList.add('active');
    if (stopBtn) stopBtn.classList.remove('active');
    if (lcdTime) lcdTime.classList.add('playing');

    startAudio();
    state.barsBeatInterval = setInterval(updateLCD, 50);
}

function stop() {
    if (!state.isPlaying) return;

    state.isPlaying = false;

    const playBtn = $('#playBtn');
    const stopBtn = $('#stopBtn');

    if (stopBtn) {
        stopBtn.classList.add('active');
        setTimeout(() => stopBtn.classList.remove('active'), 200);
    }
    if (playBtn) playBtn.classList.remove('active');

    stopAudio();
    clearInterval(state.barsBeatInterval);
    resetLCD();
}

function togglePlayback() {
    if (state.isPlaying) {
        stop();
    } else {
        play();
    }
}

// ========================================
// DOWNLOAD MODAL
// ========================================
function openDownloadModal(projectId) {
    const project = state.projects[projectId];
    if (!project) {
        showNotification('Project not found', 'error');
        return;
    }

    state.currentProject = project;

    const modal = $('#downloadModal');
    if (!modal) {
        createDownloadModal();
    }

    updateDownloadModal(project);
    $('#downloadModal').classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function closeDownloadModal() {
    const modal = $('#downloadModal');
    if (modal) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
        state.currentProject = null;
    }
}

function createDownloadModal() {
    const modalHTML = `
        <div class="modal-overlay" id="downloadModal">
            <div class="download-modal">
                <div class="modal-header">
                    <div class="modal-title">
                        <span class="modal-title-icon" id="modalIcon">🎵</span>
                        <span id="modalTitle">Project Name</span>
                    </div>
                    <button class="modal-close" id="closeModal" aria-label="Close">×</button>
                </div>
                <div class="modal-body">
                    <div class="project-info">
                        <p class="project-description" id="modalDescription">Project description here...</p>
                        <div class="project-tags" id="modalTags"></div>
                    </div>
                    <div class="download-section">
                        <div class="download-section-title">Download Project</div>
                        <div class="download-buttons">
                            <a href="#" class="download-btn" id="downloadDirect" target="_blank">
                                <span class="download-btn-icon">⬇️</span>
                                <span class="download-btn-text">Direct Download (.flp)</span>
                                <span class="download-btn-size" id="downloadSize">-- MB</span>
                            </a>
                            <a href="#" class="download-btn secondary" id="downloadDrive" target="_blank">
                                <span class="download-btn-icon">📁</span>
                                <span class="download-btn-text">Open in Google Drive</span>
                                <span class="download-btn-size">Preview & Download</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners
    $('#closeModal').addEventListener('click', closeDownloadModal);
    $('#downloadModal').addEventListener('click', (e) => {
        if (e.target.id === 'downloadModal') {
            closeDownloadModal();
        }
    });
}

function updateDownloadModal(project) {
    $('#modalIcon').textContent = project.icon;
    $('#modalTitle').textContent = `${project.title} - ${project.genre}`;
    $('#modalDescription').textContent = project.description;
    $('#downloadSize').textContent = project.fileSize;

    // Update tags
    const tagsContainer = $('#modalTags');
    tagsContainer.innerHTML = project.tags.map(tag =>
        `<span class="project-tag">${tag}</span>`
    ).join('');

    // Add BPM and Key as tags
    tagsContainer.innerHTML += `
        <span class="project-tag">${project.bpm} BPM</span>
        <span class="project-tag">Key: ${project.key}</span>
    `;

    // Update download links
    $('#downloadDirect').href = project.downloadLink;
    $('#downloadDrive').href = project.driveLink;
}

// ========================================
// FILE BROWSER
// ========================================
function initFileBrowser() {
    // Folder toggle
    $$('.folder-header').forEach(header => {
        header.addEventListener('click', () => {
            const folder = header.parentElement;
            folder.classList.toggle('open');
        });
    });

    // File selection and download modal
    $$('.file-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();

            // Update selection state
            $$('.file-item').forEach(f => f.classList.remove('selected'));
            item.classList.add('selected');

            // Handle external links (social)
            const link = item.dataset.link;
            if (link) {
                window.open(link, '_blank', 'noopener');
                return;
            }

            // Handle project download modal
            const projectId = item.dataset.project;
            if (projectId && state.projects[projectId]) {
                openDownloadModal(projectId);
                return;
            }
        });
    });

    // Bio file opens notepad
    const bioFile = $('#bioFile');
    if (bioFile) {
        bioFile.addEventListener('click', openNotepad);
    }

    // Resume download
    const resumeFile = $('#resumeFile');
    if (resumeFile) {
        resumeFile.addEventListener('click', () => {
            // In production, update this to your actual resume link
            showNotification('Resume download coming soon!', 'info');
        });
    }

    // Open Projects Panel button
    const openProjectsBtn = $('#openProjectsPanel');
    if (openProjectsBtn) {
        openProjectsBtn.addEventListener('click', openProjectsPanel);
    }
}

// ========================================
// PROJECTS PANEL
// ========================================
function openProjectsPanel() {
    const panel = $('#projectsPanel');
    if (panel) {
        panel.style.display = 'block';
        panel.classList.add('visible');

        // Bring to front
        state.highestZIndex++;
        panel.style.zIndex = state.highestZIndex;
        panel.classList.add('focused');

        // Remove focused from other windows
        $$('.fl-window').forEach(w => {
            if (w !== panel) w.classList.remove('focused');
        });

        // Render projects if not already done
        renderProjectsGrid();

        // Focus search input
        setTimeout(() => {
            $('#projectsSearchInput')?.focus();
        }, 100);
    }
}

function closeProjectsPanel() {
    const panel = $('#projectsPanel');
    if (panel) {
        panel.classList.remove('visible');
        panel.style.display = 'none';
    }
}

function renderProjectsGrid(filter = '') {
    const grid = $('#projectsGrid');
    const countEl = $('#projectsCount');
    if (!grid) return;

    const projects = Object.values(state.projects);
    const filterLower = filter.toLowerCase().trim();

    // Filter projects
    const filtered = projects.filter(project => {
        if (!filterLower) return true;

        return (
            project.title.toLowerCase().includes(filterLower) ||
            project.genre.toLowerCase().includes(filterLower) ||
            project.description.toLowerCase().includes(filterLower) ||
            project.tags.some(tag => tag.toLowerCase().includes(filterLower)) ||
            project.key.toLowerCase().includes(filterLower) ||
            String(project.bpm).includes(filterLower)
        );
    });

    // Update count
    if (countEl) {
        countEl.textContent = filtered.length;
    }

    // No results
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="projects-no-results">
                <div class="projects-no-results-icon">🔍</div>
                <p>No projects found matching "${filter}"</p>
            </div>
        `;
        return;
    }

    // Render project cards
    grid.innerHTML = filtered.map(project => `
        <div class="project-card" data-project-id="${project.id}" tabindex="0">
            <button class="project-card-download" title="Download" data-download="${project.id}">⬇</button>
            <div class="project-card-header">
                <div class="project-card-icon">${project.icon}</div>
                <div class="project-card-title">${project.title}</div>
            </div>
            <div class="project-card-genre">${project.genre}</div>
            <div class="project-card-meta">
                <span>🎵 ${project.bpm} BPM</span>
                <span>🎹 ${project.key}</span>
                <span>📁 ${project.fileSize}</span>
            </div>
            <div class="project-card-tags">
                ${project.tags.slice(0, 3).map(tag =>
        `<span class="project-card-tag">${tag}</span>`
    ).join('')}
            </div>
        </div>
    `).join('');

    // Add click handlers
    grid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if download button was clicked
            if (e.target.classList.contains('project-card-download')) return;

            const projectId = card.dataset.projectId;
            if (projectId) {
                openDownloadModal(projectId);
            }
        });
    });

    // Download button handlers
    grid.querySelectorAll('.project-card-download').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = btn.dataset.download;
            if (projectId) {
                openDownloadModal(projectId);
            }
        });
    });
}

function initProjectsPanel() {
    // Close button
    const closeBtn = $('#closeProjectsPanel');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProjectsPanel);
    }

    // Search input
    const searchInput = $('#projectsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderProjectsGrid(e.target.value);
        });

        // Clear on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (searchInput.value) {
                    searchInput.value = '';
                    renderProjectsGrid();
                    e.stopPropagation();
                }
            }
        });
    }

    // Make panel draggable
    const panel = $('#projectsPanel');
    if (panel) {
        new DragDrop(panel);

        // Initial render
        renderProjectsGrid();
    }
}

// ========================================
// NOTEPAD WINDOW
// ========================================
function openNotepad() {
    const notepad = $('#notepad');
    if (notepad) {
        notepad.classList.add('visible');
        notepad.style.display = 'block';

        // Bring to front
        state.highestZIndex++;
        notepad.style.zIndex = state.highestZIndex;
        notepad.classList.add('focused');

        // Remove focused from other windows
        $$('.fl-window').forEach(w => {
            if (w !== notepad) w.classList.remove('focused');
        });
    }
}

function closeNotepad() {
    const notepad = $('#notepad');
    if (notepad) {
        notepad.classList.remove('visible');
        setTimeout(() => {
            notepad.style.display = 'none';
        }, 200);
    }
}

// ========================================
// NOTIFICATIONS
// ========================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(45, 45, 45, 0.95);
        border: 1px solid ${type === 'info' ? '#f88c00' : '#7c9c64'};
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayback();
                break;
            case 'Enter':
                e.preventDefault();
                stop();
                break;
            case 'Escape':
                closeNotepad();
                closeDownloadModal();
                closeProjectsPanel();
                break;
            case 'KeyB':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    openNotepad();
                }
                break;
        }
    });
}

// ========================================
// WINDOW RESIZE HANDLER
// ========================================
function handleResize() {
    // Ensure windows stay within viewport
    $$('.fl-window').forEach(window => {
        const rect = window.getBoundingClientRect();

        if (rect.right > window.innerWidth) {
            window.style.left = `${window.innerWidth - rect.width - 20}px`;
        }
        if (rect.bottom > window.innerHeight) {
            window.style.top = `${window.innerHeight - rect.height - 20}px`;
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================
function init() {
    // Initialize draggable windows
    const playlist = $('#playlist');
    const mixer = $('#mixer');
    const notepad = $('#notepad');

    if (playlist) new DragDrop(playlist);
    if (mixer) new DragDrop(mixer);
    if (notepad) new DragDrop(notepad);

    // Create mixer channels
    createMixerChannels();

    // Initialize file browser
    initFileBrowser();

    // Setup close button for notepad
    const closeNotepadBtn = $('#closeNotepad');
    if (closeNotepadBtn) {
        closeNotepadBtn.addEventListener('click', closeNotepad);
    }

    // Setup transport controls
    const playBtn = $('#playBtn');
    const stopBtn = $('#stopBtn');

    if (playBtn) playBtn.addEventListener('click', play);
    if (stopBtn) stopBtn.addEventListener('click', stop);

    // Initialize keyboard shortcuts
    initKeyboardShortcuts();

    // Initialize Projects Panel
    initProjectsPanel();

    // Start visualizer and CPU graph loops
    updateVisualizer();
    setInterval(updateCPUGraph, 80);

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Hide loading screen
    hideLoadingScreen();

    // Initial CPU graph draw
    updateCPUGraph();

    console.log('🎹 FL Studio Portfolio initialized');
    console.log('Keyboard shortcuts: Space (play/pause), Enter (stop), Escape (close windows)');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
