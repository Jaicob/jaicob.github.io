# Project instructions

This is Jaicob's personal website at jaicob.com. Keep it a small, single-page
static site using vanilla JavaScript, Vite, Tailwind CSS, and Marked.

## Source and content

- `src/main.js` imports every `Notes/*.md` file at build time and renders it in
  the public site. These files are published content, not private reference notes.
- Preserve the author's prose, project claims, and `type: original` or
  `type: summary` labels unless the user requests content changes. Do not infer
  that a project is abandoned from the age of its note.
- The frontmatter parser supports simple single-line values and bracketed,
  comma-separated `keywords`. It is not a full YAML parser.
- Marked output goes into `innerHTML`. Only repository-controlled, trusted notes
  belong here. Add sanitization before accepting external or user-submitted text.
- `src/styles/main.css` holds the styling. `public/` is copied into the deployed
  site, including `CNAME` and the portrait used for both the page and favicon.

## Development and checks

- Use the Node version in `.nvmrc`, then `npm ci` and `npm run dev`.
- Run `npm run build` after changes. For rendering or interaction changes, preview
  the site and check note expansion/collapse at desktop and mobile widths.
- There is no automated test suite. Playwright is available for browser checks.
- Keep `package-lock.json` in sync with dependency changes.

## Deployment and local files

- GitHub Actions builds and deploys pushes to `master` to GitHub Pages.
- CI uses `FONTS_TOKEN` to fetch three fonts from `Jaicob/fonts`. Never commit
  tokens, `.env` files, private font sources, or local AI permission settings.
- `Fonts/` is an optional local source folder. Only fonts copied into
  `public/fonts/` reach the site. Both folders are ignored by Git.
- Keep generated build and browser-test output out of commits.
