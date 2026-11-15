# Studio

Empty chassis for the studio page. No project is loaded, and there are no audio files.

## What the page shows

- Channel rack: four wells titled "Empty slot" plus a number. Each subtitle is "No audio file".
- Playlist title is "Playlist". The arrangement says "No pattern loaded".
- Mixer strips are Ch 1 through Ch 10. Faders rest at the bottom detent. Meters stay dark.
- The clock stays at 000:00:00.
- Play is disabled. A click or Space shows "No project loaded" and does not start audio.
- Stop is a no-op that leaves the clock at 000:00:00.
- Bio.txt keeps the site name, tagline, and location.
- Resume opens the notepad and says "Not posted".
- Social rows use the site label and open the real href.

## Do not invent a catalog

Do not add track names, BPM, key, genre, tags, file size, or a download link unless a real audio file is part of the site. Placeholder projects read as a fake discography.

File, Edit, Add, Patterns, and View are disabled on purpose. Minimize and maximize are disabled. They are not commands.

## Files

- `index.html` holds the chassis and the site template fields.
- `styles.css` is studio-only. Do not set a root font size here. The shared nav stays outside the studio reset.
- `app.js` filters empty slots, refuses playback, and settles the faders once on load.

Faders tween to the bottom detent with GSAP when motion is allowed and the library loads. Otherwise they start at rest. Meters are not animated.
