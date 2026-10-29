# CampusPulse: From Report to Resolution
### BenQ × Hackyard 2026 Challenge Submission | IIT Guwahati
**Theme:** *"Contribute to building a Smarter Campus using technology"*  
**Architecture:** 100% Self-Contained Client-Side Web Prototype (React 19, TypeScript 5.7, Tailwind CSS, Vite)

---

## 🌟 Executive Summary & Pitch Narrative

Sprawling academic campuses like IIT Guwahati face an **"Operational Black Hole"**:
1. **Reporting Friction:** When students observe energy waste (e.g., split AC running in an empty lecture hall), water leaks, or dimmed pathway lighting, reports either never get submitted or disappear into an opaque administrative void.
2. **Prioritization Paralysis:** Estate and maintenance crews receive fragmented emails and phone calls without objective urgency scoring.
3. **Communication Blindspot:** The community never knows when an issue is acknowledged, leading to duplicated reports and student apathy.

**CampusPulse** closes this loop completely through a 5-stage lifecycle:
$$\textbf{Report} \longrightarrow \textbf{Prioritize} \longrightarrow \textbf{Act} \longrightarrow \textbf{Resolve} \longrightarrow \textbf{Communicate}$$

By bridging rapid student reporting with a **transparent heuristic priority engine**, a **verifiable Trust & Impact Ledger**, and **browser-rendered public campus signage with real-time cross-tab synchronization** (designed for 16:9 large-format screens like BenQ Boards), CampusPulse turns passive bystanders into active campus stewards and celebrates institutional accountability.

---

## 🚀 The Three Connected Experiences

### 1. 📱 Student & Campus User Reporting View
- **Sub-45s Submission:** Clean category selector (Energy, Water, Waste, Safety, Facilities), campus zone picker, and location details.
- **Dynamic Heuristic Engine Preview:** Live mathematical scoring (1–100) based on Urgency (55%), Category/Eco Impact (35%), and Unresolved-Report Age (10%).
- **1-Click Pitch Presets:** Realistic routine maintenance scenarios:
  - *"Auditorium AC Left On"* (Core 1 Lecture Complex)
  - *"Hostel Tap Seepage"* (Manas Hostel Laundry Bay)
  - *"Compost Hopper Full"* (Food Court Plaza)
  - *"Perimeter Lamp Flickering"* (Campus Walkway)
- **Privacy First:** Student identities are kept strictly in internal operational records and never broadcast on public signage screens.

### 2. 🛠️ Operations Command Hub & Trust & Impact Ledger
- **Real-Time KPI Suite:** Total Active Tickets, Critical Priority count, In Progress count, and Recorded Resolutions—derived directly from records.
- **Multi-Filter & Search:** Filter by Status (`Reported`, `Triaged`, `In Progress`, `Resolved`), Category, Zone, or keyword.
- **Trust & Impact Ledger (Key Differentiator):**
  - **Explicit Evidence States:** Resolving an issue categorizes it into:
    - `STATUS_RECORDED`: Status closed in queue without formal notes.
    - `OPERATOR_DOCUMENTED`: Technician work note ($\ge 10$ chars) recorded on file.
    - `EVIDENCE_ATTACHED`: Technician work-completion photo or inspection voucher attached.
  - **Local Storage Quota Protection:** Uploaded images are validated (JPEG, PNG, WebP $\le 2$ MB) and downscaled client-side via an offscreen HTML canvas to max 600px JPEG (~25-40 KB), ensuring reliable persistence within browser storage quotas without blowing 5MB limits.
  - **Closed Incident Ledger Table:** Searchable table listing all closed tickets with their evidence level badge, technician notes, and a one-click modal to inspect attached physical evidence.
  - **Environmental Provenance Transparency:** Explicitly classifies sustainability data as `MEASURED` (`NOT MEASURED — No live utility-meter data connected`, value: `null`), `MODELLED` (calculated from disclosed equipment power ratings and illustrative downtime constants), or `NOT_MEASURED` (unapplicable for civil hardware).
  - **Cross-Tab Launch Link:** "Open Signage Tab" (`#kiosk`) directly from the header for immediate multi-window demonstration.
- **Audit Trail:** Complete timestamped lifecycle history for every ticket.

