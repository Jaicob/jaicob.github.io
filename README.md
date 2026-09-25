# jaicob.com

Personal notebook hosted on GitHub Pages. Vite bundles vanilla JavaScript,
Tailwind CSS, and Markdown rendered with Marked. There is no backend or AI service
running in the site.

## Run locally

Use Node.js 24, also recorded in `.nvmrc` for version managers and CI.

```sh
nvm use
npm ci
npm run dev
```

To check a production build:

```sh
npm run build
npm run preview
```

`nvm` is optional if Node.js 24 is already installed. Vite prints the local URL.
There is no automated test suite. Check that the notes expand and collapse and
that the page fits both desktop and mobile screens after UI changes.

## Files that drive the site

- `index.html` sets metadata, the favicon, and Google Fonts fallbacks.
- `src/main.js` renders the page and its note accordion.
- `src/styles/main.css` defines styles and local font faces.
- Every `Notes/*.md` file becomes a public note at build time. Its first heading
  supplies the title; frontmatter supplies `keywords` and `type`. Keep private
  notes outside this directory. The entire "Notes on AI" section is omitted when
  there are no Markdown files. Adding a new note restores it on the next build.
- `public/portrait.png` is both the portrait and favicon. `public/CNAME` preserves
  the custom domain. Vite copies all of `public/` into `dist/`.

## Fonts and deployment

Local builds can use the Google Fonts fallbacks. To match production typography,
copy these licensed font files from your local `Fonts/` folder or private font
repository into `public/fonts/`:

- `PPMondwest-Regular.otf`
- `PPMori-Regular.otf`
- `PPMori-Semibold.otf`

Both font directories are ignored by Git. CI downloads the three files from
`Jaicob/fonts` using the repository secret `FONTS_TOKEN`. That token needs read
access to the font repository. The deployed font files are publicly downloadable
as website assets even though their source repository is private.

`.github/workflows/deploy.yml` builds pushes to `master` and supports manual runs.
It uploads `dist/` to GitHub Pages; GitHub Pages must use GitHub Actions as its
publishing source. A failed font download stops deployment.

## AI configuration

`AGENTS.md` contains shared project instructions. `CLAUDE.md` imports it for
Claude Code. `.claude/settings.local.json` contains this machine's Claude command
permissions and is intentionally ignored; it is not needed to build the site.
There are no repository MCP server configs, AI hooks, or model API integrations.
