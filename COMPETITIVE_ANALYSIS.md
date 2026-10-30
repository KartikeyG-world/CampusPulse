# CampusPulse — Competitive Analysis & Originality Intelligence Report
### Strategic Positioning for BenQ × Hackyard 2026 | IIT Guwahati
**Theme:** *"Contribute to building a Smarter Campus using technology"*
**Author:** Senior Software Architect & Competitive Intelligence Reviewer
**Date of Assessment:** October 25, 2026

---

## 1. Research Methodology & Primary Sources Examined

This competitive analysis audits the current landscape of collegiate maintenance portals, municipal issue tracking, commercial Computerized Maintenance Management Systems (CMMS / CAFM), digital signage content platforms, and environmental measurement standards.

### Primary Sources Examined:

1. **IIT Kanpur Campus Care & Pingala CMS:**
   *URL:* `https://www.iitk.ac.in/doip/campus-care`
   *Domain:* Higher-Ed Campus Operations & DOIP Works Maintenance
   *Documented Scope:* Centralized maintenance portal managed by the Dean of Infrastructure and Planning (DOIP). Separates day-to-day minor complaints (electrical, water, sanitation, AC) from major civil works (DOIP Form 101). Uses OTP and institutional credentials. Dispatches tracking numbers via email and collects post-resolution feedback via Form DOIP-107U.

2. **Texas A&M University AggieWorks:**
   *URL:* `https://facilities.tamu.edu/aggieworks-requests-tracking-report.html`
   *Domain:* University Work-Order Management & Facilities Logistics
   *Documented Scope:* Built on enterprise AssetWorks AiM CMMS with NetID/Duo authentication. Publishes a public desktop Power BI report (*AggieWorks Requests Tracking Report*) providing transparency on request status, shop assignments (HVAC, plumbing, carpentry), phase completion dates, and work order backlogs.

3. **SeeClickFix (CivicPlus):**
   *URL:* `https://www.civicplus.help/seeclickfix/docs/requests-list-overview`
   *Domain:* Municipal 311 Citizen Request Management & Civic CRM
   *Documented Scope:* Citizen-facing mobile and web issue intake with photo attachments, GPS geocoding, automated department routing, public request maps, list filtering, status tracking, and community commenting threads.

4. **Anytime Help:**
   *URL:* `https://www.anytimehelp.in/`
   *Domain:* Residential Society & Commercial Facility Maintenance
   *Documented Scope:* Mobile and web management suite providing ticket generation, automated vendor/technician routing, before-and-after photographic evidence attachments, real-time ticket progression tracking, administrative notice boards, and resident-facing announcements.

5. **BenQ X-Sign & X-Sign Broadcast:**
   *URL:* `https://www.benq.com/en-in/business/signage/x-sign-20.html`
   *Domain:* Digital Signage Playout & Campus Display Management
   *Documented Scope:* Enterprise cloud and local-network content management software for BenQ interactive displays and digital signage panels. Features content template creation, calendar scheduling, remote display group distribution, emergency alert overrides, and scrolling text marquees.

6. **IntelliGrid Work-Order Management:**
   *URL:* `https://intelligrid.asia/platform/work-order-management/`
   *Domain:* Enterprise AI & IoT Facilities Management (CAFM/IWMS)
   *Documented Scope:* Comprehensive work-order lifecycle management featuring automated ticket dispatch, mobile technician execution, photographic evidence capture, customer sign-off/acceptance workflows, auditable closure logs, and integration with BMS/IoT sensor telemetry.

7. **IIT Guwahati Green Office:**
   *URL:* `https://www.iitg.ac.in/groff/`
   *Domain:* Campus Sustainability Mandates & Environmental Administration
   *Documented Scope:* Established in November 2013 to coordinate sustainability across IIT Guwahati. Manages the 2-Megawatt rooftop solar installation, building energy audits, organic waste processing via rotary drum composting (*Mati Dhan* organic fertilizer), water body preservation, and campus tree censuses.

8. **U.S. Department of Energy FEMP EMIS Guidance:**
   *URL:* `https://www.energy.gov/cmei/femp/energy-management-information-system-capabilities`
   *Domain:* Measurement & Verification (M&V) and Energy Information Systems
   *Documented Scope:* Outlines technical criteria for Energy Management and Information Systems (EMIS), distinguishing utility-grade interval sub-metering and IPMVP-compliant M&V from modeled energy calculations.

---

## 2. Competitor Capability Mapping

To maintain strict research integrity, capabilities are described based directly on vendor documentation. A capability is never characterized as "absent" merely because it is omitted from a brief summary.

