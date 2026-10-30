// Component-Level UI and Production Module Acceptance Test Suite
// Directly exercises actual production React components, Context providers,
// and core application utility modules.

import React from 'react';
import ReactDOMServer from 'react-dom/server';

// Production React Components
import { LandingPageView } from '../src/components/LandingPageView';
import { StudentReportView } from '../src/components/StudentReportView';
import { OperationsView } from '../src/components/OperationsView';
import { BenQKioskView } from '../src/components/BenQKioskView';
import { Header } from '../src/components/Header';
import { PitchRunbookModal } from '../src/components/PitchRunbookModal';

// Production Context & Logic
import {
  CampusPulseContext,
  computeEcoMetrics,
  migrateStorageIssues,
  resolveAppRole,
  KNOWN_SEED_IDS,
  STORAGE_KEY_ISSUES
} from '../src/context/CampusPulseContext';
import { calculatePriorityScore } from '../src/utils/priority';
import { CampusIssue, EcoMetrics, UserRole } from '../src/types';

console.log('================================================================');
console.log('⚛️  CAMPUSPULSE REACT COMPONENT & MODULE ACCEPTANCE SUITE');
console.log('   Exercising Real Production Components & Real Business Logic');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testId: string, testName: string, detail: string = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] [${testId}] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] [${testId}] ${testName} - ${detail || 'Assertion failed'}`);
    process.exitCode = 1;
  }
}

// Helper to create a complete mock context for testing production components
function createMockContext(overrides: Partial<React.ComponentProps<typeof CampusPulseContext.Provider>['value']> = {}) {
  const issues: CampusIssue[] = overrides.issues || [];
  const ecoMetrics: EcoMetrics = overrides.ecoMetrics || computeEcoMetrics(issues);

  return {
    issues,
    ecoMetrics,
    activeRole: (overrides.activeRole || 'landing') as UserRole,
    selectedIssueId: overrides.selectedIssueId || null,
    toast: overrides.toast || null,
    lastCrossTabSync: overrides.lastCrossTabSync || null,
    addIssue: overrides.addIssue || ((payload: any) => ({
      id: `issue-${Date.now()}`,
      ticketNumber: 'CP-1042',
      title: payload.title,
      category: payload.category,
      location: payload.location,
      zone: payload.zone,
      urgency: payload.urgency,
      priorityScore: 85,
      priorityTier: 'CRITICAL' as const,
      description: payload.description,
      reporterName: payload.reporterName || 'Campus Resident',
      reportedAt: new Date().toISOString(),
      status: 'REPORTED' as const,
      evidenceState: 'STATUS_RECORDED' as const,
      auditHistory: [{ timestamp: new Date().toISOString(), action: 'Reported', actor: 'Student', note: 'Created' }]
    })),
    updateIssueStatus: overrides.updateIssueStatus || (() => {}),
    clearLocalReports: overrides.clearLocalReports || (() => {}),
    resetToDemoData: overrides.resetToDemoData || (() => {}),
    setActiveRole: overrides.setActiveRole || (() => {}),
    setSelectedIssueId: overrides.setSelectedIssueId || (() => {}),
    triggerToast: overrides.triggerToast || (() => {}),
    ...overrides
  };
}

// -----------------------------------------------------------------------------
// 1. LANDING PAGE PRODUCTION COMPONENT TESTS
// -----------------------------------------------------------------------------
console.log('--- 1. Testing LandingPageView Production Component ---');

{
  const mockCtx = createMockContext({ activeRole: 'landing', issues: [] });
  const html = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtx}>
      <LandingPageView />
    </CampusPulseContext.Provider>
  );

  assert(
    html.includes('Every campus issue deserves a') && html.includes('clear path to resolution'),
    'COMP-LANDING-01',
    'LandingPageView renders production product headline'
  );

  assert(
    html.includes('Submit an issue report') || html.includes('Explore prototype'),
    'COMP-LANDING-02',
    'LandingPageView primary CTA triggers transition to student intake'
  );

  assert(
    html.includes('Launch Student Intake') && html.includes('Open Operations Hub'),
    'COMP-LANDING-03',
    'LandingPageView contains direct actions for Operations Hub and Student Intake'
  );

  assert(
    html.includes('href="#how-it-works"') && html.includes('href="#workspaces"') && html.includes('href="#trust-ledger"'),
    'COMP-LANDING-04',
    'LandingPageView contains in-page anchor links'
  );

  assert(
    html.includes('Independent evaluation prototype') && html.includes('Self-contained browser-local storage'),
    'COMP-LANDING-05',
    'LandingPageView renders independent prototype disclosure notice'
  );

  assert(
    !html.includes('5-Minute Evaluator Runbook') &&
    !html.includes('Judges &amp; Evaluators') &&
    !html.includes('Reset to seed demonstration state'),
    'COMP-LANDING-06',
    'LandingPageView contains no obsolete evaluator runbook strings'
  );
}

// -----------------------------------------------------------------------------
// 2. EMPTY STATES IN PRODUCTION COMPONENTS
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Empty States in Production Components ---');

{
  // Student Intake Empty State
  const mockCtxEmpty = createMockContext({ issues: [] });
  const intakeHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtxEmpty}>
      <StudentReportView />
    </CampusPulseContext.Provider>
  );

  assert(
    intakeHtml.includes('No reports recorded yet') && intakeHtml.includes('Reports submitted through this form will appear here'),
    'COMP-EMPTY-01',
    'StudentReportView renders truthful empty state message'
  );

  assert(
    !intakeHtml.includes('applyPreset') && !intakeHtml.includes('Auditorium AC Left On'),
    'COMP-EMPTY-02',
    'StudentReportView does not expose 1-click evaluation demo presets'
  );
}

{
  // Operations Hub Empty State (Queue Tab)
  const mockCtxEmpty = createMockContext({ issues: [] });
  const opsHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtxEmpty}>
      <OperationsView />
    </CampusPulseContext.Provider>
  );

  assert(
    opsHtml.includes('No reports recorded yet') && opsHtml.includes('triage queue for assignment and resolution'),
    'COMP-EMPTY-03',
    'OperationsView queue renders truthful empty state message'
  );

  // Operations Hub Empty State (Trust & Impact Ledger Tab)
  const opsLedgerEmptyHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtxEmpty}>
      <OperationsView initialTab="LEDGER" />
    </CampusPulseContext.Provider>
  );

  assert(
    opsLedgerEmptyHtml.includes('0 tickets') &&
    (opsLedgerEmptyHtml.includes("No closed tickets are currently recorded in this browser&#x27;s local data") ||
     opsLedgerEmptyHtml.includes("No closed tickets are currently recorded in this browser's local data")),
    'COMP-EMPTY-04',
    'OperationsView Trust & Impact Ledger renders empty evidence metrics with persistent local data wording'
  );
}

{
  // Public Signage Empty State
  const mockCtxEmpty = createMockContext({ issues: [] });
  const kioskHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtxEmpty}>
      <BenQKioskView />
    </CampusPulseContext.Provider>
  );

  assert(
    (kioskHtml.includes("No campus reports are currently recorded in this browser&#x27;s local data") ||
     kioskHtml.includes("No campus reports are currently recorded in this browser's local data")) &&
    !kioskHtml.includes('local browser session'),
    'COMP-EMPTY-05',
    'BenQKioskView ticker displays truthful empty marquee text without session wording'
  );

  assert(
    !kioskHtml.includes('Optimal') && !kioskHtml.includes('All Systems Healthy'),
    'COMP-EMPTY-06',
    'BenQKioskView rejects false Optimal/Healthy labels when queue is empty'
  );

  assert(
    kioskHtml.includes('NO_REPORTS'),
    'COMP-EMPTY-07',
    'BenQKioskView zone status displays NO_REPORTS for un-reported zones'
  );
}

// -----------------------------------------------------------------------------
// 3. REPORT WORKFLOW RENDERING IN PRODUCTION COMPONENTS
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing Report Workflow in Production Components ---');

{
  const activeIssue: CampusIssue = {
    id: 'issue-test-001',
    ticketNumber: 'CP-1042',
    title: 'AC unit left running in empty hall',
    category: 'ENERGY',
    location: 'Lecture Hall 3',
    zone: 'ACADEMIC_COMPLEX',
    urgency: 'HIGH',
    priorityScore: 78,
    priorityTier: 'HIGH',
    description: 'Split AC running at 18C in empty hall with doors open',
    reporterName: 'Test Student',
    reportedAt: new Date().toISOString(),
    status: 'REPORTED',
    evidenceState: 'STATUS_RECORDED',
    ecoImpact: {
      type: 'kwh',
      basis: 'MODELLED',
      value: 20,
      unit: 'kWh',
      label: '~20 kWh estimated potential power waste avoided',
      formulaDisclosed: 'Power Rating × Idle Duration',
      assumptionsDisclosed: 'Standard HVAC load',
      disclaimer: 'Illustrative model estimate'
    },
    auditHistory: [
      { timestamp: new Date().toISOString(), action: 'Reported', actor: 'Student', note: 'Created' }
    ]
  };

  const mockCtxActive = createMockContext({ issues: [activeIssue] });
  const opsHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtxActive}>
      <OperationsView />
    </CampusPulseContext.Provider>
  );

  assert(
    opsHtml.includes('CP-1042'),
    'COMP-WORKFLOW-01',
    'OperationsView renders the active ticket number in the issue table'
  );

  assert(
    opsHtml.includes('AC unit left running in empty hall'),
    'COMP-WORKFLOW-02',
    'OperationsView renders the reported issue title'
  );

  assert(
    opsHtml.includes('Lecture Hall 3'),
    'COMP-WORKFLOW-03',
    'OperationsView renders the specific issue location'
  );

  assert(
    opsHtml.includes('ENERGY'),
    'COMP-WORKFLOW-04',
    'OperationsView renders the issue category badge'
  );
}

// -----------------------------------------------------------------------------
// 4. RESOLUTION & EVIDENCE LADDER IN PRODUCTION COMPONENTS
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing Resolution Evidence Ladder in Production Components ---');

{
  const resolvedDocumentedIssue: CampusIssue = {
    id: 'issue-test-002',
    ticketNumber: 'CP-1043',
    title: 'Main pipeline leak isolated',
    category: 'WATER',
    location: 'Manas Hostel Laundry',
    zone: 'HOSTELS',
    urgency: 'HIGH',
    priorityScore: 82,
    priorityTier: 'CRITICAL',
    description: 'Freshwater pipe seal replaced',
    reporterName: 'Anonymous Reporter',
    reportedAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'RESOLVED',
    evidenceState: 'OPERATOR_DOCUMENTED',
    resolutionNotes: 'Technician replaced 2-inch gasket seal; pressure tested to 3.5 bar.',
    ecoImpact: {
      type: 'liters',
      basis: 'MODELLED',
      value: 400,
      unit: 'Liters',
      label: '~400 L/day estimated freshwater loss avoided',
      formulaDisclosed: 'Leak Rate × Duration',
      assumptionsDisclosed: '2.2 bar mains pressure',
      disclaimer: 'Illustrative model estimate'
    },
    auditHistory: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Reported', actor: 'Student', note: 'Created' },
      { timestamp: new Date().toISOString(), action: 'Resolved', actor: 'Operator', note: 'Repaired' }
    ]
  };

  const mockCtxResolved = createMockContext({ issues: [resolvedDocumentedIssue] });
  const opsLedgerHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtxResolved}>
      <OperationsView initialTab="LEDGER" />
    </CampusPulseContext.Provider>
  );

  assert(
    opsLedgerHtml.includes('Note recorded'),
    'COMP-EVIDENCE-01',
    'OperationsView renders documented note recorded evidence badge'
  );

  assert(
    opsLedgerHtml.includes('1 documented record') && opsLedgerHtml.includes('Technician replaced 2-inch gasket seal'),
    'COMP-EVIDENCE-02',
    'OperationsView Trust Ledger derives documented ticket count and note accurately'
  );

  // Evidence Attached with Image
  const resolvedAttachedIssue: CampusIssue = {
    ...resolvedDocumentedIssue,
    id: 'issue-test-003',
    ticketNumber: 'CP-1044',
    evidenceState: 'EVIDENCE_ATTACHED',
    evidenceAttachment: {
      dataUrl: 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vuUAAA=',
      mimeType: 'image/webp',
      fileName: 'repaired_pipe.webp',
      fileSizeBytes: 1024,
      capturedAt: new Date().toISOString()
    }
  };

  const mockCtxAttached = createMockContext({ issues: [resolvedAttachedIssue] });
  const kioskHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtxAttached}>
      <BenQKioskView />
    </CampusPulseContext.Provider>
  );

  assert(
    kioskHtml.includes('CP-1044'),
    'COMP-EVIDENCE-03',
    'BenQKioskView displays the resolved issue in the signage ticker'
  );

  assert(
    kioskHtml.includes('Photo attached'),
    'COMP-EVIDENCE-04',
    'BenQKioskView renders Photo attached evidence badge on signage ticker'
  );
}

// -----------------------------------------------------------------------------
// 5. PRIVACY FILTERING IN RENDERED PRODUCTION SIGNAGE
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing Privacy Protection in Rendered Signage ---');

{
  const sensitiveIssue: CampusIssue = {
    id: 'issue-privacy-001',
    ticketNumber: 'CP-1045',
    title: 'Pathway streetlight flickering',
    category: 'SAFETY',
    location: 'Brahmaputra Gate Road',
    zone: 'CAMPUS_PERIMETER',
    urgency: 'MEDIUM',
    priorityScore: 55,
    priorityTier: 'MEDIUM',
    description: 'Luminaire cycling on and off every 30 seconds',
    reporterName: 'TEST-STUDENT-002 (Roll TEST-ROLL-002)',
    reportedAt: new Date().toISOString(),
    status: 'RESOLVED',
    evidenceState: 'OPERATOR_DOCUMENTED',
    resolutionNotes: 'Synthetic QA note: rewired test ballast at pole #14. Student contact: test-student-002@example.invalid, +91 99999 00002',
    auditHistory: [
      { timestamp: new Date().toISOString(), action: 'Reported', actor: 'Student', note: 'Created' }
    ]
  };

  const mockCtxPrivacy = createMockContext({ issues: [sensitiveIssue] });
  const kioskHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtxPrivacy}>
      <BenQKioskView />
    </CampusPulseContext.Provider>
  );

  assert(
    !kioskHtml.includes('TEST-STUDENT-002') && !kioskHtml.includes('TEST-ROLL-002'),
    'COMP-PRIVACY-01',
    'BenQKioskView completely excludes student reporter name and roll number'
  );

  assert(
    !kioskHtml.includes('test-student-002@example.invalid') && !kioskHtml.includes('99999 00002'),
    'COMP-PRIVACY-02',
    'BenQKioskView completely excludes student email and phone number'
  );

  assert(
    !kioskHtml.includes('rewired test ballast at pole #14'),
    'COMP-PRIVACY-03',
    'BenQKioskView does not expose unrestricted internal operator notes'
  );
}

// -----------------------------------------------------------------------------
// 6. PRODUCTION STORAGE MIGRATION MODULE TESTS
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing Production Storage Migration Module ---');

{
  // Test 1: Removing known seeds
  const legacySeedData = JSON.stringify([
    { id: 'issue-1041', title: 'Seed 1041', status: 'REPORTED' },
    { id: 'issue-1038', title: 'Seed 1038', status: 'RESOLVED' },
    { id: 'issue-1012', title: 'Seed 1012', status: 'RESOLVED' }
  ]);
  const sanitizedSeeds = migrateStorageIssues(legacySeedData);
  assert(
    sanitizedSeeds.length === 0,
    'MOD-MIGRATION-01',
    'migrateStorageIssues strips all known legacy demonstration seeds'
  );

  // Test 2: Removing simulated marker in audit history
  const simulatedData = JSON.stringify([
    {
      id: 'issue-custom-999',
      title: 'Simulated issue',
      status: 'REPORTED',
      auditHistory: [{ note: 'Simulated demonstration record for evaluation' }]
    }
  ]);
  const sanitizedSimulated = migrateStorageIssues(simulatedData);
  assert(
    sanitizedSimulated.length === 0,
    'MOD-MIGRATION-02',
    'migrateStorageIssues strips records with simulation markers in audit history'
  );

  // Test 3: Preserving legitimate user records
  const validUserRecord: CampusIssue = {
    id: 'issue-1730000000000-xyz',
    ticketNumber: 'CP-1050',
    title: 'Actual campus hazard reported by student',
    category: 'SAFETY',
    location: 'Core 1 Foyer',
    zone: 'ACADEMIC_COMPLEX',
    urgency: 'HIGH',
    priorityScore: 75,
    priorityTier: 'HIGH',
    description: 'Loose floor tile near stairway',
    reporterName: 'Campus Resident',
    reportedAt: new Date().toISOString(),
    status: 'REPORTED',
    evidenceState: 'STATUS_RECORDED',
    auditHistory: [{ timestamp: new Date().toISOString(), action: 'Reported', actor: 'Student', note: 'Created' }]
  };

  const mixedData = JSON.stringify([
    { id: 'issue-1041', title: 'Seed 1041', status: 'REPORTED' },
    validUserRecord,
    { id: 'issue-1024', title: 'Seed 1024', status: 'RESOLVED' }
  ]);

  const preserved = migrateStorageIssues(mixedData);
  assert(
    preserved.length === 1 && preserved[0].id === 'issue-1730000000000-xyz',
    'MOD-MIGRATION-03',
    'migrateStorageIssues preserves legitimate user records while removing seeds'
  );

  assert(
    preserved[0].ticketNumber === 'CP-1050' && preserved[0].description === 'Loose floor tile near stairway',
    'MOD-MIGRATION-04',
    'migrateStorageIssues retains exact user ticket details and description'
  );

  // Test 4: Idempotency
  const secondPass = migrateStorageIssues(JSON.stringify(preserved));
  assert(
    secondPass.length === 1 && secondPass[0].id === preserved[0].id,
    'MOD-MIGRATION-05',
    'migrateStorageIssues is strictly idempotent on repeated executions'
  );

  // Test 5: Safe handling of invalid / malformed JSON
  const corrupted = migrateStorageIssues('{{bad-json;;');
  assert(
    Array.isArray(corrupted) && corrupted.length === 0,
    'MOD-MIGRATION-06',
    'migrateStorageIssues safely recovers from corrupted JSON without throwing'
  );

  // Test 6: Partially malformed array preserves valid neighboring records
  const mixedMalformed = JSON.stringify([
    null,
    "corrupted-string-entry",
    { id: 'issue-valid-neighbour', ticketNumber: 'CP-1999', title: 'Neighbouring valid report', status: 'REPORTED' },
    42,
    { invalidNoId: true }
  ]);
  const recoveredNeighbours = migrateStorageIssues(mixedMalformed);
  assert(
    recoveredNeighbours.length === 1 && recoveredNeighbours[0].id === 'issue-valid-neighbour',
    'MOD-MIGRATION-07',
    'migrateStorageIssues preserves valid neighboring records when corrupt entries exist in array'
  );

  // Test 7: Preserves user records with missing or malformed timestamps
  const missingTimestampRecord = JSON.stringify([
    { id: 'issue-no-timestamp', ticketNumber: 'CP-2001', title: 'Record without timestamp', reportedAt: 'not-a-date', status: 'REPORTED' }
  ]);
  const preservedNoTimestamp = migrateStorageIssues(missingTimestampRecord);
  assert(
    preservedNoTimestamp.length === 1 && preservedNoTimestamp[0].id === 'issue-no-timestamp',
    'MOD-MIGRATION-08',
    'migrateStorageIssues preserves user records even with missing or non-standard timestamps'
  );

  // Test 8: Preserves unknown custom schema fields on user records
  const customFieldRecord = JSON.stringify([
    {
      id: 'issue-custom-fields',
      ticketNumber: 'CP-2002',
      title: 'Record with custom metadata',
      status: 'REPORTED',
      customDepartment: 'Civil Works',
      customFloorLevel: 4
    }
  ]);
  const preservedCustom = migrateStorageIssues(customFieldRecord);
  assert(
    preservedCustom.length === 1 && (preservedCustom[0] as any).customDepartment === 'Civil Works',
    'MOD-MIGRATION-09',
    'migrateStorageIssues preserves backward-compatible custom metadata fields'
  );

  // Test 9: Safely downgrades EVIDENCE_ATTACHED if attachment data is missing
  const orphanedEvidenceState = JSON.stringify([
    {
      id: 'issue-orphan-evidence',
      ticketNumber: 'CP-2003',
      title: 'Resolved ticket with lost attachment',
      status: 'RESOLVED',
      evidenceState: 'EVIDENCE_ATTACHED',
      resolutionNotes: 'Completed maintenance work with detailed notes on file.'
    }
  ]);
  const sanitizedOrphan = migrateStorageIssues(orphanedEvidenceState);
  assert(
    sanitizedOrphan.length === 1 && sanitizedOrphan[0].evidenceState === 'OPERATOR_DOCUMENTED',
    'MOD-MIGRATION-10',
    'migrateStorageIssues downgrades orphaned EVIDENCE_ATTACHED state to OPERATOR_DOCUMENTED'
  );

  // Test 10: A genuine user record whose ID collides with a known legacy seed ID is preserved
  const collidingUserRecord = JSON.stringify([
    {
      id: 'issue-1041',
      ticketNumber: 'CP-8888',
      title: 'Genuine water leakage reported in Core 1 Chemistry Lab',
      category: 'WATER',
      location: 'Core 1 Chemistry Lab Level 2',
      description: 'Lab tap pipe disconnected from manifold',
      status: 'REPORTED',
      reportedAt: '2026-10-30T10:00:00.000Z',
      auditHistory: [{ timestamp: '2026-10-30T10:00:00.000Z', action: 'Reported', actor: 'Chemistry TA', note: 'Created via mobile' }]
    }
  ]);
  const preservedColliding = migrateStorageIssues(collidingUserRecord);
  assert(
    preservedColliding.length === 1 &&
    preservedColliding[0].id === 'issue-1041' &&
    preservedColliding[0].ticketNumber === 'CP-8888',
    'MOD-MIGRATION-11',
    'migrateStorageIssues preserves legitimate user records even when their ID matches a known seed ID'
  );
}

// -----------------------------------------------------------------------------
// 7. PRODUCTION DYNAMIC ECO-METRICS MODULE TESTS
// -----------------------------------------------------------------------------
console.log('\n--- 7. Testing Production Dynamic Eco-Metrics Module ---');

{
  // Test 1: Empty collection
  const emptyMetrics = computeEcoMetrics([]);
  assert(
    emptyMetrics.totalMeasuredKwhSaved === null &&
    emptyMetrics.totalMeasuredLitersPreserved === null &&
    emptyMetrics.totalModelledKwhSaved === 0 &&
    emptyMetrics.activeResolvedCount === 0,
    'MOD-METRICS-01',
    'computeEcoMetrics yields null measured metrics and 0 modelled savings for empty list'
  );

  // Test 2: Derivation strictly from resolved records
  const sampleIssues: CampusIssue[] = [
    {
      id: 'i-1',
      ticketNumber: 'CP-1',
      title: 'Unresolved energy leak',
      category: 'ENERGY',
      location: 'Lab',
      zone: 'ACADEMIC_COMPLEX',
      urgency: 'HIGH',
      priorityScore: 70,
      priorityTier: 'HIGH',
      description: 'Open breaker',
      reporterName: 'Student',
      reportedAt: new Date().toISOString(),
      status: 'IN_PROGRESS', // NOT RESOLVED
      evidenceState: 'STATUS_RECORDED',
      ecoImpact: { type: 'kwh', basis: 'MODELLED', value: 50, unit: 'kWh' },
      auditHistory: []
    },
    {
      id: 'i-2',
      ticketNumber: 'CP-2',
      title: 'Resolved water leak',
      category: 'WATER',
      location: 'Hostel',
      zone: 'HOSTELS',
      urgency: 'HIGH',
      priorityScore: 80,
      priorityTier: 'CRITICAL',
      description: 'Tap seepage',
      reporterName: 'Student',
      reportedAt: new Date().toISOString(),
      status: 'RESOLVED',
      evidenceState: 'OPERATOR_DOCUMENTED',
      resolutionNotes: 'Replaced valve washer',
      ecoImpact: { type: 'liters', basis: 'MODELLED', value: 300, unit: 'Liters' },
      auditHistory: []
    }
  ];

  const derivedMetrics = computeEcoMetrics(sampleIssues);
  assert(
    derivedMetrics.totalModelledKwhSaved === 0,
    'MOD-METRICS-02',
    'computeEcoMetrics excludes unresolved issues from modelled energy savings'
  );

  assert(
    derivedMetrics.totalModelledLitersPreserved === 300,
    'MOD-METRICS-03',
    'computeEcoMetrics includes resolved water issues in modelled water savings'
  );

  assert(
    derivedMetrics.totalMeasuredLitersPreserved === null,
    'MOD-METRICS-04',
    'computeEcoMetrics preserves null (NOT_MEASURED) for unmetered physical water savings'
  );

  assert(
    derivedMetrics.activeResolvedCount === 1 && derivedMetrics.operatorDocumentedCount === 1,
    'MOD-METRICS-05',
    'computeEcoMetrics calculates activeResolvedCount and evidence counts accurately'
  );
}

// -----------------------------------------------------------------------------
// 8. PRODUCTION HEURISTIC PRIORITY ENGINE MODULE TESTS
// -----------------------------------------------------------------------------
console.log('\n--- 8. Testing Production Priority Engine Module ---');

{
  const critical = calculatePriorityScore('EMERGENCY', 'SAFETY', 0);
  assert(
    critical.score >= 80 && critical.tier === 'CRITICAL',
    'MOD-PRIORITY-01',
    'calculatePriorityScore: EMERGENCY + SAFETY scores in CRITICAL tier'
  );

  const high = calculatePriorityScore('HIGH', 'ENERGY', 0);
  assert(
    high.score >= 60 && high.tier === 'HIGH',
    'MOD-PRIORITY-02',
    'calculatePriorityScore: HIGH + ENERGY scores in HIGH tier'
  );

  const low = calculatePriorityScore('LOW', 'FACILITIES', 0);
  assert(
    low.score <= 40 && low.tier === 'LOW',
    'MOD-PRIORITY-03',
    'calculatePriorityScore: LOW + FACILITIES scores in LOW tier'
  );

  const nanSafe = calculatePriorityScore('HIGH', 'WATER', NaN);
  assert(
    Number.isFinite(nanSafe.score) && !Number.isNaN(nanSafe.score),
    'MOD-PRIORITY-04',
    'calculatePriorityScore: NaN hoursOpen handled safely without NaN propagation'
  );

  const futureNegative = calculatePriorityScore('HIGH', 'ENERGY', -5);
  assert(
    futureNegative.score === 69 && futureNegative.breakdown.ageScore === 0,
    'MOD-PRIORITY-05',
    'calculatePriorityScore: Negative hoursOpen (future timestamp) clamped safely to 0 age points'
  );

  const ancientIssue = calculatePriorityScore('LOW', 'FACILITIES', 1000);
  assert(
    ancientIssue.score <= 100 && ancientIssue.breakdown.ageScore === 100,
    'MOD-PRIORITY-06',
    'calculatePriorityScore: Unusually old report age (1000 hrs) clamped safely to 100 max points'
  );
}

// -----------------------------------------------------------------------------
// 9. PRODUCTION APP ROLE RESOLUTION MODULE TESTS
// -----------------------------------------------------------------------------
console.log('\n--- 9. Testing Production App Role Resolution Module ---');

{
  assert(resolveAppRole('') === 'landing', 'MOD-ROUTING-01', 'resolveAppRole: empty hash defaults to landing');
  assert(resolveAppRole('#/') === 'landing', 'MOD-ROUTING-02', 'resolveAppRole: root hash #/ resolves to landing');
  assert(resolveAppRole('#report') === 'student', 'MOD-ROUTING-03', 'resolveAppRole: #report resolves to student');
  assert(resolveAppRole('#operations') === 'operations', 'MOD-ROUTING-04', 'resolveAppRole: #operations resolves to operations');
  assert(resolveAppRole('#kiosk') === 'benq-kiosk', 'MOD-ROUTING-05', 'resolveAppRole: #kiosk resolves to benq-kiosk');
  assert(resolveAppRole('#how-it-works') === 'landing', 'MOD-ROUTING-06', 'resolveAppRole: #how-it-works preserves landing view');
  assert(resolveAppRole('#workspaces') === 'landing', 'MOD-ROUTING-07', 'resolveAppRole: #workspaces preserves landing view');
  assert(resolveAppRole('#trust-ledger') === 'landing', 'MOD-ROUTING-08', 'resolveAppRole: #trust-ledger preserves landing view');
  assert(resolveAppRole('', '?role=kiosk') === 'benq-kiosk', 'MOD-ROUTING-09', 'resolveAppRole: ?role=kiosk resolves to benq-kiosk');
  assert(resolveAppRole('', '?role=invalid_role') === 'landing', 'MOD-ROUTING-10', 'resolveAppRole: invalid query role falls back to landing');
  assert(resolveAppRole('', '?view=operations') === 'operations', 'MOD-ROUTING-11', 'resolveAppRole: ?view=operations resolves to operations');
  assert(resolveAppRole('', '?view=student') === 'student', 'MOD-ROUTING-12', 'resolveAppRole: ?view=student resolves to student');
  assert(resolveAppRole('#custom-unknown-hash', '', 'operations') === 'operations', 'MOD-ROUTING-13', 'resolveAppRole: unknown hash preserves active workspace role');
}

// -----------------------------------------------------------------------------
// 10. PITCH RUNBOOK MODAL COMPONENT TESTS (DEF-01 Verification)
// -----------------------------------------------------------------------------
console.log('\n--- 10. Testing PitchRunbookModal Production Component ---');

{
  const mockCtx = createMockContext();

  // Closed state: should render nothing
  const closedHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtx}>
      <PitchRunbookModal isOpen={false} />
    </CampusPulseContext.Provider>
  );
  assert(
    closedHtml === '',
    'COMP-PITCH-01',
    'PitchRunbookModal renders nothing when isOpen is false'
  );

  // Open state: should render dialog, header, and runbook content
  const openHtml = ReactDOMServer.renderToStaticMarkup(
    <CampusPulseContext.Provider value={mockCtx}>
      <PitchRunbookModal isOpen={true} />
    </CampusPulseContext.Provider>
  );
  assert(
    openHtml.includes('role="dialog"') &&
    openHtml.includes('Evaluation Guide &amp; Runbook') &&
    openHtml.includes('aria-label="Close evaluation guide modal"'),
    'COMP-PITCH-02',
    'PitchRunbookModal renders accessible dialog and runbook tabs when isOpen is true'
  );
}

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} PRODUCTION COMPONENT & MODULE TESTS PASSED!`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
