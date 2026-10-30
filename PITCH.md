# CampusPulse: 5-Minute Live Pitch Playbook & Defense Runbook
### BenQ × Hackyard 2026 | IIT Guwahati
**Theme:** *"Contribute to building a Smarter Campus using technology"*
**Product:** CampusPulse — *From Report to Resolution*

---

## 1. Five-Minute Live Pitch Script

### ⏱️ Minute 0:00 – 0:30: Problem Hypothesis & The "Campus Operational Void"
> *"Good morning, esteemed judges. On sprawling campuses like IIT Guwahati, routine facility failures—split ACs left blasting in empty lecture halls, continuous water valve seepage, or compost bins overflowing—frequently go unnoticed or get reported into administrative silos with zero public feedback.
>
> Students feel ignored, and facility operators get overwhelmed with duplicate, untriaged complaints. We call this the **'Campus Operational Void'**."*

### ⏱️ Minute 0:30 – 0:55: Product Introduction & The 5-Stage Closed Loop
> *"We built **CampusPulse: From Report to Resolution**. CampusPulse transforms campus operations into a transparent, closed-loop lifecycle:
>
> $$\textbf{Report} \longrightarrow \textbf{Prioritize} \longrightarrow \textbf{Act} \longrightarrow \textbf{Resolve} \longrightarrow \textbf{Communicate}$$
>
> Today, we present our core product differentiators: the **Trust & Impact Ledger**, establishing verifiable resolution evidence levels, disclosed environmental-data provenance, and **real-time cross-tab synchronization** reflected directly on ambient BenQ public displays."*

### ⏱️ Minute 0:55 – 2:15: Experience A & B — Reporting & Operations Triage Hub
> *(Action: Open Student View. Click preset 'Auditorium AC Left On' at Core 1.)*
> *"Notice the frictionless reporting flow: 1 click pre-fills category, zone, and description.
>
> Look at the real-time **Deterministic Priority Score Engine**: it computes **69/100 (HIGH)** combining urgency (55%), category & sustainability weight (35%), and unresolved-report age (10%). It is objective, rule-based, and defensible.
>
> *(Action: Click Submit. Switch to Operations Command Hub.)*
>
> Here in the Operations Command Hub, facility staff see the new ticket at the top of the queue. We click **Assign Department** to route it to the Campus Electrical Wing, and advance it to **In Progress**."*

### ⏱️ Minute 2:15 – 3:15: The Trust & Impact Ledger — Verifiable Resolution Workflow
> *(Action: Click 'Record Resolution'. Show Evidence Mode selector.)*
> *"Now for the key differentiator: standard ticketing platforms equate a 'Closed' database flag with verified completion. In CampusPulse, we explicitly distinguish three evidence states:
> 1. **STATUS RECORDED:** Ticket closed in queue without formal work notes.
> 2. **RESOLUTION NOTE RECORDED:** Technician logs work completed (&ge; 10 chars required).
> 3. **PHOTO ATTACHED:** Supporting image attached to record.
>
> Let's select **Photo Attached**, input our resolution note, and attach our repair photo. Notice our client-side image processor automatically downscales the preview to guarantee local storage persistence without quota errors.
>
> *(Action: Switch to the 'Trust & Impact Ledger' tab.)*
> Look at the ledger breakdown: it displays the exact ratio of documented tickets.
>
> **Important integrity distinction:** Attaching a photo records supporting visual documentation on file. It documents operator documentation; it does not claim third-party engineering inspection or independently verified technician identity."*

### ⏱️ Minute 3:15 – 4:05: Experience C — Live Signage & Cross-Tab Synchronization
> *(Action: Show two tabs side-by-side or click 'Open Signage Tab' from Operations.)*
> *"Now let's step into the public campus lobby. This is our browser-rendered layout designed for a 16:9 display, suited for campus public displays.
>
> Notice what happened: because Tab 1 (Operations) and Tab 2 (Public Signage) are synchronized in real-time via native browser `storage` events, our newly resolved ticket immediately appeared in the Signage live ticker with its **PHOTO ATTACHED** badge—without any page reload or polling!
>
> Beneath it, the **Evidence Legend** clearly explains to passing students what each badge means: `IN PROGRESS`, `PHOTO ATTACHED`, `RESOLUTION NOTE RECORDED`, and `STATUS RECORDED`. Reporter personal identifiers and internal free-text notes are completely suppressed from the public display."*

