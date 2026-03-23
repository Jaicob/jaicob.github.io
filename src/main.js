import './styles/main.css';
import { marked } from 'marked';

// Import all md files from Notes/ at build time
const noteModules = import.meta.glob('/Notes/*.md', { query: '?raw', import: 'default', eager: true });

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*\[(.+)]\s*$/);
    if (kv) {
      meta[kv[1]] = kv[2].split(',').map((s) => s.trim());
    } else {
      const simple = line.match(/^(\w+):\s*(.+)$/);
      if (simple) meta[simple[1]] = simple[2];
    }
  }
  return { meta, body: match[2] };
}

function extractTitle(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

function extractStatus(body) {
  const match = body.match(/##\s+(?:Current\s+)?[Ss]tatus\s*\n+([\s\S]*?)(?=\n##|\n*$)/);
  return match ? match[1].trim().replace(/^[\s\S]*?—\s*/, '').split('.')[0].trim() : null;
}

function getBodyWithoutTitle(body) {
  // Remove the first # heading — it's used as the project title
  return body.replace(/^\s*#\s+.+\s*\n*/, '');
}

// Build project list from md files
const projects = Object.entries(noteModules).map(([path, raw]) => {
  const { meta, body } = parseFrontmatter(raw);
  const title = extractTitle(body);
  const status = extractStatus(body);
  const content = getBodyWithoutTitle(body);
  return {
    title,
    keywords: meta.keywords || [],
    type: meta.type || 'original',
    status,
    html: marked.parse(content),
  };
});

function renderProjects() {
  return projects
    .map(
      (p, i) => `
    <article class="project-item fade-up" style="--delay: ${200 + i * 100}ms">
      <div class="project-header">
        <div>
          <h3 class="project-title">${p.title}</h3>
          <div class="project-tags">
            ${p.keywords.map((k) => `<span class="keyword-tag">${k}</span>`).join('')}
            <span class="note-type-tag ${p.type}">${p.type === 'summary' ? 'AI Summary' : 'Original'}</span>
          </div>
        </div>
        <span class="expand-icon">+</span>
      </div>
      <div class="project-content">
        <div class="project-content-inner markdown-body">
          ${p.html}
          ${p.status ? `<span class="project-status">${p.status}</span>` : ''}
        </div>
      </div>
    </article>`
    )
    .join('');
}

const app = document.getElementById('app');

app.innerHTML = `
  <main class="site-container">
    <header class="fade-up">
      <div class="portrait-wrapper">
        <img src="/portrait.png" alt="Jaicob" class="portrait" />
      </div>
    </header>

    <section class="intro fade-up" style="--delay: 100ms">
      <p>This website historically has not gotten much love, but it is a shame not make use of the domain. For now it  takes the form of a personal notebook.</p>
    </section>

    <section class="projects-section">
      <h2 class="fade-up" style="--delay: 150ms">Notes on AI</h2>
      <p class="projects-description fade-up" style="--delay: 200ms">A catalog of tools, apps, experiments and thoughts related to AI. The AI Summary tag indicates content generated to summarize a project, and the Original tag indicates a note written without AI assistance.</p>
      ${renderProjects()}
    </section>
  </main>

  <footer class="site-footer fade-up" style="--delay: 600ms">
    <div class="site-footer-inner">
      <p>Last updated ${new Date(document.lastModified).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      <p>&copy; ${new Date().getFullYear()} Jaicob</p>
    </div>
  </footer>
`;

// Scroll-reveal observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// Project accordion
document.querySelectorAll('.project-header').forEach((header) => {
  header.addEventListener('click', () => {
    const item = header.closest('.project-item');
    const wasActive = item.classList.contains('active');

    // Close all open items
    document.querySelectorAll('.project-item.active').forEach((open) => {
      open.classList.remove('active');
      open.querySelector('.expand-icon').textContent = '+';
    });

    if (!wasActive) {
      item.classList.add('active');
      item.querySelector('.expand-icon').textContent = '+';
    } else {
      // Only scroll if the item is above the viewport (user scrolled deep)
      const rect = item.getBoundingClientRect();
      if (rect.top < 0) {
        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
