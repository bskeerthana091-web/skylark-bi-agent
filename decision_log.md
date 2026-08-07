# Decision Log - Skylark Drones Monday.com BI Agent

**Role**: Full Stack Developer Assignment  
**Project**: Monday.com Business Intelligence Agent  
**Date**: August 2026  

---

## 1. Key Assumptions Made

1. **Cross-Board Entity Relationship**:
   - Assumed that `Deal Name` in the Deals board corresponds directly to `Deal name masked` in the Work Orders board, enabling cross-board joins.
   - Assumed `Customer Name Code` (`COMPANY089` vs `WOCOMPANY_002`) represents account identifiers that map to parent client entities.

2. **Data Sanitization Rules**:
   - Assumed `#VALUE!` formula errors and blank monetary entries indicate unpriced or legacy records, defaulting them to `0` while flagging them with a Data Hygiene Caveat badge rather than dropping the row.
   - Assumed `Closure Probability` categories (`High`, `Medium`, `Low`) can be mapped into a weighted revenue forecast formula (`Won Revenue + (High Prob Pipeline * 0.8)`).

3. **Zero-Config Evaluation Requirement**:
   - Assumed evaluators may test the hosted prototype without access to live Monday.com API keys or board IDs. Therefore, embedded pre-processed CSV datasets serve as a seamless fallback demo mode alongside live GraphQL API capability.

---

## 2. Trade-Offs Chosen & Rationale

| Decision Area | Option Chosen | Trade-Off Made | Rationale |
| :--- | :--- | :--- | :--- |
| **Architecture** | Client-Side NLP & BI Engine + React + TypeScript | Shifted NLP parsing to client-side reasoning engine rather than requiring an external API key server | Ensures 100% zero-latency execution, cost savings, and 100% uptime for public hosted link reviewers. |
| **Monday.com Integration** | Dual GraphQL API Client + Demo Fallback | Additional code complexity to manage dual modes | Guarantees testability without requiring live API keys while fulfilling full API integration specs. |
| **Data Cleaning** | Non-destructive Caveat Auditing | Displaying caveats rather than silently discarding records | Founders need complete transparency regarding missing values rather than hidden filtered data. |
| **UI Aesthetics** | Dark Glassmorphic Dashboard + Recharts | Added visual chart rendering alongside text | Text alone is insufficient for executive BI; visual charts provide instant executive clarity. |

---

## 3. Interpretation & Implementation of "Leadership Updates"

### Interpretation:
In enterprise drone operations, founders and board members rarely need raw spreadsheet rows. Instead, leadership updates require **synthesized narratives** that combine commercial revenue wins with operational execution risks (unbilled contract value and pending receivables).

### Implementation:
We built an **Executive Leadership Generator** accessible via a dedicated header modal and conversational triggers:
1. **1-Page Founder Briefing**: Highlights executive summary, commercial wins, top operational risks, and strategic action items.
2. **3-Slide Board Deck**: Standardized slide outlines (Slide 1: Financial Highlights, Slide 2: Sectoral Breakdown, Slide 3: Execution & Receivables Risks).
3. **Email Digest Format**: Plain-text summary formatted for immediate copy-pasting to Slack, Email, or WhatsApp leadership groups.
4. **Markdown Export**: Downloadable `.md` report for board documentation.

---

## 4. What We Would Do Differently With More Time

1. **Automated Monday.com Webhooks**: Implement real-time webhook listeners to update pipeline metrics instantly as sales reps update board columns in Monday.com.
2. **Predictive Churn & Delay Machine Learning Model**: Train a lightweight predictive model to forecast which work orders are likely to encounter execution delays based on historical sector completion times.
3. **Advanced Vector Search (RAG)**: Integrate vector embeddings over historical work order comments for semantic query resolution on qualitative feedback.
4. **Automated PDF Export**: Replace markdown export with client-side PDF rendering using `jspdf` for presentation-ready slide exports.

---

## 5. Tech Stack Rationale

- **Frontend Framework**: React 18 + Vite + TypeScript (High performance, instant HMR, strong type safety).
- **Styling**: Tailwind CSS with custom glassmorphism utilities & Inter typography.
- **Charts**: Recharts (Declarative, responsive SVG charting).
- **API Client**: Monday.com GraphQL API v2 Client with error boundaries and offline fallback.