### ⏱️ Minute 4:05 – 4:35: Environmental-Data Provenance — Estimates vs. Measurements
> *(Action: Point to the Eco-Impact Model card.)*
> *"Examine the Eco-Impact card. We practice absolute honesty:
> - **Live Utility Meters display NOT MEASURED (never a false zero):** We have not connected physical utility meters to this prototype.
> - **Modelled Heuristic Savings are disclosed:** The figures are illustrative demonstration constants based on routine equipment downtime heuristics, explicitly disclosing formulas (avoided power kW &times; avoided idle hours).
>
> Distinguishing modeled estimates from unavailable measurements builds genuine institutional credibility."*

### ⏱️ Minute 4:35 – 5:00: Closing & Judging Defense
> *"CampusPulse doesn't attempt to replace human facility staff with speculative black-box AI. It empowers students as active campus stewards, equips technicians with transparent triage, and leverages ambient smart displays to celebrate verifiable resolution.
>
> A closed loop built on evidence, transparency, and trust.
>
> Thank you, and we welcome your questions!"*

---

## 2. Timestamped Live-Demo Sequence & Navigation Steps

| Time | View / Action | Click Target | Expected Observable Result |
| :--- | :--- | :--- | :--- |
| **0:55** | Student View | Preset Button: *"Auditorium AC Left On"* | Form fields autofill; priority engine previews 69/100 (HIGH). |
| **1:30** | Student View | Button: *"Submit Incident Report"* | Green toast appears; ticket added to community feed. |
| **1:40** | Nav Bar | Tab: *"Ops Command Hub"* | Opens triage dashboard; KPI cards show active counts. |
| **2:00** | Ops Hub | Button: *"Assign Department"* | Modal opens; confirms assignment to Campus Electrical Wing. |
| **2:10** | Ops Hub | Button: *"Assign Department"* | Confirms assignment to Campus Electrical Wing and advances status to `IN_PROGRESS`. |
| **2:15** | Ops Hub | Button: *"Record Resolution"* | Opens Resolution Modal; select "Photo Attached", input note, attach sample photo. |
| **2:45** | Ops Hub | Tab: *"Trust & Impact Ledger"* | Shows evidence breakdown table and disclosed calculation models. |
| **3:15** | Ops Hub | Link: *"Open Signage Tab"* (`#kiosk`) | Opens 16:9 kiosk mode in Tab 2; live cross-tab sync active; ticker scrolls resolved ticket with "PHOTO ATTACHED". |
| **4:05** | Signage View | Card: *"Campus Eco-Impact Model"* | Shows "NOT MEASURED" for live meter data vs modeled heuristic offset with explicit formula. |
| **4:25** | Signage View | Button: *"Simulate Mobile Scan Action"* | Transitions back to mobile student reporting view. |
| **Anytime** | Nav Bar | Button: *"5-Min Pitch Guide"* | Opens in-app runbook and judging criteria modal. |
| **Reset** | Nav Bar | Button: *"Reset Demo"* | Restores seed dataset instantly. |

---

## 3. Sample Scenario: "Auditorium AC Left On"
- **Incident:** Commercial split AC unit running at 18°C in empty Core 1 Auditorium 2 after a Friday seminar.
- **Category:** `ENERGY`
- **Campus Zone:** `Core 1 Lecture Complex`
- **Urgency:** `HIGH`
- **Calculated Priority:** `69 / 100` (`HIGH` tier)
- **Recorded Assignment:** `Campus Electrical Wing`
- **Operator-Confirmed Note:** *"Timer relay reset; auditorium doors secured."*
- **Evidence Level:** `EVIDENCE_ATTACHED` (with technician inspection photo)
- **Simulated Eco-Impact:** `~20 kWh` estimated power waste mitigated (Power rating 4.5 kW &times; idle duration 4.5 hrs).

---

## 4. Key Talking Points by Judging Criteria