### 3. 📺 Campus Signage Mode (Target Platform: BenQ Displays)
- **Designed for 16:9 Large Displays:** Browser-rendered layout designed for 16:9 displays; hardware and signage-platform integration are not implemented.
- **Live Cross-Tab Synchronization:** Tab 1 (Operations) and Tab 2 (Public Signage) synchronize dynamically on the same origin via native browser `storage` events without page reloads or infinite write-back echo loops.
- **Evidence-Aware Resolution Marquee Ticker:** Continuously scrolls recently resolved tickets with distinct standardized badges (`PHOTO ATTACHED`, `RESOLUTION NOTE RECORDED`, `STATUS RECORDED`). Active items show `IN PROGRESS`. Personal identifiers and free-text internal notes are completely suppressed for privacy.
- **Accessible Motion Controls:** Includes a dedicated ticker Pause/Play control button and `@media (prefers-reduced-motion: reduce)` support in accordance with WCAG 2.2 Success Criterion 2.2.2.
- **Public Evidence Legend:** Compact 4-part guide clearly explaining to passing students and staff what each status badge means.
- **Campus Zone Health Map:** Real-time operational status (🟢 Normal / 🟡 Active Maintenance / 🔴 Priority Alert) across IITG zones.
- **Eco-Impact Provenance Card:** Transparently displays `NOT MEASURED — No live utility-meter data connected` for live telemetry, and discloses illustrative demonstration formulas (avoided power kW $\times$ avoided hours) for modeled heuristics.
- **Interactive "Scan to Report" QR Widget:** High-visibility QR code with a one-click simulated mobile scan action (client session shortcut).

---

## 🎨 Editorial Operations Console UI/UX & Accessibility

The user interface was completely redesigned from the ground up to replace generic, AI-generated dashboard aesthetics (oversized glowing accents, decorative cards, emojis) with a deliberate, high-density **editorial operations console**:
- **Design Tokens:** Deep canvas (`#090d16`), technical slate surfaces (`#0f172a`), crisp hairline borders (`#1e293b`), tabular numbers (`font-mono`, `font-variant-numeric: tabular-nums`).
- **Semantic Palette:** Emerald for verified active/resolved items, Amber for high priority, Rose for critical severity ($\ge 80$), Sky for in-maintenance, and Purple for photographic evidence.
- **High-Density Tabular Views:** Operations Command Hub offers both a dense, sortable Tabular Grid View (default) and a Card List View.
- **WCAG 2.2 AA Accessibility Compliance:**
  - **Modal Dialog Trapping:** Resolution, Assignment, Audit Trail, and Evidence Preview modals implement focus trapping (Tab cycling), `Escape` key handlers, focus restoration, `role="dialog"`, and `aria-modal="true"`.
  - **Live Regions:** Dynamic priority calculation telemetry and notification toasts announce changes to screen readers (`role="status"`, `aria-live="polite"`).
  - **Accessible Names:** Icon buttons and filter inputs possess descriptive `aria-label` attributes.
  - **Reduced Motion:** Marquee ticker animation respects user OS reduced-motion preferences and provides an inline pause control.

---

## 🏆 Alignment with Official Judging Criteria

| Criterion | CampusPulse Execution & Defense |
| :--- | :--- |
| **1. Quality of the Idea** | Closes the human feedback loop. Rather than a static database, it transforms operational maintenance into shared civic accountability. Directly supports IIT Guwahati Green Office mandates (energy audits, rotary drum composting) and BenQ's campus communication footprint. |
| **2. Quality of the Pitch** | Crisp 5-minute narrative flowing through Report $\to$ Prioritize $\to$ Act $\to$ Resolve $\to$ Communicate. Built-in interactive Pitch Runbook modal with script cues and talking points. Zero fabricated statistics or false claims. |
| **3. Prototype Functionality** | 100% functional, responsive client prototype with zero dead buttons, TypeScript compilation, deterministic priority algorithm, live cross-tab synchronization, and resilient local storage recovery. |

---

## ⏱️ 5-Minute Live Pitch Runbook (Judge Presentation Guide)

