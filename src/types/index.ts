export type IssueCategory =
  | 'ENERGY'        // e.g. HVAC on in empty lecture hall, lights during daytime
  | 'WATER'         // e.g. Leaking pipe, running valve, geyser malfunction
  | 'WASTE'         // e.g. Composting bin overflow, unsegregated trash
  | 'SAFETY'        // e.g. Broken pathway lighting, slippery hazard
  | 'FACILITIES';   // e.g. Projector sync fault, broken desk/fixture

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type IssueStatus = 'REPORTED' | 'TRIAGED' | 'IN_PROGRESS' | 'RESOLVED';

export type CampusZone =
  | 'Core 1 Lecture Complex'
  | 'Hostels (Manas / Brahmaputra)'
  | 'Central Library & Admin'
  | 'Food Court & Market Area'
  | 'Sports Complex & Grounds'
  | 'Green Belt & Riverfront Path';

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  actor: string;
  note?: string;
}

// Feature A: Explicit Resolution-Evidence States
export type ResolutionEvidenceState =
  | 'STATUS_RECORDED'       // Ticket status recorded; no resolution documentation or supporting evidence on file
  | 'OPERATOR_DOCUMENTED'   // Operator recorded a meaningful resolution work note
  | 'EVIDENCE_ATTACHED';    // Supporting physical evidence (e.g. photo/work slip) attached to resolution record

export interface EvidenceAttachment {
  id: string;
  name: string;
  type: string;             // e.g. 'image/jpeg' | 'image/png' | 'image/webp'
  size: number;             // in bytes
  dataUrl?: string;         // base64 image data URL (downscaled for storage)
  caption?: string;
  uploadedAt: string;
}

// Feature D: Environmental-Data Provenance Model
export type ProvenanceBasis = 'MEASURED' | 'MODELLED' | 'NOT_MEASURED';

export interface EcoImpactProvenance {
  type: 'kwh' | 'liters' | 'kg_waste' | 'general';
  basis: ProvenanceBasis;   // MEASURED, MODELLED, or NOT_MEASURED
  value: number | null;     // null if NOT_MEASURED
  unit: string;
  label: string;
  formulaDisclosed?: string;
  assumptionsDisclosed?: string;
  disclaimer: string;
}

export interface CampusIssue {
  id: string;
  ticketNumber: string; // e.g. "CP-1042"
  title: string;
  category: IssueCategory;
  location: string;
  zone: CampusZone;
  urgency: UrgencyLevel;
  priorityScore: number; // 1 - 100
  priorityTier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  reporterName?: string;
  reportedAt: string;    // ISO timestamp
  status: IssueStatus;
  assignedTo?: string;   // e.g. "Campus Electrical Wing"
  resolutionNotes?: string;
  resolvedAt?: string;   // ISO timestamp
  evidenceState: ResolutionEvidenceState;
  evidenceAttachment?: EvidenceAttachment;
  ecoImpact?: EcoImpactProvenance;
  auditHistory: AuditLogEntry[];
}

export type UserRole = 'landing' | 'student' | 'operations' | 'benq-kiosk';

export interface EcoMetrics {
  // Separated Measured Totals (null when no live utility-meter data feed is connected)
  totalMeasuredKwhSaved: number | null;
  totalMeasuredLitersPreserved: number | null;
  totalMeasuredWasteDivertedKg: number | null;

  // Disclosed Modelled Heuristic Estimates
  totalModelledKwhSaved: number;
  totalModelledLitersPreserved: number;
  totalModelledWasteDivertedKg: number;

  // Legacy compat fields
  totalKwhSaved?: number;
  totalLitersPreserved?: number;
  totalWasteDivertedKg?: number;

  // Verification & Evidence Breakdown
  activeResolvedCount: number;
  evidenceAttachedCount: number;
  operatorDocumentedCount: number;
  statusRecordedCount: number;
}
