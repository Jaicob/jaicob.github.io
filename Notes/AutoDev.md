---
keywords: [Claude Code, Notion API, GitHub, Automation]
type: summary
---

# Auto-Dev: Notion-to-PR Pipeline

A Claude Code skill that connects task management in Notion to automated code implementation and GitHub pull requests. Tasks go in, PRs come out.

## How It Works

The pipeline reads from a Notion database where each task follows a structured template (bug report or feature request). When triggered, it picks up tasks marked "Ready" and processes them sequentially:

1. **Triage** — Fetches each task's requirements and evaluates whether they're clear enough to implement. If not, it writes specific clarifying questions back to the Notion page and moves the task to "Needs Clarification."

2. **Implement** — For actionable tasks, it navigates to the correct repo (resolved via a Project relation in Notion), creates a feature branch, reads the relevant code, and makes the changes described in the task.

3. **Ship** — Commits the changes, pushes the branch, and opens a PR on GitHub with a summary, acceptance criteria, and a link back to the Notion task.

4. **Report** — Updates the Notion task with the PR link, branch name, and a summary of what changed, then moves the status to "Needs Review."

The whole loop — Notion read, code change, PR, Notion update — runs without intervention. I review and merge the PRs manually.

## Status

Work in progress. The first iteration ran as a scheduled task in a cloud VM, which introduced problems with filesystem permissions, git credential access, and version control state corruption. I'm now reworking it to run locally within a Claude Code session where it has direct access to repos, git, and GitHub CLI. The focus is on getting the basic task-to-PR loop reliable before adding complexity like parallel repo processing, automated test gating, or Slack notifications.