- **Minute 0:00 – 0:30 (Problem Framing):** Present the "Campus Operational Void" without claiming unverified campus disasters.
- **Minute 0:30 – 0:55 (Product Introduction):** Introduce CampusPulse and the closed-loop Report-to-Resolution lifecycle.
- **Minute 0:55 – 2:15 (Experience A & B: Student Reporting & Operations Hub):** Click "Auditorium AC Left On" preset. Highlight the dynamic priority engine scoring 69/100 (HIGH). Submit ticket. Switch to Operations Hub, assign to Campus Electrical Wing, and advance to In Progress.
- **Minute 2:15 – 3:15 (Experience B: Evidence-Aware Resolution):** Click "Record Resolution". Show 3 evidence states: `STATUS_RECORDED`, `OPERATOR_DOCUMENTED`, and `EVIDENCE_ATTACHED`. Enter note ($\ge 10$ chars) and attach supporting photo. Show Trust & Impact Ledger breakdown.
- **Minute 3:15 – 4:05 (Experience C: Live Signage & Cross-Tab Synchronization):** Open Signage view in a second browser tab (`#kiosk`). Show real-time cross-tab synchronization: the resolved ticket immediately appears in the live ticker with its `PHOTO ATTACHED` badge without page reload. Show the legend and strict reporter privacy suppression.
- **Minute 4:05 – 4:35 (Data Credibility & Environmental Provenance):** Point out the Eco-Impact card: without connected meters, live readings display `NOT MEASURED`, while modeled heuristic savings disclose the explicit calculation assumptions.
- **Minute 4:35 – 5:00 (Closing & Pitch Conclusion):** Conclude with defensible value and prepare for judge Q&A in separate period.

*(Note: See [PITCH.md](./PITCH.md) for full script, or click the **"5-Min Pitch Guide"** button in the app header at any time!)*

---

## 🧪 Verification & Acceptance Tests

Our automated test suite ([tests/verify-user-journey.mjs](./tests/verify-user-journey.mjs)) exercises 67 assertions across all 25 required verification targets and 20 specific behaviors:
- Valid report creation and field validation (`VT-18`, `SEC10-12`).
- Deterministic priority scoring, tier boundaries, and edge cases (NaN/negative hours, unknown categories) (`VT-19`, `BEH-18`, `SEC10-13`).
- Resolution input validation: rejects missing/whitespace notes for documented resolutions, prevents `EVIDENCE_ATTACHED` without attachments (`BEH-01 .. BEH-06`).
- Full resolution evidence workflow (`STATUS_RECORDED`, `OPERATOR_DOCUMENTED`, `EVIDENCE_ATTACHED`) (`VT-01 .. VT-08`, `SEC10-05 .. SEC10-07`).
- Public display evidence-state segregation (`IN PROGRESS`, `PHOTO ATTACHED`, `RESOLUTION NOTE RECORDED`, `STATUS RECORDED`), ticker updates, and privacy filtering (`VT-09 .. VT-13`, `BEH-09 .. BEH-11`, `SEC10-08`).
- Disclosed environmental provenance and strict separation of unavailable measurements (`NOT_MEASURED`, null) from modeled metrics (`VT-14 .. VT-17`, `BEH-12 .. BEH-13`, `SEC10-01 .. SEC10-04`).
- Cross-tab synchronization via native browser storage events with loop breaking and safe handling of storage clear / malformed JSON (`BEH-14 .. BEH-16`, `SEC10-09 .. SEC10-11`).
- URL hash and query role routing (`#kiosk`, `#operations`, `#report`, `?role=kiosk`) (`BEH-17`).
- Local storage serialization and graceful recovery from corrupt/empty stored data (`VT-23, VT-24`, `BEH-19, BEH-20`, `SEC10-17`).
- Sequential ticket identification and uniqueness (`VT-25`).

```bash
# Run automated tests (67/67 passed)
npm test

# Build production bundle (TypeScript compile + Vite build)
npm run build
```

---

## 💻 Quick Start & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# http://localhost:5173

# To test live cross-tab synchronization:
# Tab 1: http://localhost:5173/#operations
# Tab 2: http://localhost:5173/#kiosk
```

---

## 📚 Evidence & Research Citations
1. **IIT Guwahati Green Office:** Established Nov 2013; coordinates campus sustainability, 2MW solar array, energy audits, and rotary drum composting (*Mati Dhan*). [https://www.iitg.ac.in/groff/](https://www.iitg.ac.in/groff/)
2. **BenQ Education Solutions & Digital Signage:** Interactive Displays and digital signage for centralized campus communications. [https://www.benq.com/en-in/education.html](https://www.benq.com/en-in/education.html)
3. **Smart Campus IoT Research:** ArXiv survey on human-in-the-loop facilities reporting reducing downtime by >30%. [https://arxiv.org/abs/2403.15395](https://arxiv.org/abs/2403.15395)
4. **Competitive Intelligence References:** Evaluated against 8 primary sources including IIT Kanpur Campus Care, Texas A&M AggieWorks, SeeClickFix, Anytime Help, BenQ X-Sign, IntelliGrid, IITG Green Office, and US DOE FEMP. See [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md).
