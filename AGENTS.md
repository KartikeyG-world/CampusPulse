# CampusPulse — Agent Instructions & Operating Directives

This project implements **CampusPulse: From Report to Resolution** for the **BenQ × Hackyard 2026** challenge at IIT Guwahati.

All agents, subagents, and automated workflows operating in this repository **MUST** strictly adhere to the authoritative specifications established in the root project files:

1. [requirements.md](./requirements.md) — Product specification, user journeys, data model, functional requirements (FR-01 to FR-08), acceptance criteria (AC-01 to AC-07), and 5-minute pitch runbook.
2. [rules.md](./rules.md) — Engineering standards, scope discipline, zero-fabrication evidence rules, code quality, UI/UX requirements, and verification protocols.
3. [vision.md](./vision.md) — Strategic vision, BenQ display ecosystem alignment, IIT Guwahati Green Office relevance, and user experience principles.
4. [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md) — Competitive intelligence analysis and defensible positioning against collegiate and municipal solutions.

---

### Core Directives for Implementation & Verification:

1. **Closed-Loop Journey is Paramount:**
   Every feature must serve the 5-stage loop:
   $$\text{Report} \longrightarrow \text{Prioritize} \longrightarrow \text{Act} \longrightarrow \text{Resolve} \longrightarrow \text{Communicate}$$
2. **Three Connected Experiences:**
   - **Experience A:** Student & Campus Reporter View.
   - **Experience B:** Operations Management & Triage Command Hub.
   - **Experience C:** Public Campus Signage Mode (Target Platform: BenQ Displays).
3. **Quality Standards:**
   - Zero dead buttons, placeholder links, or broken handlers.
   - Robust form validation with clear feedback.
   - Deterministic Heuristic Priority Score (1–100) based on Urgency, Category/Eco weight, and unresolved-report age.
   - High contrast, large-format UI mode for the BenQ Digital Signage screen.
   - 100% self-contained client-side state with `localStorage` persistence and one-click "Reset Demo Data".
4. **Verification Requirement:**
   - TypeScript build (`npm run build`) must pass without errors.
   - Acceptance criteria AC-01 through AC-07 must be verified.
