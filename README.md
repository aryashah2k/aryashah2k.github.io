# Arya Shah — Portfolio

Personal portfolio for [aryashah.me](https://aryashah.me): a landing page, a blog, an interactive
terminal, and an FL-Studio-inspired "Music IDE" — all in pure HTML/CSS/JS, driven by Markdown
content files and deployed to GitHub Pages via a single GitHub Actions workflow.

## Architecture

```
.
├── content/          # ← Edit these Markdown files to update the site
│   ├── site.md           # Global config (name, tagline, nav, socials)
│   ├── about.md          # About Me
│   ├── news.md           # News timeline entries
│   ├── skills.md         # Skills (nested, recursive categories)
│   ├── experience/       # One .md per role
│   ├── education/        # One .md per degree
│   ├── projects/         # One .md per project
│   ├── publications/     # One .md per paper
│   ├── certifications/   # One .md per cert
│   └── blogs/            # One .md per blog post
├── src/              # Templates, design system, page JS
│   ├── index.html        # Landing template with <!-- inject:NAME --> markers
│   ├── blogs/            # Blogs list + post templates
│   ├── terminal/         # Terminal page (wraps legacy interact.js-based shell)
│   ├── daw/              # Music IDE (FL-Studio-inspired)
│   ├── partials/         # head / nav / footer shared fragments
│   ├── styles/           # tokens → base → components → pages/*
│   ├── scripts/          # theme, nav, reveal
│   └── assets/           # img, sounds, fonts
├── scripts/          # Node build tooling (zero SSG framework)
│   ├── build.js          # Orchestrator
│   └── lib/
│       ├── template.js     # Tiny {{handlebars}}-style engine
│       ├── collect.js      # Walks /content and returns structured data
│       └── sections.js     # Renders each landing-page section to HTML
├── .github/workflows/
│   └── deploy.yml        # Build + deploy to GitHub Pages
├── dist/             # Build output (gitignored)
├── CNAME             # aryashah.me
├── .nojekyll         # Disable Jekyll on GitHub Pages
└── package.json
```

## Local development

```bash
npm install
npm run build   # writes dist/
npm run dev     # build + serve dist/ on http://localhost:8080
```

## How to edit content

Every section of the site is driven by a Markdown file with YAML frontmatter.
No HTML editing required.

### Add a blog post
Create `content/blogs/my-post.md`:
```yaml
---
title: My post title
date: 2025-12-01
summary: One-line description shown in the listing.
tags: [research, notes]
---
Post body in **Markdown**. Inline math with `$...$`, display math with `$$...$$`.
```

### Add a project / experience / publication / certification
Drop a new `.md` file in the matching folder under `content/`. Check any existing
file in that folder for the expected frontmatter fields.

### Add a skill subcategory
Edit `content/skills.md`. The layout auto-fits any number of categories and
subcategories — you can never break the grid by adding one.

```yaml
categories:
  - name: New Category
    subcategories:
      - name: Subcategory A
        items: [Tool 1, Tool 2]
```

### Change the nav or socials
Edit `content/site.md` — the `nav` and `socials` arrays drive every page.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`:

1. `npm ci && npm run build` produces `dist/`.
2. `actions/upload-pages-artifact` uploads it.
3. `actions/deploy-pages` publishes to GitHub Pages.

**One-time setup**: in the repo → Settings → Pages, set the source to
**"GitHub Actions"**. The `CNAME` file is copied into `dist/`, so the
`aryashah.me` custom domain keeps working.

## Design system

Defined entirely via CSS variables in [`src/styles/tokens.css`](src/styles/tokens.css).
Change a token and every page — landing, blog, terminal, DAW — picks it up.
The light theme is an overlay; the dark theme is the default.

## Terminal & DAW notes

- **Terminal** — the legacy `interact.js` + custom shell from the old site is
  preserved verbatim under `src/terminal/` with only asset paths updated.
- **DAW** — the FL-Studio-inspired page is preserved verbatim under `src/daw/`;
  the template engine only injects the shared nav and a few site variables.

Both pages share the global design tokens, so toggling theme changes the nav
consistently even inside those immersive experiences.

## License

MIT.
