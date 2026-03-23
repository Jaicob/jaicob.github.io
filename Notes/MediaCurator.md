---
keywords: [Gemini, Solid.js, PixiJS, SQLite, MCP Server, Claude Code]
type: summary
---

# Media Curator

A semantic media library that makes thousands of design assets instantly searchable, browsable, and export-ready — powered by multimodal AI embeddings.

## The Problem

Working with large media libraries as a developer is quietly one of the most frustrating parts of building for the web. Design assets live in sprawling folder structures across Google Drive, local directories, and shared team folders. Finding the right image means:

- **Navigating deep folder hierarchies** with inconsistent naming conventions
- **Waiting for cloud-hosted files to load** just to preview them
- **Manually checking dimensions, format, and file size** against specific layout requirements
- **Converting and compressing assets** into web-optimized formats before they can ship
- **Losing track of what exists** — re-downloading or re-exporting assets you already have

When you're building a website and need "that wide hero shot from the spring campaign," you shouldn't have to open seven folders and scrub through thumbnails for twenty minutes. You should be able to describe what you're looking for and get it.

## How It Works

Media Curator indexes your media library using Google's Gemini Embedding Model 2, which generates multimodal vector embeddings from image content. These embeddings capture the semantic meaning of each image — not filenames or tags, but what the image actually depicts.

**Indexing.** Point it at a Google Drive folder (or local directory) and it walks the tree, hashing each file for change detection, generating embeddings, and producing three tiers of thumbnails. The index lives in SQLite with sqlite-vec for vector search, so everything runs locally with no external database.

**Searching.** Type a natural language query — "outdoor group photo," "product flat lay on white," "dark moody portrait" — and it embeds your query text with the same model, then runs cosine similarity against the full index. Results come back ranked by semantic relevance in milliseconds.

**Browsing.** The web interface renders all indexed assets on an infinite canvas using PixiJS (WebGL 2D). Assets are arranged in an elliptical grid layout and only the visible viewport loads thumbnails, so it handles hundreds or thousands of assets at 60fps. Pan with middle-click or spacebar (Figma-style controls), zoom with scroll wheel, drag to marquee-select.

**Editing.** Select an asset to open a detail drawer with full metadata, tag management, and description editing. A crop panel offers aspect ratio presets (1:1, 4:3, 16:9, etc.) with a visual preview. Background removal is powered by Gemini's image generation model and saves the result as a new indexed asset in the library.

**Exporting.** One-click export to web-optimized formats (WebP, PNG, JPEG) with quality and dimension controls. The export pipeline uses Sharp.js for processing and streams the result directly as a browser download. For Google Drive-sourced assets, originals are fetched on-demand via the Drive API and cached locally.

## Architecture

Media Curator is a standalone TypeScript service with three interfaces:

```
                    +------------------+
                    |   Core Library   |
                    |  (embeddings,    |
                    |   search, index, |
                    |   export, Sharp) |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
        +-----+----+  +-----+----+  +------+-----+
        | REST API |  |   MCP    |  |    CLI     |
        |  (Hono)  |  |  Server  |  | (Commander)|
        +-----+----+  +----------+  +------------+
              |
        +-----+----+
        |  Web App |
        | Solid.js |
        | + PixiJS |
        +----------+
```

- **Core library** handles embedding generation, vector storage, semantic search, image processing, and Google Drive integration
- **REST API** (Hono) serves the web app with endpoints for search, asset management, export, and OAuth
- **MCP Server** (Streamable HTTP transport) exposes the same capabilities to AI agents and tools like Claude
- **CLI** provides command-line access for scripting and automation
- **Web app** (Solid.js + PixiJS) is the primary interface — a canvas-based browser for visual exploration

### Data Flow

```
Source Media (Drive/Local)
    |
    v
Index Pipeline: hash -> embed (Gemini) -> store (SQLite + sqlite-vec) -> thumbnails (Sharp)
    |
    v
Query: text -> embed -> cosine similarity -> ranked results
    |
    v
Export: source -> crop/resize (Sharp) -> format conversion -> download
```

## Key Design Decisions

**Multimodal embeddings over keyword tagging.** Traditional DAM systems rely on manual tags or filename conventions. Gemini Embedding Model 2 understands image content directly — a photo of a sunset will match "warm golden hour landscape" without anyone tagging it. Tags are still supported as an additional filtering layer, but they're additive, not required.

**SQLite + sqlite-vec over a dedicated vector database.** The entire index (embeddings, metadata, thumbnails) lives in a single SQLite database with the sqlite-vec extension for approximate nearest neighbor search. No Pinecone, no Qdrant, no infrastructure to manage. Embeddings at 768 dimensions keep the index compact while maintaining search quality.

**PixiJS canvas over DOM-based grid.** Rendering hundreds of thumbnails in the DOM hits performance walls quickly. PixiJS gives us WebGL-accelerated rendering with frustum culling — only tiles in the viewport are drawn and only visible thumbnails are fetched. The result is smooth 60fps pan/zoom across the entire library regardless of size.

**On-demand source fetching.** Google Drive-sourced assets don't need to live on disk permanently. Thumbnails are generated during indexing (while the file buffer is in memory), and original files are fetched on-demand from Drive when needed for export. This keeps local storage minimal while maintaining full-resolution export capability.

**Solid.js for UI, framework-free canvas.** The canvas layer (PixiJS) runs independently of any UI framework for maximum performance. Solid.js handles the reactive UI chrome — drawers, panels, dialogs — with fine-grained reactivity and no virtual DOM overhead. The two layers communicate through simple callbacks.

**Non-destructive editing.** Exports are always derived from the original source. Crop and resize produce a downloaded file; background removal creates a new indexed asset. The original is never modified.

## Built With

### Core Technologies
- **TypeScript** (strict mode, ESM throughout)
- **Node.js** runtime
- **SQLite** + **sqlite-vec** for vector storage and search
- **Sharp.js** for image processing, format conversion, and thumbnail generation
- **Hono** for the REST API
- **Solid.js** for reactive UI
- **PixiJS** for WebGL 2D canvas rendering
- **Tailwind CSS** for styling
- **Vite** for frontend build tooling
- **Google Drive API v3** for cloud source integration

### AI Models
- **Gemini Embedding Model 2** (`gemini-embedding-2-preview`) — multimodal embeddings for semantic image search. Generates 768-dimensional vectors from both images and text queries, enabling natural language search across visual content.
- **Gemini 2.5 Flash Image** (`gemini-2.5-flash-image`) — image generation model used for AI-powered background removal. Takes a source image and produces a transparent-background PNG saved as a new library asset.

### AI Development Tools
- **Claude Code** (Claude Opus 4.6) — the entire codebase was built collaboratively with Claude Code using multi-agent workflows. Specialized agents handled backend engineering, frontend development, API design, and code review in parallel, with architectural oversight coordinating across the team.

### Design
- **Source Serif 4** (display/body typography)
- **IBM Plex Mono** (technical values, dimensions)
- **IBM Plex Sans** (small labels)
- Custom warm neutral color system derived from the Mode brand palette

## MCP Integration

Media Curator exposes its full capability set as MCP (Model Context Protocol) tools, making it usable by AI agents:

- `search_media` — semantic search with filters
- `get_media_details` — asset metadata lookup
- `export_media` / `batch_export` — web-optimized export
- `remove_background` — AI background removal
- `get_placeholder` — placeholder image generation
- `reindex` — trigger library re-indexing
- `list_tags` / `tag_media` — tag management

This means an AI agent building a website can search for assets, check dimensions, export in the right format, and remove backgrounds — all programmatically, without a human navigating folders.