| Evaluation Dimension | IIT Kanpur Campus Care | Texas A&M AggieWorks | SeeClickFix (CivicPlus) | Anytime Help | BenQ X-Sign | IntelliGrid Platform | **CampusPulse (Challenge Prototype)** |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Issue Intake** | Mobile app & web; institutional login / OTP required. | Web portal; NetID SSO + Duo MFA required. | Mobile app & web; public intake with optional account. | Mobile app & web; resident/tenant login required. | Content CMS only; no native incident intake. | Multi-channel: WhatsApp, web, mobile, and IoT sensor triggers. | Lightweight, focused web reporting form; no SSO barrier for demonstration. |
| **2. Triage & Dispatch** | DOIP office manual routing to maintenance units. | AiM CMMS shop routing (HVAC, plumbing, electrical). | Configurable category routing & administrative triage. | Automated routing to designated service teams/vendors. | Schedule-based media distribution to display groups. | Automated dispatch rules, SLA clocks, and skill-based assignment. | Deterministic rule-based priority score (1–100 heuristic). |
| **3. Priority Classification** | Routine vs. Capital Works (DOIP Form 101). | Shop-defined urgency and priority tiers. | Standard severity levels (Emergency, High, Normal, Low). | High, Medium, and Low severity classifications. | Priority broadcast override for emergency alerts. | Risk-based prioritization and automated BMS alarm escalation. | Transparent weighted formula: Urgency (55%), Category (35%), Age (10%). |
| **4. Resolution Documentation** | Post-repair feedback via DOIP-107U satisfaction survey. | AiM CMMS work order closure notes and shop hours. | Staff closure notes with optional photo attachment. | Documented work notes and before-and-after photo evidence. | Expiration time of scheduled signage message. | Digital inspection checklists, photo evidence, and customer sign-off. | Explicit resolution states: Status Recorded, Resolution Note Recorded, Photo Attached. |
| **5. Public Communication** | Bilateral notification via email and SMS. | Desktop Power BI web report showing shop backlog. | Public web map and searchable civic request list. | In-app community announcements and notice board. | Broadcast playout to digital signage and interactive panels. | Facility operations dashboards and executive reports. | Browser-rendered layout designed for a 16:9 display; hardware and signage-platform integration are not implemented. |
| **6. Environmental Metrics** | Operational maintenance tracking; no resource counters. | Facilities labor and materials tracking; no green KPI. | Municipal civic tracking; no resource conservation models. | Society maintenance tracking; no eco-impact counters. | Dedicated signage CMS; no native resource analytics. | Enterprise ESG telemetry, BMS sub-metering, carbon reporting. | Disclosed modeled heuristics; live utility meters are NOT MEASURED (null). |

---

## 3. Detailed Competitor Analysis & Established Industry Capabilities

A rigorous audit confirms that many features frequently assumed to be novel in hackathons are actually well-established across commercial products:

### A. IIT Kanpur Campus Care
* **Established Capabilities:** Dedicated collegiate maintenance ticketing for campus quarters, hostels, and academic departments. Handles routine electrical, water supply, sanitation, and carpentry requests. Provides end-user tracking and surveys.
* **Structural Focus:** Designed as a private administrative work-order pipeline between the campus resident and the DOIP maintenance desk. Focuses on internal work allocation rather than ambient campus-wide visibility.

### B. Texas A&M University AggieWorks
* **Established Capabilities:** Enterprise facilities management built on AssetWorks AiM CMMS. AggieWorks provides an exemplary public-facing Power BI report detailing work order phases, craft shops, and historical resolution dates.
* **Structural Focus:** Optimized as a detailed analytical business-intelligence dashboard for desktop viewing by department heads, staff, and curious campus members. It is not styled as an ambient lobby signage ticker.

### C. SeeClickFix (CivicPlus)
* **Established Capabilities:** Leading civic 311 platform handling hundreds of thousands of municipal reports. Supports citizen photo uploads, GPS coordinates, public comments, status updates, and map views.
* **Structural Focus:** Tailored for municipal geography (roads, parks, utility lines) rather than collegiate campus topologies (hostel blocks, lecture halls, campus eco-zones).

### D. Anytime Help
* **Established Capabilities:** Commercial residential and commercial facility maintenance platform (`anytimehelp.in`). Vendor documentation explicitly describes:
  1. Ticket logging with multi-category classification.
  2. Departmental and vendor routing.
  3. **Before-and-after photographic evidence** attached to repair records.
  4. Real-time ticket status tracking.
  5. Resident-facing announcements and community notice boards.
* **Significance for CampusPulse:** Photographic evidence attachment, status progression, and community announcements are established facility management workflows, **not** novel inventions of CampusPulse.

### E. IntelliGrid Work-Order Management
* **Established Capabilities:** Industrial AI & IoT enterprise platform (`intelligrid.asia`). Vendor documentation explicitly describes:
  1. Work-order creation from user requests or automated BMS alarms.
  2. Skill-based dispatch and mobile technician execution.
  3. **Mandatory evidence capture (photos and inspection notes)**.
  4. **Customer acceptance and sign-off workflows** before ticket closure.
  5. Full audit trails for facility compliance.
