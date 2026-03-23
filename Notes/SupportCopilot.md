---
keywords: [Freshdesk API, Notion API, Claude, Python]
type: summary
---

# Customer Support Copilot

An AI-powered support workflow that fetches open tickets from Freshdesk, drafts brand-aligned responses, and publishes them to a Notion review queue — keeping a human agent in the loop at every step.

## The problem

Our support team handles a steady stream of tickets covering shipping questions, product issues, order changes, and technical troubleshooting for custom mechanical keyboards. Drafting responses from scratch is repetitive when most tickets fall into well-documented patterns, but the nuance matters — customers expect replies that sound like a person who knows the product, not a template.

## Building the knowledge base

Before the copilot could draft anything useful, it needed to learn from real interactions. We fetched and processed all 7,290 historical support tickets from Freshdesk — full conversation threads, not just summaries. That raw corpus was distilled into a structured support guide covering 12 common scenarios (order changes, cancellations, shipping issues, defects), 7 topic areas (product compatibility, refund policy, engraving, international shipping), and 10 technical troubleshooting flows (firmware flashing, key registration, USB-C connectivity, stabilizer rattle). This guide is the foundation the system uses to match incoming tickets to relevant context and generate accurate responses.

## How it works

The copilot runs a five-phase pipeline:

1. **Fetch** — Pulls open tickets from Freshdesk's API, filtering to ones where the customer is waiting for a reply. Cold outreach and spam are detected and skipped automatically.

2. **Reconcile** — Syncs the Notion database against Freshdesk. Tickets that have been resolved (by any means) are marked closed, so the agent's queue stays clean without manual cleanup.

3. **Draft** — For each new ticket, the system classifies the topic, matches it against a support guide covering 12 common scenarios, 7 topic areas, and 10 technical troubleshooting flows, then writes a suggested response in Mode's brand voice. Confidence levels (High / Medium / Low) and placeholders for order-specific details are clearly flagged.

4. **Publish** — New entries land in a Notion database with priority sorting and filtered views. The agent can scan open tickets, read the suggested response, and copy or revise it directly.

5. **Improve** — Agent ratings (Good / Bad) and written feedback flow back into the system. Good-rated responses become reference examples for future drafting. Bad ratings with feedback trigger updates to the support guide, catching policy drift and tone mismatches before they compound.

## Key design decisions

- **Notion as a living corpus.** Instead of maintaining a static reference file, the Notion database accumulates validated responses over time. Each run queries past entries for grounding examples, so suggestion quality improves organically as the team uses the system.

- **Agent-in-the-loop, always.** The AI never sends anything to a customer. Every response is a draft for a human to review, edit, and send. This keeps quality high and builds the feedback signal that makes the system better.

- **Automated reconciliation.** Tickets resolved in Freshdesk are automatically closed in Notion on the next run, regardless of whether the agent interacted with them there. Re-opened tickets create new records, preserving history.

- **Brand voice adherence.** Responses follow a detailed voice guide: direct, human, no startup-speak, Oxford commas, minimal exclamation points. The goal is replies that sound like they came from someone on the team.

## Built with

Freshdesk REST API, Notion API, Python, Claude (via Cowork skill framework)

## Status

Work in progress — used daily by the support team.