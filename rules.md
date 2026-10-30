# CampusPulse — Project Rules & Engineering Standards
## Strict Engineering, Product, and Execution Governance

---

### 1. Scope Discipline Rules
- **Rule 1.1 — Follow the Specified CampusPulse Concept:** Implement exclusively the 5-stage loop: **Report → Prioritize → Act → Resolve → Communicate**. Do not veer into general-purpose LMS, student attendance, cafeteria ordering, or social networking features.
- **Rule 1.2 — Prioritize the End-to-End Core Journey:** A functional, complete journey linking student reporting, operations triage, and BenQ public display takes precedence over adding speculative side features.
- **Rule 1.3 — Ban on Feature Creep:** No adding unverified external dependencies, heavy server architectures, or convoluted state managers. Keep architecture lean, modular, and reliable.
- **Rule 1.4 — No Speculative AI/IoT Pretending:** Do not claim automated computer-vision waste detection, drone inspections, or physical hardware IoT triggers unless backed by tangible code. Deterministic, transparent rule engines are vastly superior to mock "black-box AI" claims.

---

### 2. Evidence Integrity & Fact Rigor
- **Rule 2.1 — Zero Fabrication of Facts:** Never invent specific IIT Guwahati incidents, unresolved emergency disputes, or administrative statistics.
- **Rule 2.2 — Clear Labeling of Simulated Demo Data:** All sample incidents, locations, and time-stamps in the prototype must be explicitly identifiable as simulated demonstration data.
- **Rule 2.3 — Grounding in Real References:** Ground real claims in the verified references (IIT Guwahati Green Office initiatives and BenQ Education/Signage technologies) with exact source URLs.
- **Rule 2.4 — Distinct Prototype vs. Future Horizon:** Distinguish what is demonstrably running in the prototype today from what is proposed as a post-hackathon roadmap feature.
- **Rule 2.5 — No False Affiliation Claims:** Do not claim official institutional endorsement from IIT Guwahati administration or official hardware partnership with BenQ Corporation. Frame the product as an innovative pilot prototype submitted for the hackathon.
- **Rule 2.6 — Prohibit Unsupported Verification Claims:** Do not equate an operator-entered note with independent audit verification. Do not equate an attached photograph with absolute proof that the physical issue has been completely fixed. Verification states must be accurately labeled as operator documentation on file, not independent third-party certification.
- **Rule 2.7 — Prohibit Conflating Modelled Estimates with Measured Savings:** The application must strictly separate measured totals from modeled operational estimates. Because no live sub-meters are connected to the prototype, measured energy and water totals must honestly display NOT MEASURED (null) rather than a false measured zero. Modelled heuristic estimates must explicitly disclose their input assumptions, calculation formulas, and engineering units.

---

### 3. Code Quality & Architectural Integrity
- **Rule 3.1 — Inspect Before Editing:** Always inspect existing files, dependencies, and file structures before modifying or generating code.
- **Rule 3.2 — Single Source of Truth:** Centralize state management with clear, predictable state transitions and type safety (TypeScript interfaces).
- **Rule 3.3 — No External Backend Fragility:** For the hackathon prototype, utilize robust client-side storage (`localStorage`) initialized with rich, realistic seed data. This guarantees 100% uptime during live judging pitches without risk of database outages, CORS errors, or API rate limits.
- **Rule 3.4 — Zero Hardcoded Secrets:** Never embed API keys, access tokens, or private credentials in the source code or commit history.
- **Rule 3.5 — Clean Separation of Concerns:** Separate data models, priority scoring utilities, UI presentation components, and layout containers into clean, modular files.

---

### 4. UI & UX Standards
- **Rule 4.1 — Cohesive & High-Polish Design System:** Use a unified aesthetic (modern slate/emerald palette suitable for a green/smarter campus), crisp typography, clean spacing, and modern iconography (Lucide).
- **Rule 4.2 — No Dead Buttons or Non-Functional Links:** Every clickable element must trigger an actual state change, modal, filter, or feedback notification. Placeholder links (`href="#"`) or unresponsive buttons are strictly forbidden.
- **Rule 4.3 — Complete State Coverage:** Every screen, table, and list must gracefully handle:
  - Normal populated state.
  - Empty state (with an inviting illustration/message and reset option).
  - Validation error state (clear inline guidance for invalid fields).
  - Action feedback state (toast confirmation upon reporting or resolving an issue).
- **Rule 4.4 — Accessibility & Contrast (WCAG AA):** Ensure clear visual hierarchy, proper label associations on form inputs, keyboard navigation support, and sufficient color contrast across both standard and BenQ high-contrast display modes.
- **Rule 4.5 — Evidence-State Consistency Across Interfaces:** Operational state and resolution evidence state must be tracked and displayed separately. The public signage display and operations command hub must use consistent, synchronized evidence badges (`STATUS_RECORDED`, `OPERATOR_DOCUMENTED`, `EVIDENCE_ATTACHED`). An unverified status change must never be silently upgraded to an evidence-attached state.

---

### 5. Data & Privacy Protection
- **Rule 5.1 — Minimal Data Collection:** Collect only what is necessary to triage and resolve the campus issue (category, location, title, description, urgency, optional reporter moniker).
- **Rule 5.2 — Public Display Anonymization:** On the BenQ Public Display Signage mode, strictly suppress personal identifying information and unrestricted free-text resolution notes. Tickets display ticket ID, generic location, category, operational status, and standardized evidence badges, but never student contact numbers, personal emails, or free-text internal notes.
- **Rule 5.3 — Demonstration Mode Clarity:** Explicitly clarify in the UI that the role-switcher ("Student View", "Ops Dashboard", "BenQ Public Display") is a prototype demonstration control for evaluators to easily inspect all facets of the system.

---

### 6. Verification & Testing Standards
- **Rule 6.1 — Comprehensive Local Build Verification:** Run TypeScript compilation (`tsc`) and Vite build (`npm run build`) to ensure zero compile warnings, missing imports, or type errors.
- **Rule 6.2 — End-to-End User Journey Verification:** Test the entire lifecycle prior to completion:
  1. Submit a new report in Student View.
  2. Verify priority calculation in Ops Dashboard.
  3. Change status from `Reported` to `In Progress`.
  4. Resolve the ticket with a logged note.
  5. Verify ticket appearance in the BenQ Public Display "Recently Resolved" ticker.
- **Rule 6.3 — Truth in Verification:** Never claim a test has passed unless executed and verified against actual terminal or browser output.

---

### 7. Time & Execution Management
- **Rule 7.1 — Working End-to-End Path First:** Complete the primary happy path before spending time on secondary decorative features.
- **Rule 7.2 — Strict Alignment Across Artifacts:** Maintain 100% consistency between `requirements.md`, `rules.md`, `vision.md`, and the implemented codebase.
- **Rule 7.3 — Pitch-Ready Delivery:** Ensure the prototype is immediately runnable with one command (`npm run dev`) and includes a pre-loaded "Reset Demo" button to facilitate smooth rehearsed demonstrations.