* **Significance for CampusPulse:** Auditable closure, technician evidence capture, and multi-step verification are recognized enterprise CMMS standards.

### F. BenQ X-Sign & X-Sign Broadcast
* **Established Capabilities:** Comprehensive digital signage content management software (`benq.com`). Provides calendar playout scheduling, multi-zone screen layouts, interactive touch templates, remote device monitoring, and emergency broadcast text scrolling.
* **Significance for CampusPulse:** Displaying text tickers, images, and announcements on a digital screen is native signage behavior. CampusPulse provides a browser-rendered layout designed for a 16:9 display; hardware and signage-platform integration are not implemented. It is not exclusive to BenQ hardware and does not utilize proprietary BenQ hardware protocols.

### G. U.S. Department of Energy FEMP EMIS Guidelines
* **Established Capabilities:** Establishes standards for Measurement & Verification (M&V). Confirms that true measurement requires interval utility meters, calibrated sub-metering, and IPMVP-compliant baselines.
* **Significance for CampusPulse:** Resolving a maintenance ticket (e.g. turning off an idle AC or repairing a tap) does not constitute measured energy or water savings without live sub-meter telemetry. Any calculated numbers must be identified as **modeled heuristic estimates**, not verified physical measurements.

---

## 4. Commonplace Capabilities vs. Proposed Product Differentiation

### What is Commonplace (Standard Industry Baseline):
1. **Web and Mobile Issue Intake:** Forms with category, location, and description fields are universal across Campus Care, AggieWorks, SeeClickFix, and Anytime Help.
2. **Operations Dashboard with Status Stages:** Moving tickets through `REPORTED` $\to$ `TRIAGED` $\to$ `IN_PROGRESS` $\to$ `RESOLVED` is standard CMMS practice.
3. **Department Routing:** Assigning tickets to electrical, plumbing, or civil units is standard dispatch logic.
4. **Photographic Evidence on Work Orders:** Capturing photos of repaired fixtures is an established feature documented by Anytime Help, IntelliGrid, and SeeClickFix.
5. **Digital Signage Playout:** Displaying scheduled announcements and scrolling text tickers on large displays is standard behavior in tools like BenQ X-Sign.

### Proposed Product-Level Differentiation in CampusPulse:

CampusPulse does **not** claim to have invented ticketing, photo uploads, priority math, or digital signage.

Instead, CampusPulse proposes a **focused, cohesive, and demonstrable product integration** designed specifically for higher-education campuses:

1. **The Closed-Loop Civic Communication Bridge:**
   Collegiate ticketing portals (Campus Care, AggieWorks) typically operate in administrative silos isolated from ambient campus communication networks. CampusPulse bridges this gap by automatically translating operational closures into privacy-safe, ambient 16:9 lobby signage ticker feeds—closing the loop from Report to Resolution.
2. **Explicit Resolution-Evidence Separation:**
   Rather than treating a "Closed" database flag as proof of completion, CampusPulse explicitly distinguishes:
   * `STATUS RECORDED`: Status changed in the operations queue; no documentation attached.
   * `OPERATOR DOCUMENTED`: Maintenance operator logged a meaningful work note ($\ge 10$ chars).
   * `EVIDENCE ATTACHED`: Supporting photograph or inspection voucher attached and on file.
3. **Transparent Environmental-Data Provenance:**
   Unlike platforms that display unverified green claims, CampusPulse explicitly categorizes data origin:
   * `MEASURED`: Physical utility sub-meters (`NOT MEASURED` / null in this prototype due to absence of live telemetry).
   * `MODELED ESTIMATE`: Derived from disclosed formulas and illustrative constants (avoided equipment kW $\times$ idle hours).
   * `NOT MEASURED`: Civil hardware repairs with no defensible physical resource metric.
4. **Demonstrable Same-Browser Cross-Tab Synchronization:**
   Enables a live dual-screen demonstration (Operations Dashboard in Tab 1, Campus Signage in Tab 2) where status updates synchronize instantaneously across tabs via browser-native storage events without requiring an external backend server.

---

## 5. Clarification on Environmental Constants & Institutional Claims

* **IIT Guwahati Green Office:**
  The Green Office coordinates campus sustainability, energy audits, a 2MW solar array, and rotary drum composting (*Mati Dhan*). However, **the specific numerical downtime constants used in the prototype code (e.g. 15 kWh per AC ticket, 350 L per water leak, 25 kg per compost bin) are illustrative demonstration constants created for this prototype**, NOT verified empirical statistics published by the IIT Guwahati Green Office.
* **No False Affiliation Claims:**
  CampusPulse is a student competition prototype developed for the BenQ × Hackyard 2026 challenge at IIT Guwahati. It is not an officially deployed system of IIT Guwahati administration, nor an officially integrated product of BenQ Corporation.

---

*Report synchronized with authoritative challenge guidelines and official primary sources.*