### 1. Quality of the Idea
- **Closed-Loop Accountability:** Transforms reporting from a dead-end complaint box into a participatory campus loop.
- **Evidence-Grounded:** Aligns with IIT Guwahati Green Office priorities (energy audits, rotary drum composting) and BenQ's campus communication footprint.
- **Dual Perspective:** Solves operational friction for facilities managers while satisfying student psychological need for acknowledgment.

### 2. Quality of the Pitch
- **Crisp Narrative Flow:** Clear problem $\to$ live proof $\to$ cross-tab sync $\to$ architectural honesty.
- **Zero Fabrication:** Transparently separates verified institutional facts from prototype demonstration data.
- **Defensible Value Proposition:** Focuses on realistic operational outcomes rather than speculative claims.

### 3. Quality of the Prototype
- **Zero Dead Ends:** Every button, filter, tab, status toggle, and modal is fully functional.
- **Same-Browser Cross-Tab Sync:** Demonstrates live reactive synchronization across tabs without backend servers or polling.
- **TypeScript Type Safety:** Passes strict type checks and Vite production build with zero warnings or errors.
- **Graceful Resilience:** Schema validation protects against corrupted browser storage with 1-click reset.

---

## 5. Likely Judge Questions & Evidence-Based Answers

### Q1: "Is this currently connected to IIT Guwahati's live maintenance portal or BenQ displays?"
> **Answer:** *"No. We want to be completely upfront: this is an innovative pilot prototype developed for this hackathon challenge. The data is client-side in browser storage. BenQ Boards and IIT Guwahati Green Office are our target deployment environments, and our design respects their documented technical realities."*

### Q2: "How does the live cross-tab synchronization work without a backend server?"
> **Answer:** *"It uses the native browser `storage` event API on the same origin. When Tab 1 (Operations) updates `localStorage`, Tab 2 (Public Signage) listens to the event and synchronizes its React state immediately. We implemented loop-breaker references (`isRemoteUpdateRef`) to prevent infinite write-back echo."*

### Q3: "Why use a rule-based priority algorithm instead of machine learning or LLMs?"
> **Answer:** *"In facilities triage, explainability and determinism are paramount. If an operational team deprioritizes a water leak or safety hazard, they must know exactly why. Our deterministic model (55% urgency, 35% category impact, 10% unresolved age) guarantees that safety and energy waste rise to the top predictably without prompt drift or hallucinations."*

### Q4: "How do you protect student privacy on public campus displays?"
> **Answer:** *"Public displays strictly suppress personal identifiers and free-text resolution notes entirely. Only ticket IDs, generic locations, categories, operational status, and standardized evidence badges appear on the public screen. Student names and contact details remain strictly in the internal operations console."*

### Q5: "Do the eco-impact numbers come from physical smart meters?"
> **Answer:** *"No. They are modeled estimates derived from illustrative prototype equipment downtime heuristics (e.g., standard split AC wattage over elapsed hours) and explicitly state NOT MEASURED for live utility telemetry. In a future production phase, the system could ingest MQTT telemetry from physical inverters and sub-meters."*

---

## 6. Architecture & Limitations Summary

| Dimension | Prototype Implementation Reality |
| :--- | :--- |
| **Frontend Stack** | React 19, TypeScript 5.7, Vite 6.2, Tailwind CSS 3.4, Lucide Icons. |
| **State & Storage** | React Context + `localStorage` with automated schema validation. |
| **Cross-Tab Sync** | Native browser `window.addEventListener('storage')` with loop-breaker refs. |
| **Backend** | Fully client-side; zero external server or cloud database dependency. |
| **QR Scan Mode** | In-app simulated scan shortcut (demo tool); client state is local. |
| **Target Hardware** | Browser-rendered layout designed for a 16:9 display; hardware and signage-platform integration are not implemented. |

---

## 7. Short Final Closing Statement

> *"True smart campus innovation isn't about deploying sensors that nobody looks at. It's about empowering people with transparency, prioritizing what matters most, and closing the loop between reporting an issue and celebrating its resolution. CampusPulse proves that technology can make our campuses more responsive, sustainable, and connected."*
