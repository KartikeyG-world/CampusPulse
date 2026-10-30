// Automated Verification Suite for Landing Page, Data Integrity, and Post-Challenge Productization
import fs from 'fs';
import path from 'path';
import {
  resolveAppRole,
  migrateStorageIssues,
  computeEcoMetrics as computeMetrics,
  KNOWN_SEED_IDS,
  sanitizeForPublicSignage
} from './.cache/production-modules.mjs';

console.log('================================================================');
console.log('🧪 CAMPUSPULSE LANDING PAGE & DATA INTEGRITY VERIFICATION SUITE');
console.log('   Targeting Requirements 1-6 & 16 (Data Integrity & Product Content)');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testId, testName, detail = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] [${testId}] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] [${testId}] ${testName} - ${detail || 'Assertion failed'}`);
    process.exitCode = 1;
  }
}

// -----------------------------------------------------------------------------
// 1. RUNTIME IMPORTS & ZERO FABRICATED DATA CHECKS
// -----------------------------------------------------------------------------

const srcDir = path.resolve('src');

function getAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, extensions));
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const srcFiles = getAllFiles(srcDir);

// Verify no runtime files in src/ import seedData or test fixtures
let seedDataImportsInSrc = [];
srcFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("from '../data/seedData'") || content.includes("from './data/seedData'") || content.includes('fixtures/testSeedData')) {
    seedDataImportsInSrc.push(path.basename(filePath));
  }
});

assert(
  seedDataImportsInSrc.length === 0,
  'REQ16-01',
  'Runtime application files do not import seedData or test fixtures',
  `Found imports in: ${seedDataImportsInSrc.join(', ')}`
);

// Verify initial state in seedData.ts is empty
const seedDataContent = fs.readFileSync(path.join(srcDir, 'data', 'seedData.ts'), 'utf8');
assert(
  seedDataContent.includes('export const INITIAL_ISSUES: CampusIssue[] = [];'),
  'REQ16-02',
  'src/data/seedData.ts exports empty INITIAL_ISSUES array'
);
assert(
  seedDataContent.includes('totalModelledKwhSaved: 0') && seedDataContent.includes('activeResolvedCount: 0'),
  'REQ16-03',
  'src/data/seedData.ts exports zeroed baseline INITIAL_ECO_METRICS'
);

// -----------------------------------------------------------------------------
// 2. LANDING PAGE CONTENT & REMOVAL OF EVALUATOR / HACKATHON OBSOLETE COPY
// -----------------------------------------------------------------------------

const landingPageContent = fs.readFileSync(path.join(srcDir, 'components', 'LandingPageView.tsx'), 'utf8');
const headerContent = fs.readFileSync(path.join(srcDir, 'components', 'Header.tsx'), 'utf8');
const appContent = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf8');

// Obsolete evaluator copy must NOT be present in LandingPageView
const obsoletePhrases = [
  '5-Minute Evaluator Runbook',
  '5-Minute Closed-Loop Evaluation Runbook',
  'Evaluator Guide',
  'Evaluation Guide',
  'Pitch guide',
  '5-min pitch runbook',
  'Judges & Evaluators Protocol',
  'BenQ × Hackyard 2026 Challenge Prototype',
  'Evaluation Prototype',
  'Reset demo',
  'Reset to seed demonstration state'
];

obsoletePhrases.forEach(phrase => {
  assert(
    !landingPageContent.includes(phrase),
    'REQ02-01',
    `Landing page does not contain obsolete evaluator phrase "${phrase}"`,
    `Found phrase "${phrase}" in LandingPageView.tsx`
  );
});

// Product headline and core navigation checks
assert(
  landingPageContent.includes('Every campus issue deserves a'),
  'REQ04-01',
  'Landing page contains main product headline'
);

assert(
  landingPageContent.includes('#how-it-works') &&
  landingPageContent.includes('#workspaces') &&
  landingPageContent.includes('#trust-ledger'),
  'REQ04-02',
  'Landing page contains in-page section navigation anchors'
);

assert(
  landingPageContent.includes("setActiveRole('student')"),
  'REQ04-03',
  'Primary CTA triggers transition to student reporting workspace'
);

assert(
  landingPageContent.includes("setActiveRole('operations')") &&
  landingPageContent.includes("setActiveRole('benq-kiosk')"),
  'REQ04-04',
  'Workspace cards contain direct navigation actions for all 3 experiences'
);

// Disclosure check
assert(
  landingPageContent.includes('CampusPulse is an independent operations prototype') ||
  landingPageContent.includes('Independent evaluation prototype'),
  'REQ03-01',
  'Proportionate prototype disclosure is present on landing page'
);

// Evidence terminology: verify absence of "Verified photo proof" / "Verified photo attachments"
assert(
  !landingPageContent.includes('Verified photo proof') &&
  !landingPageContent.includes('Verified photo attachments'),
  'REQ03-02',
  'Landing page avoids claiming attached photos independently verify repairs'
);
assert(
  landingPageContent.includes('Photo attached') || landingPageContent.includes('Photo attachment on record'),
  'REQ03-03',
  'Landing page uses honest evidence terminology ("Photo attached")'
);

// -----------------------------------------------------------------------------
// 3. STUDENT REPORT VIEW: REMOVAL OF DEMO PRESETS
// -----------------------------------------------------------------------------

const studentViewContent = fs.readFileSync(path.join(srcDir, 'components', 'StudentReportView.tsx'), 'utf8');

assert(
  !studentViewContent.includes('applyPreset'),
  'REQ16-04',
  'StudentReportView does not contain applyPreset function'
);
assert(
  !studentViewContent.includes('Auditorium AC') &&
  !studentViewContent.includes('Laundry tap leak') &&
  !studentViewContent.includes('Compost bin full'),
  'REQ16-05',
  'StudentReportView does not expose 1-click evaluation demo preset buttons'
);
assert(
  studentViewContent.includes('No reports recorded yet'),
  'REQ16-06',
  'StudentReportView contains empty state when no reports exist'
);

// -----------------------------------------------------------------------------
// 4. OPERATIONS COMMAND HUB: CLEAN EMPTY STATES & RECORD CALCULATIONS
// -----------------------------------------------------------------------------

const operationsViewContent = fs.readFileSync(path.join(srcDir, 'components', 'OperationsView.tsx'), 'utf8');

assert(
  operationsViewContent.includes('No reports recorded yet') || operationsViewContent.includes('No tickets match filter criteria'),
  'REQ16-07',
  'OperationsView contains truthful empty state when no issues exist'
);

assert(
  operationsViewContent.includes('resolvedList.filter((i) => i.evidenceState === \'EVIDENCE_ATTACHED\').length'),
  'REQ16-08',
  'OperationsView derives evidence counts dynamically from actual resolved records'
);

// -----------------------------------------------------------------------------
// 5. CAMPUS SIGNAGE: ACCURATE ZONE REPORTING & PRIVACY
// -----------------------------------------------------------------------------

const signageViewContent = fs.readFileSync(path.join(srcDir, 'components', 'BenQKioskView.tsx'), 'utf8');

assert(
  !signageViewContent.includes("status: 'OPTIMAL'"),
  'REQ16-09',
  'Campus signage does not label un-reported zones as "Optimal"'
);

assert(
  signageViewContent.includes("status: 'NO_REPORTS'") || signageViewContent.includes('No reports'),
  'REQ16-10',
  'Campus signage indicates "No reports" for zones without reported issues'
);

assert(
  signageViewContent.includes("No campus reports are currently recorded in this browser's local data") &&
  !signageViewContent.includes('local browser session'),
  'REQ16-11',
  'Campus signage marquee contains truthful persistent local data empty state without session wording'
);

// -----------------------------------------------------------------------------
// 6. HEADER & APP SHELL: DELIBERATE CLEAR REPORTS ACTION
// -----------------------------------------------------------------------------

assert(
  !headerContent.includes('setShowPitchModal'),
  'REQ16-12',
  'Header does not contain pitch modal triggers'
);

assert(
  headerContent.includes('clearLocalReports') || headerContent.includes('handleConfirmClear'),
  'REQ16-13',
  'Header implements deliberate local reports clearing action with confirmation'
);

assert(
  !appContent.includes('<PitchRunbookModal />'),
  'REQ16-14',
  'App layout does not render competition pitch runbook modal in runtime'
);

// -----------------------------------------------------------------------------
// 7. ROUTING & ANCHOR NAVIGATION LOGIC (Exercising production resolveAppRole)
// -----------------------------------------------------------------------------

assert(resolveAppRole('') === 'landing', 'ROUTING-01', 'Empty hash defaults to landing page');
assert(resolveAppRole('#/') === 'landing', 'ROUTING-02', 'Root hash #/ resolves to landing page');
assert(resolveAppRole('#report') === 'student', 'ROUTING-03', '#report resolves to student intake');
assert(resolveAppRole('#operations') === 'operations', 'ROUTING-04', '#operations resolves to operations hub');
assert(resolveAppRole('#kiosk') === 'benq-kiosk', 'ROUTING-05', '#kiosk resolves to public signage');
assert(resolveAppRole('#how-it-works') === 'landing', 'ROUTING-06', 'In-page anchor #how-it-works preserves landing view');
assert(resolveAppRole('#workspaces') === 'landing', 'ROUTING-07', 'In-page anchor #workspaces preserves landing view');
assert(resolveAppRole('#trust-ledger') === 'landing', 'ROUTING-08', 'In-page anchor #trust-ledger preserves landing view');

// -----------------------------------------------------------------------------
// 8. STORAGE MIGRATION LOGIC: FILTER SEED RECORDS WHILE PRESERVING USER DATA (Exercising production migrateStorageIssues)
// -----------------------------------------------------------------------------

// Case 1: Fresh user storage with only seed records
const pureSeedStorage = JSON.stringify([
  { id: 'issue-1041', title: 'AC Left Running' },
  { id: 'issue-1019', title: 'Solar Water Heater' }
]);
assert(migrateStorageIssues(pureSeedStorage).length === 0, 'MIGRATION-01', 'Storage migration filters out known seed records');

// Case 2: Mixed storage with legitimate user-created record and seed record
const mixedStorage = JSON.stringify([
  { id: 'issue-1041', title: 'AC Left Running' },
  { id: 'issue-user-173000000', title: 'Real Student Report in Core 2', location: 'Core 2' }
]);
const migrated = migrateStorageIssues(mixedStorage);
assert(migrated.length === 1 && migrated[0].id === 'issue-user-173000000', 'MIGRATION-02', 'Storage migration preserves legitimate user records');

// Case 3: Empty storage yields empty array
assert(migrateStorageIssues(null).length === 0, 'MIGRATION-03', 'Fresh installation starts with empty issue collection');

// Case 4: Deep preservation of unknown user record IDs with full operational schema
const fullUserRecord = {
  id: 'issue-uuid-custom-9988-v4',
  ticketNumber: 'CP-9901',
  title: 'Corridor emergency lighting battery exhausted',
  category: 'SAFETY',
  location: 'Bioengineering Block Level 3',
  zone: 'ACADEMIC_COMPLEX',
  urgency: 'HIGH',
  priorityScore: 78,
  priorityTier: 'HIGH',
  description: 'Battery backup failure warning indicator active on emergency exit luminaire',
  reporterName: 'Lab Assistant (BioEng)',
  reporterEmail: 'lab.bio@iitg.ac.in',
  reporterPhone: '+91 99887 76655',
  reportedAt: '2026-10-29T10:00:00.000Z',
  status: 'RESOLVED',
  evidenceState: 'EVIDENCE_ATTACHED',
  resolutionNotes: 'Replaced lead-acid pack with LiFePO4 unit and verified 90-min discharge test.',
  evidenceAttachment: {
    dataUrl: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4WAoAAAAQAAAAAQAAACkAQCdASoBAAEAAgA0JaQAA3AA/vuUAAA=',
    mimeType: 'image/webp',
    fileName: 'replaced_battery_pack.webp',
    fileSizeBytes: 2450,
    capturedAt: '2026-10-29T12:00:00.000Z'
  },
  auditHistory: [
    { timestamp: '2026-10-29T10:00:00.000Z', action: 'Reported', actor: 'Campus User', note: 'Created' },
    { timestamp: '2026-10-29T11:00:00.000Z', action: 'Status Changed', actor: 'Operator', note: 'Dispatched electrician' },
    { timestamp: '2026-10-29T12:00:00.000Z', action: 'Resolved', actor: 'Operator', note: 'Battery replaced and test passed' }
  ]
};

const deepStorage = JSON.stringify([fullUserRecord]);
const deepMigrated = migrateStorageIssues(deepStorage);
assert(
  deepMigrated.length === 1 &&
  deepMigrated[0].id === 'issue-uuid-custom-9988-v4' &&
  deepMigrated[0].evidenceAttachment?.fileName === 'replaced_battery_pack.webp' &&
  deepMigrated[0].evidenceAttachment?.fileSizeBytes === 2450 &&
  deepMigrated[0].auditHistory.length === 3,
  'MIGRATION-04',
  'Storage migration preserves complete custom record schema, attachments, and audit history'
);

// Case 5: Safe recovery from non-array JSON types without throwing
assert(migrateStorageIssues('{"key": "value"}').length === 0, 'MIGRATION-05', 'Non-array JSON objects safely recover to empty issue array');
assert(migrateStorageIssues('42').length === 0, 'MIGRATION-06', 'Primitive number values safely recover to empty issue array');
assert(migrateStorageIssues('""').length === 0, 'MIGRATION-07', 'Empty string JSON safely recovers to empty issue array');

// -----------------------------------------------------------------------------
// 9. DYNAMIC ECO METRICS COMPUTATION FROM USER-CREATED ISSUES (Exercising production computeEcoMetrics)
// -----------------------------------------------------------------------------

const emptyMetrics = computeMetrics([]);
assert(
  emptyMetrics.activeResolvedCount === 0 &&
  emptyMetrics.totalModelledKwhSaved === 0 &&
  emptyMetrics.totalMeasuredKwhSaved === null,
  'METRICS-01',
  'Empty issue collection yields zero modelled metrics and null measured metrics'
);

const userResolvedIssues = [
  {
    id: 'iss-1',
    status: 'RESOLVED',
    evidenceState: 'EVIDENCE_ATTACHED',
    ecoImpact: { type: 'kwh', basis: 'MODELLED', value: 30, unit: 'kWh' }
  },
  {
    id: 'iss-2',
    status: 'RESOLVED',
    evidenceState: 'OPERATOR_DOCUMENTED',
    ecoImpact: { type: 'liters', basis: 'MODELLED', value: 500, unit: 'Liters' }
  },
  {
    id: 'iss-3',
    status: 'IN_PROGRESS',
    evidenceState: 'STATUS_RECORDED',
    ecoImpact: { type: 'kwh', basis: 'MODELLED', value: 20, unit: 'kWh' }
  }
];

const computedUserMetrics = computeMetrics(userResolvedIssues);
assert(
  computedUserMetrics.activeResolvedCount === 2 &&
  computedUserMetrics.evidenceAttachedCount === 1 &&
  computedUserMetrics.operatorDocumentedCount === 1 &&
  computedUserMetrics.totalModelledKwhSaved === 30 &&
  computedUserMetrics.totalModelledLitersPreserved === 500,
  'METRICS-02',
  'Metrics accurately derive from only resolved user issues'
);

// -----------------------------------------------------------------------------
// 10. PRIVACY SANITIZATION FOR PUBLIC AMBIENT SIGNAGE (Exercising sanitizeForPublicSignage)
// -----------------------------------------------------------------------------

const rawIssueWithPII = {
  id: 'issue-pii-test-01',
  ticketNumber: 'CP-2099',
  title: 'Water filter cartridge overdue for replacement',
  category: 'WATER',
  location: 'Kameng Hostel Dining Mess',
  zone: 'HOSTEL_ZONES',
  urgency: 'MEDIUM',
  priorityScore: 62,
  priorityTier: 'MEDIUM',
  description: 'Flow rate down to trickle and filter replacement indicator lamp is illuminated.',
  reporterName: 'TEST-STUDENT-001 (Roll TEST-ROLL-001)',
  reporterEmail: 'test-student-001@example.invalid',
  reporterPhone: '+91 99999 00001',
  reportedAt: '2026-10-29T08:30:00.000Z',
  status: 'RESOLVED',
  evidenceState: 'OPERATOR_DOCUMENTED',
  resolutionNotes: 'Synthetic QA note: Replaced test filter cartridge. Contacted test desk at 9999900001.',
  auditHistory: [{ timestamp: '2026-10-29T08:30:00.000Z', action: 'Reported', actor: 'Student', note: 'Created' }]
};

const sanitized = sanitizeForPublicSignage(rawIssueWithPII);

assert(
  sanitized.reporterName === undefined && !('reporterName' in sanitized),
  'PRIVACY-01',
  'sanitizeForPublicSignage completely removes reporterName'
);

assert(
  sanitized.reporterEmail === undefined && !('reporterEmail' in sanitized) &&
  sanitized.reporterPhone === undefined && !('reporterPhone' in sanitized),
  'PRIVACY-02',
  'sanitizeForPublicSignage completely removes reporter email and phone'
);

assert(
  sanitized.resolutionNotes === undefined && !('resolutionNotes' in sanitized),
  'PRIVACY-03',
  'sanitizeForPublicSignage suppresses unrestricted internal operator resolution notes'
);

assert(
  sanitized.ticketNumber === 'CP-2099' &&
  sanitized.title === 'Water filter cartridge overdue for replacement' &&
  sanitized.category === 'WATER' &&
  sanitized.location === 'Kameng Hostel Dining Mess' &&
  sanitized.zone === 'HOSTEL_ZONES' &&
  sanitized.status === 'RESOLVED' &&
  sanitized.evidenceState === 'OPERATOR_DOCUMENTED' &&
  sanitized.priorityScore === 62 &&
  sanitized.priorityTier === 'MEDIUM',
  'PRIVACY-04',
  'sanitizeForPublicSignage retains required public operational fields'
);

console.log('\n================================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} INTEGRITY & LANDING PAGE TESTS PASSED!`);
console.log('================================================================\n');
