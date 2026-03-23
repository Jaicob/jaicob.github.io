---
keywords: [AI, Excel/openpyxl, QuickBooks, Notion, Gmail]
type: summary
---

# Supply Chain Automation with AI

## What it does

An AI-augmented supply chain management system for keyboard production — from BOM costing and purchase order generation to vendor monitoring and lifecycle tracking across 8+ international suppliers.

## How it works

The system is built around a single Excel workbook that serves as the operational hub for each production batch. A structured BOM feeds into a pricing model that calculates fully-loaded costs (tariffs, freight, VAT, fulfillment), then auto-generates vendor-specific purchase orders formatted for direct sync to QuickBooks Online via DataDear.

AI handles the structural work: building and maintaining formula relationships across 1,000+ cells, inserting new sections without breaking cross-references, enforcing style consistency across sheets, and cross-referencing part names against the QBO product master to keep a single source of truth.

The workflow extends into Notion for PO lifecycle tracking and Gmail for vendor email monitoring, with a daily digest that surfaces action items, flags silent vendors, and identifies cross-vendor dependencies (e.g., a delay at one supplier that affects another's timeline).

## Architecture

```
BOM (.xlsx)                    QBO Product Master
    │                               │
    ▼                               ▼
┌──────────────────────────────────────┐
│         Order Workbook               │
│  ┌──────────┐  ┌──────────────────┐  │
│  │ Pricing  │  │ 8 PO Sheets      │  │
│  │ Model    │──│ (QBO PO format)  │  │
│  └──────────┘  └────────┬─────────┘  │
│  ┌──────────┐           │            │
│  │Dashboard │  ┌────────▼─────────┐  │
│  └──────────┘  │ QBO Sync        │  │
│                └────────┬─────────┘  │
└─────────────────────────┼────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
          QuickBooks   Notion PO    Gmail
          Online       Tracker      Monitor
                          │           │
                          ▼           ▼
                      Daily Digest + Alerts
```

## Key technical details

**Formula-driven, not hardcoded.** Every cost, quantity, and PO line item traces back to the BOM via Excel formulas. Changing a unit cost or production quantity cascades through pricing, POs, and the dashboard automatically.

**Style-safe editing.** AI modifications follow strict rules — styles are always copied from adjacent cells, never constructed from constants. Row insertions use manual shifting with regex-based formula adjustment instead of openpyxl's unreliable `insert_rows()`.

**QBO-native PO format.** Each PO row contains the full 22-column QuickBooks PO template (Post status, Entry Date, PO Number, Supplier, Item, Qty, Rate, Amount, etc.), ready for direct import without manual mapping.

**Single source of truth for naming.** All part names resolve to the QBO product master. Cross-product compatibility is tracked explicitly (e.g., M356 foam parts used in the M456 keyboard).

## Current status

Work in progress — the workbook and PO generation are in production use by the team today. Notion integration and the daily vendor digest are in active development. The team currently uses the system as an augmented workflow: AI builds and maintains the complex spreadsheet infrastructure while humans handle vendor relationships, approvals, and WeChat communications.