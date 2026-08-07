# Skylark Drones - Monday.com Business Intelligence Agent

An intelligent, resilient, conversational Business Intelligence (BI) agent built for founders and executives to query real-world business data across **monday.com Deals** and **Work Orders** boards.

![Skylark BI Agent Banner](https://img.shields.io/badge/Skylark_Drones-BI_Agent_v1.0-0066FF?style=for-the-badge&logo=react)
![Data Hygiene](https://img.shields.io/badge/Data_Hygiene_Score-94%25-10B981?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

---

## 🌟 System Architecture

The application is architected around a 4-tier conversational reasoning pipeline designed to handle messy, incomplete real-world data and provide actionable executive insights.

```
+-------------------------------------------------------------------+
|                  Conversational Interface                         |
| (Executive Input, Natural Language Queries, Interactive Cards)    |
+---------------------------------+---------------------------------+
                                  |
+---------------------------------v---------------------------------+
|               BI Reasoning & NLP Intent Engine                    |
|    (Cross-Board Join Engine, Metrics Computation, Clarifications) |
+---------------------------------+---------------------------------+
                                  |
      +---------------------------+---------------------------+
      |                           |                           |
+-----v---------------+   +-------v-------------+   +---------v-----------+
| Data Resilience     |   | Monday.com Connector|   | Leadership Update   |
| & Cleaning Pipeline |   | (GraphQL API / MCP) |   | Generator Module    |
+---------------------+   +---------------------+   +---------------------+
```

---

## ✨ Key Capabilities

1. **Natural Language Query Engine**: Answers founder-level business queries regarding pipeline health, closed revenue, sector breakdown (Energy, Renewables, Mining, Railways, Powerline), and work order completion speed.
2. **Real-World Data Resilience & Hygiene**:
   - Parses masked deal amounts, commas, whitespace, and `#VALUE!` formula errors gracefully.
   - Normalizes varied date formats (`YYYY-MM-DD`, `DD/MM/YYYY`, Month strings) into financial quarters (`Q1 FY26`, `Q2 FY26`).
   - Communicates data quality caveats directly alongside query results without crashing calculations.
3. **Cross-Board Joins**: Joins **Deals** (sales pipeline) and **Work Orders** (execution & billing) on `Deal Name`, `Client Code`, `Owner`, and `Sector`.
4. **Monday.com Dual Connector**:
   - Supports **Live Monday.com GraphQL API v2** & **MCP Server** integration.
   - Pre-loaded with **Skylark Drones Sample Dataset** (Deals & Work Orders) for zero-config hosted evaluation.
5. **Leadership Update Generator (Additional Requirement)**:
   - **1-Page Founder Briefing**: Executive summary, commercial wins, operational risks, and action items.
   - **3-Slide Leadership Deck**: Visual slide cards ready for board meetings.
   - **Downloadable Markdown/PDF Export**.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### Installation Steps

1. Clone the repository and navigate into the folder:
   ```bash
   git clone https://github.com/your-username/skylark-bi-agent.git
   cd skylark-bi-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🔌 Monday.com Setup & Configuration

### Option A: Using the Zero-Config Offline Demo Dataset
No configuration is required! The application comes pre-loaded with the parsed Skylark Drones Deals and Work Orders datasets.

### Option B: Connecting Live Monday.com Boards
1. Click the **Monday.com** button in the header bar.
2. Enter your **Monday.com Personal Access Token**:
   - Obtain from Monday.com -> Profile -> Developers -> API Tokens.
3. Input your **Deals Board ID** and **Work Orders Board ID**.
4. Click **Save Connection**. The agent will immediately fetch live items via the Monday.com GraphQL API v2.

---

## 📊 Sample Executive Queries

Try entering these queries in the conversational chat bar:

1. *"How's our pipeline looking for energy sector this quarter?"*
2. *"What is our unbilled work order amount and top receivable accounts?"*
3. *"Which deals are stuck in execution?"*
4. *"Generate a leadership update for the board"*
5. *"Show performance summary for Renewables sector"*

---

## 📄 License & Contact
Built for the **Skylark Drones Full Stack Developer Assignment**.
For questions or feedback, please contact the developer via the submission repository.
