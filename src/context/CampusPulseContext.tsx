import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useMemo } from 'react';
import {
  CampusIssue,
  EcoMetrics,
  UserRole,
  IssueStatus,
  IssueCategory,
  UrgencyLevel,
  CampusZone,
  ResolutionEvidenceState,
  EvidenceAttachment,
  ProvenanceBasis
} from '../types';
import { calculatePriorityScore } from '../utils/priority';

interface ToastState {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface NewIssuePayload {
  title: string;
  category: IssueCategory;
  location: string;
  zone: CampusZone;
  urgency: UrgencyLevel;
  description: string;
  reporterName?: string;
}

interface CampusPulseContextType {
  issues: CampusIssue[];
  ecoMetrics: EcoMetrics;
  activeRole: UserRole;
  selectedIssueId: string | null;
  toast: ToastState | null;
  lastCrossTabSync: number | null;
  addIssue: (payload: NewIssuePayload) => CampusIssue;
  updateIssueStatus: (
    id: string,
    newStatus: IssueStatus,
    assignedTo?: string,
    resolutionNotes?: string,
    evidenceState?: ResolutionEvidenceState,
    evidenceAttachment?: EvidenceAttachment
  ) => void;
  clearLocalReports: () => void;
  resetToDemoData: () => void; // Backward-compatible alias to clearLocalReports
  setActiveRole: (role: UserRole) => void;
  setSelectedIssueId: (id: string | null) => void;
  triggerToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export const STORAGE_KEY_ISSUES = 'campuspulse_issues_v4';
export const STORAGE_KEY_METRICS = 'campuspulse_metrics_v4';

// Known legacy demonstration seed IDs to exclude during storage migration
export const KNOWN_SEED_IDS = new Set([
  'issue-1041',
  'issue-1038',
  'issue-1035',
  'issue-1029',
  'issue-1024',
  'issue-1019',
  'issue-1012'
]);

/**
 * Resolves the application role from URL hash or query parameters.
 * Preserves the landing page view on in-page anchor navigation.
 */
export function resolveAppRole(hashString: string, searchString: string = '', currentRole: UserRole = 'landing'): UserRole {
  const hash = (hashString || '').toLowerCase();
  if (hash === '#kiosk' || hash === '#signage' || hash === '#benq-kiosk') return 'benq-kiosk';
  if (hash === '#operations' || hash === '#ops' || hash === '#admin') return 'operations';
  if (hash === '#student' || hash === '#report') return 'student';
  if (hash === '#landing') return 'landing';

  // In-page anchors on landing page preserve the landing view
  if (hash.startsWith('#how-it-works') || hash.startsWith('#workspaces') || hash.startsWith('#trust-ledger')) {
    return 'landing';
  }

  // Inspect query string if hash is empty or root
  if (searchString) {
    const params = new URLSearchParams(searchString);
    const view = (params.get('view') || params.get('role') || '').toLowerCase();
    if (view === 'benq-kiosk' || view === 'kiosk' || view === 'signage') return 'benq-kiosk';
    if (view === 'operations' || view === 'ops' || view === 'admin') return 'operations';
    if (view === 'student' || view === 'report') return 'student';
    if (view === 'landing') return 'landing';
  }

  if (hash === '' || hash === '#' || hash === '#/') return 'landing';

  return currentRole;
}

/**
 * Migrates and sanitizes stored issues from local storage.
 * Reliably removes known demonstration seeds while strictly preserving legitimate user records.
 * Idempotent and safe against corrupted/malformed JSON.
 */
export function migrateStorageIssues(rawSaved: string | null): CampusIssue[] {
  if (!rawSaved) return [];
  try {
    const parsed = JSON.parse(rawSaved);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    return parsed.filter((item: any) => {
      if (!item || typeof item.id !== 'string') return false;

      // Disambiguate legacy demonstration seeds from genuine user records:
      // A legacy seed has an ID in KNOWN_SEED_IDS AND matches seed titles, simulation markers, or legacy demo patterns.
      if (KNOWN_SEED_IDS.has(item.id)) {
        const titleStr = typeof item.title === 'string' ? item.title.toLowerCase() : '';
        const isLegacySeedTitle =
          titleStr.includes('seed') ||
          titleStr.includes('ac left running') ||
          titleStr.includes('slow tap drip') ||
          titleStr.includes('solar water heater') ||
          titleStr.includes('water cooler compressor') ||
          titleStr.includes('solid waste segregation') ||
          titleStr.includes('streetlight photocell') ||
          titleStr.includes('smart meter telemetry');

        const hasSimulationMarker = Array.isArray(item.auditHistory) && item.auditHistory.some((a: any) =>
          typeof a?.note === 'string' && (
            a.note.includes('Simulated') ||
            a.note.includes('demonstration') ||
            a.note.includes('demo')
          )
        );

        if (isLegacySeedTitle || hasSimulationMarker || !item.title) {
          return false;
        }
      }

      // Check for simulated demonstration marker in audit notes on any record
      if (Array.isArray(item.auditHistory)) {
        const isSimulated = item.auditHistory.some((a: any) =>
          typeof a?.note === 'string' && a.note.includes('Simulated demonstration record')
        );
        if (isSimulated) return false;
      }
      return true;
    }).map((item: any) => {
      let evidenceState: ResolutionEvidenceState = item.evidenceState;
      if (!evidenceState) {
        if (item.status === 'RESOLVED' && item.resolutionNotes && item.resolutionNotes.length >= 10) {
          evidenceState = 'OPERATOR_DOCUMENTED';
        } else {
          evidenceState = 'STATUS_RECORDED';
        }
      } else if (evidenceState === 'EVIDENCE_ATTACHED' && (!item.evidenceAttachment || !item.evidenceAttachment.dataUrl)) {
        evidenceState = (item.resolutionNotes && item.resolutionNotes.trim().length >= 10)
          ? 'OPERATOR_DOCUMENTED'
          : 'STATUS_RECORDED';
      }

      let ecoImpact = item.ecoImpact;
      if (ecoImpact && !ecoImpact.basis) {
        ecoImpact = {
          ...ecoImpact,
          basis: (ecoImpact.type === 'general' ? 'NOT_MEASURED' : 'MODELLED') as ProvenanceBasis,
          unit: ecoImpact.type === 'kwh' ? 'kWh' : ecoImpact.type === 'liters' ? 'Liters' : ecoImpact.type === 'kg_waste' ? 'kg' : 'N/A',
          formulaDisclosed: 'Standard illustrative downtime heuristic',
          assumptionsDisclosed: 'Routine facility maintenance demonstration baseline',
          disclaimer: 'Illustrative model estimate; not an active utility sub-meter reading.',
        };
      }

      return {
        ...item,
        evidenceState,
        ecoImpact,
      };
    });
  } catch (e) {
    console.warn('Corrupted issues in localStorage, safely recovering with clean empty state:', e);
    return [];
  }
}

/**
 * Derives environmental and resolution metrics dynamically and truthfully
 * from the actual set of user-created issues in the persistence layer.
 */
export const computeEcoMetrics = (currentIssues: CampusIssue[]): EcoMetrics => {
  const resolved = currentIssues.filter(i => i.status === 'RESOLVED');
  let totalModelledKwh = 0;
  let totalModelledLiters = 0;
  let totalModelledWaste = 0;

  for (const iss of resolved) {
    if (iss.ecoImpact && iss.ecoImpact.basis === 'MODELLED' && typeof iss.ecoImpact.value === 'number') {
      if (iss.ecoImpact.type === 'kwh') totalModelledKwh += iss.ecoImpact.value;
      if (iss.ecoImpact.type === 'liters') totalModelledLiters += iss.ecoImpact.value;
      if (iss.ecoImpact.type === 'kg_waste') totalModelledWaste += iss.ecoImpact.value;
    }
  }

  return {
    totalMeasuredKwhSaved: null,
    totalMeasuredLitersPreserved: null,
    totalMeasuredWasteDivertedKg: null,
    totalModelledKwhSaved: totalModelledKwh,
    totalModelledLitersPreserved: totalModelledLiters,
    totalModelledWasteDivertedKg: totalModelledWaste,
    totalKwhSaved: totalModelledKwh,
    totalLitersPreserved: totalModelledLiters,
    totalWasteDivertedKg: totalModelledWaste,
    activeResolvedCount: resolved.length,
    evidenceAttachedCount: resolved.filter(i => i.evidenceState === 'EVIDENCE_ATTACHED').length,
    operatorDocumentedCount: resolved.filter(i => i.evidenceState === 'OPERATOR_DOCUMENTED').length,
    statusRecordedCount: resolved.filter(i => i.evidenceState === 'STATUS_RECORDED').length,
  };
};

export const CampusPulseContext = createContext<CampusPulseContextType | undefined>(undefined);

export const CampusPulseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Safe loader for issues with targeted seed-data migration & zero fabricated initial data
  const [issues, setIssues] = useState<CampusIssue[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const v4Data = localStorage.getItem(STORAGE_KEY_ISSUES);
      if (v4Data) {
        return migrateStorageIssues(v4Data);
      }
      const legacyData = localStorage.getItem('campuspulse_issues_v3');
      if (legacyData) {
        const migrated = migrateStorageIssues(legacyData);
        try {
          localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(migrated));
        } catch (e) {
          console.warn('Storage write error during v4 migration:', e);
        }
        return migrated;
      }
    } catch (e) {
      console.warn('Corrupted issues in localStorage, safely recovering with clean empty state:', e);
    }
    // Truthful default: fresh installation starts with an empty collection
    return [];
  });

  // Calculate eco metrics dynamically from issues
  const ecoMetrics = useMemo(() => computeEcoMetrics(issues), [issues]);

  // URL hash / query inspection for independent multi-tab role initialization
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      return resolveAppRole(window.location.hash, window.location.search, 'landing');
    }
    // Default root route renders the Public Landing Page
    return 'landing';
  });

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      if (role === 'landing') {
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        const hash = role === 'benq-kiosk' ? '#kiosk' : role === 'operations' ? '#operations' : '#report';
        window.history.replaceState(null, '', hash);
      }
    }
  };

  // Sync role on hash change without conflict with in-page anchor navigation
  useEffect(() => {
    const handleHashChange = () => {
      setActiveRoleState(prev => resolveAppRole(window.location.hash, window.location.search, prev));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [lastCrossTabSync, setLastCrossTabSync] = useState<number | null>(null);

  // Refs to prevent write-back loops when handling cross-tab storage events
  const isRemoteUpdateRef = useRef(false);

  // Cross-tab synchronization via browser-native storage events
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.storageArea && event.storageArea !== localStorage) return;

      // Handle external storage clear
      if (event.key === null || event.key === STORAGE_KEY_ISSUES) {
        if (!event.newValue || event.newValue === '[]') {
          isRemoteUpdateRef.current = true;
          setIssues([]);
          setLastCrossTabSync(Date.now());
          return;
        }

        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            // Filter out seed records
            const sanitized: CampusIssue[] = parsed
              .filter((item: any) => item && typeof item.id === 'string' && !KNOWN_SEED_IDS.has(item.id))
              .map((iss: CampusIssue) => {
                if (iss.evidenceState === 'EVIDENCE_ATTACHED' && (!iss.evidenceAttachment || !iss.evidenceAttachment.dataUrl)) {
                  return {
                    ...iss,
                    evidenceState: (iss.resolutionNotes && iss.resolutionNotes.trim().length >= 10) ? 'OPERATOR_DOCUMENTED' : 'STATUS_RECORDED',
                    evidenceAttachment: undefined,
                  };
                }
                return iss;
              });

            isRemoteUpdateRef.current = true;
            setIssues(sanitized);
            setLastCrossTabSync(Date.now());
          }
        } catch (e) {
          console.warn('Malformed issues payload received in storage event:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Sync state to localStorage whenever it updates, with graceful quota protection and loop prevention
  useEffect(() => {
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));
      localStorage.setItem(STORAGE_KEY_METRICS, JSON.stringify(ecoMetrics));
    } catch (e) {
      console.warn('LocalStorage write error for issues, managing storage quota:', e);
      try {
        let hasDowngraded = false;
        const downgraded: CampusIssue[] = issues.map((iss) => {
          if (iss.evidenceState === 'EVIDENCE_ATTACHED' || iss.evidenceAttachment) {
            hasDowngraded = true;
            const newEvidenceState: ResolutionEvidenceState = (iss.resolutionNotes && iss.resolutionNotes.trim().length >= 10)
              ? 'OPERATOR_DOCUMENTED'
              : 'STATUS_RECORDED';
            return {
              ...iss,
              evidenceState: newEvidenceState,
              evidenceAttachment: undefined,
            };
          }
          return iss;
        });

        localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(downgraded));
        if (hasDowngraded) {
          isRemoteUpdateRef.current = true;
          setIssues(downgraded);
          triggerToast('Storage quota reached. Photos were not stored; documented notes preserved.', 'warning');
        }
      } catch (innerError) {
        console.error('Critical storage failure after quota fallback:', innerError);
      }
    }
  }, [issues, ecoMetrics]);

  const triggerToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToast({ id, text, type });
  };

  // Add new issue with deterministic priority and clean provenance metadata
  const addIssue = (payload: NewIssuePayload): CampusIssue => {
    const hoursOpen = 0;
    const { score, tier } = calculatePriorityScore(payload.urgency, payload.category, hoursOpen);

    // Compute standard model parameters based on category
    let ecoImpact: CampusIssue['ecoImpact'];
    if (payload.category === 'ENERGY') {
      ecoImpact = {
        type: 'kwh',
        basis: 'MODELLED',
        value: payload.urgency === 'HIGH' || payload.urgency === 'EMERGENCY' ? 25 : 10,
        unit: 'kWh',
        label: '~20 kWh estimated potential power waste avoided',
        formulaDisclosed: 'Power Rating (4.0 kW) × Avoidable Idle Duration (5.0 hrs)',
        assumptionsDisclosed: 'Reported unattended electrical/cooling fixture',
        disclaimer: 'Illustrative model estimate; no physical sub-meter connected.',
      };
    } else if (payload.category === 'WATER') {
      ecoImpact = {
        type: 'liters',
        basis: 'MODELLED',
        value: payload.urgency === 'HIGH' || payload.urgency === 'EMERGENCY' ? 450 : 150,
        unit: 'Liters',
        label: '~400 L/day estimated freshwater loss',
        formulaDisclosed: 'Leak Rate (18.7 L/hr) × Avoidable Run Duration (24 hrs)',
        assumptionsDisclosed: 'Standard plumbing fixture seepage at 2.2 bar pressure',
        disclaimer: 'Illustrative model estimate; continuous sub-riser flow metering is not installed.',
      };
    } else if (payload.category === 'WASTE') {
      ecoImpact = {
        type: 'kg_waste',
        basis: 'MODELLED',
        value: 30,
        unit: 'kg',
        label: '~30 kg segregated organic matter',
        formulaDisclosed: 'Receptacle Volume (60 L) × Bulk Density (0.5 kg/L)',
        assumptionsDisclosed: 'Standard campus collection bin capacity',
        disclaimer: 'Illustrative volumetric estimation; continuous weight sensors not present on bins.',
      };
    } else {
      ecoImpact = {
        type: 'general',
        basis: 'NOT_MEASURED',
        value: null,
        unit: 'N/A',
        label: 'Zero resource claim — Safety/Civil item',
        formulaDisclosed: 'Not applicable — Civil safety maintenance',
        assumptionsDisclosed: 'Non-utility maintenance; no resource savings claimed',
        disclaimer: 'CampusPulse does not calculate false resource savings on mechanical/safety repairs.',
      };
    }

    const nextSeq = issues.length + 1042;
    const ticketNumber = `CP-${nextSeq}`;
    const now = new Date().toISOString();

    const newIssue: CampusIssue = {
      id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ticketNumber,
      title: payload.title.trim(),
      category: payload.category,
      location: payload.location.trim(),
      zone: payload.zone,
      urgency: payload.urgency,
      priorityScore: score,
      priorityTier: tier,
      description: payload.description.trim(),
      reporterName: payload.reporterName ? payload.reporterName.trim() : 'Campus Resident',
      reportedAt: now,
      status: 'REPORTED',
      evidenceState: 'STATUS_RECORDED',
      ecoImpact,
      auditHistory: [
        {
          timestamp: now,
          action: 'Report Submitted',
          actor: payload.reporterName ? payload.reporterName.trim() : 'Campus Resident',
          note: 'Submitted via campus intake form',
        },
      ],
    };

    setIssues((prev) => [newIssue, ...prev]);
    triggerToast(`Report ${ticketNumber} recorded with priority score ${score}/100.`, 'success');
    return newIssue;
  };

  // Update status with explicit resolution evidence handling
  const updateIssueStatus = (
    id: string,
    newStatus: IssueStatus,
    assignedTo?: string,
    resolutionNotes?: string,
    evidenceState?: ResolutionEvidenceState,
    evidenceAttachment?: EvidenceAttachment
  ) => {
    const now = new Date().toISOString();

    setIssues((prevIssues) =>
      prevIssues.map((issue) => {
        if (issue.id !== id) return issue;

        const updatedAudit = [...issue.auditHistory];
        let actionDesc = `Status updated to ${newStatus}`;
        let actorName = 'Maintenance Operations';

        if (newStatus === 'TRIAGED') {
          actionDesc = 'Ticket Triaged';
          actorName = 'Operations Desk';
        } else if (newStatus === 'IN_PROGRESS') {
          actionDesc = 'Dispatched / In Progress';
          actorName = assignedTo || issue.assignedTo || 'Local operator entry';
        } else if (newStatus === 'RESOLVED') {
          actionDesc = 'Ticket Resolved';
          actorName = assignedTo || issue.assignedTo || 'Local operator entry';
        }

        const noteSnippet = resolutionNotes
          ? ` (${resolutionNotes.substring(0, 40)}${resolutionNotes.length > 40 ? '...' : ''})`
          : '';

        updatedAudit.push({
          timestamp: now,
          action: actionDesc,
          actor: actorName,
          note: assignedTo
            ? `Assigned to ${assignedTo}${noteSnippet}`
            : resolutionNotes
            ? resolutionNotes
            : undefined,
        });

        let finalEvidenceState: ResolutionEvidenceState = issue.evidenceState;
        let finalAttachment = issue.evidenceAttachment;

        if (newStatus === 'RESOLVED') {
          const hasAttachment = Boolean(evidenceAttachment && evidenceAttachment.dataUrl);
          const hasNotes = Boolean(resolutionNotes && resolutionNotes.trim().length >= 10);

          if (evidenceState === 'EVIDENCE_ATTACHED') {
            if (hasAttachment && hasNotes) {
              finalEvidenceState = 'EVIDENCE_ATTACHED';
              finalAttachment = evidenceAttachment;
            } else if (hasNotes) {
              finalEvidenceState = 'OPERATOR_DOCUMENTED';
              finalAttachment = undefined;
            } else {
              finalEvidenceState = 'STATUS_RECORDED';
              finalAttachment = undefined;
            }
          } else if (evidenceState === 'OPERATOR_DOCUMENTED') {
            finalEvidenceState = hasNotes ? 'OPERATOR_DOCUMENTED' : 'STATUS_RECORDED';
            finalAttachment = undefined;
          } else {
            finalEvidenceState = 'STATUS_RECORDED';
            finalAttachment = undefined;
          }

          const label = finalEvidenceState === 'EVIDENCE_ATTACHED'
            ? 'Photo attached'
            : finalEvidenceState === 'OPERATOR_DOCUMENTED'
            ? 'Note recorded'
            : 'Status recorded';
          triggerToast(
            `Issue ${issue.ticketNumber} marked RESOLVED (${label}).`,
            'success'
          );
        } else {
          triggerToast(`Issue ${issue.ticketNumber} updated to ${newStatus.replace('_', ' ')}.`, 'info');
        }

        return {
          ...issue,
          status: newStatus,
          assignedTo: assignedTo !== undefined ? assignedTo : issue.assignedTo,
          resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : issue.resolutionNotes,
          resolvedAt: newStatus === 'RESOLVED' ? now : issue.resolvedAt,
          evidenceState: finalEvidenceState,
          evidenceAttachment: finalAttachment,
          auditHistory: updatedAudit,
        };
      })
    );
  };

  // Clear locally saved reports with deliberate user action
  const clearLocalReports = () => {
    setIssues([]);
    setSelectedIssueId(null);
    try {
      localStorage.removeItem(STORAGE_KEY_ISSUES);
      localStorage.removeItem(STORAGE_KEY_METRICS);
    } catch (e) {
      console.error('Error clearing local reports:', e);
    }
    triggerToast('All locally stored reports have been cleared.', 'info');
  };

  return (
    <CampusPulseContext.Provider
      value={{
        issues,
        ecoMetrics,
        activeRole,
        selectedIssueId,
        toast,
        lastCrossTabSync,
        addIssue,
        updateIssueStatus,
        clearLocalReports,
        resetToDemoData: clearLocalReports,
        setActiveRole,
        setSelectedIssueId,
        triggerToast,
      }}
    >
      {children}
    </CampusPulseContext.Provider>
  );
};

export const useCampusPulse = () => {
  const context = useContext(CampusPulseContext);
  if (!context) {
    throw new Error('useCampusPulse must be used within a CampusPulseProvider');
  }
  return context;
};
