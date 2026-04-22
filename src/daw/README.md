# FL Studio Projects Website - Customization Guide

This guide explains how to update and customize your FL Studio-themed portfolio website.

---

## 📁 File Structure

```
DAWPage/
├── index.html   # HTML structure (rarely needs editing)
├── styles.css   # All styling (~1800 lines)
└── app.js       # All functionality (~1150 lines)
```

---

## 🎹 Adding New FL Projects

All projects are defined in `app.js` in the `state.projects` object (around line 32).

### Step 1: Get Your Google Drive File ID

1. Upload your `.flp` file to Google Drive
2. Right-click → "Share" → "Anyone with the link"
3. Copy the link: `https://drive.google.com/file/d/ABC123XYZ/view?usp=sharing`
4. Your File ID is: `ABC123XYZ`

### Step 2: Add Project to app.js

Open `app.js` and find `state.projects`. Add a new entry:

```javascript
'your_project_id': {
    id: 'your_project_id',           // Unique identifier (lowercase, underscores)
    title: 'Your Track Name',         // Display title
    filename: 'Your_Track.flp',       // Filename shown in downloads
    icon: '🎵',                        // Emoji icon for the card
    description: 'Describe your track here. What genre? What plugins? What vibe?',
    genre: 'Future Bass',             // Genre badge text
    bpm: 150,                          // Beats per minute
    key: 'Fm',                         // Musical key
    tags: ['Future Bass', 'Serum', 'Vocal Chops'],  // Up to 5 tags
    driveLink: 'https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing',
    downloadLink: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',
    fileSize: '45 MB'                  // Approximate file size
},
```

**That's it!** The Projects Panel auto-renders from this object.

---

## 👤 Updating Profile Information

### Bio Text (Notepad Window)

Edit `index.html`, find the `#notepad` section (around line 320):

```html
<div class="fl-window-content notepad-content">
    <p>Hi, I'm <strong>Your Name</strong>.</p>
    <br>
    <p>Your bio text here...</p>
    <br>
    <p>More about you...</p>
    <br>
    <p style="color: #888; font-size: 0.9rem;">📍 Location | 🎓 School/Work</p>
</div>
```

### Page Title and Meta Tags

Edit `index.html`, lines 7-17:

```html
<title>Your Name | FL Studio Projects</title>
<meta name="description" content="Your description for search engines...">
<meta name="keywords" content="Your, Keywords, Here">
<meta name="author" content="Your Name">
```

---

## 🔗 Updating Social Links

Edit `index.html`, find the "Socials (VST)" folder (around line 130):

```html
<div class="file-item" data-link="https://github.com/YOUR_USERNAME" tabindex="0">
    <span class="file-icon">⚫</span>
    <span class="file-name">GitHub.dll</span>
</div>
```

Change the `data-link` URL to your profile URLs.

### Adding New Social Links

Copy an existing `file-item` and modify:

```html
<div class="file-item" data-link="https://soundcloud.com/your-profile" tabindex="0">
    <span class="file-icon">🟠</span>
    <span class="file-name">SoundCloud.dll</span>
</div>
```

---

## 📄 Adding Resume Download

1. Upload your resume PDF to Google Drive
2. Get the direct download link
3. Edit `app.js`, find the resume click handler (around line 795):

```javascript
const resumeFile = $('#resumeFile');
if (resumeFile) {
    resumeFile.addEventListener('click', () => {
        window.open('https://drive.google.com/uc?export=download&id=YOUR_RESUME_ID', '_blank');
    });
}
```

---

## 🎼 Changing the Playlist (Experience Timeline)

Edit `index.html`, find `#playlist` section (around line 170). Each track represents a category:

```html
<div class="timeline-track">
    <div class="track-label">
        <div class="track-color" style="background: #YOUR_COLOR;"></div>
        Category Name
    </div>
    <div class="track-grid">
        <div class="pattern-clip" 
             style="background: linear-gradient(135deg, #COLOR1, #COLOR2); width: 150px;"
             tabindex="0">
            <span class="clip-icon">🎯</span>
            Project Name
            <span class="tooltip">Detailed description for hover</span>
        </div>
    </div>
</div>
```

---

## 🎚️ Changing Skills in Mixer

Edit `app.js`, find `state.skills` (around line 29):

```javascript
skills: [
    'Python', 'Robotics', 'React', 'CAD', 'C++',
    'JavaScript', 'ML/AI', 'Embedded', 'PCB', 'MATLAB'
],
```

Replace with your own skills (max ~10 for best display).

---

## 🎵 Changing the Classical Music

The melody is defined in `app.js` starting at line 238 in `classicalMelody` object.

Each note uses MIDI numbers:
- `60` = Middle C (C4)
- `62` = D4, `64` = E4, etc.

```javascript
melody: [
    { note: 74, duration: 1 },    // Note MIDI number, duration in beats
    { note: 73, duration: 0.5 },  // Half-beat note
    // Add more notes...
],
bpm: 72  // Tempo
```

---

## 🎨 Customizing Colors

Edit `styles.css`, find the `:root` section (lines 1-30):

```css
:root {
    --bg-main: #1a1a1a;           /* Main background */
    --btn-active: #f88c00;         /* Orange accent color */
    --text-bright: #ffffff;        /* Bright text */
    --selection: #7c9c64;          /* Green selection color */
}
```

---

## ⌨️ Keyboard Shortcuts Reference

| Key | Action |
|-----|--------|
| `Space` | Play/Pause music |
| `Enter` | Stop music |
| `Escape` | Close any open panel/modal |
| `Ctrl+B` | Open Bio notepad |

---

## 🚀 Deploying Your Site

### Option 1: GitHub Pages (Free)
1. Create repository on GitHub
2. Upload all files
3. Go to Settings → Pages → Deploy from main branch

### Option 2: Netlify (Free)
1. Drag & drop the `DAWPage` folder to netlify.com/drop

### Option 3: Any Web Host
Upload `index.html`, `styles.css`, and `app.js` to your hosting provider.

---

## Need Help?

- **Projects not showing?** Check the comma after each project in `state.projects`
- **Download not working?** Verify your Google Drive file sharing is set to "Anyone with link"
- **Styling broken?** Make sure you didn't delete any closing braces `}` in CSS
