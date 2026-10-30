// Visual QA Automation Script: Captures genuine raster screenshots of CampusPulse surfaces
// Using Google Chrome headless with standard viewport profiles
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distHtml = path.join(rootDir, 'dist', 'index.html');
const outputDir = path.join(rootDir, 'artifacts', 'acceptance');

if (!fs.existsSync(distHtml)) {
  console.error('❌ dist/index.html not found. Run npm run build first.');
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Remove old or unnumbered files if present
const staleFiles = ['landing-desktop.png', '05-operations-hub-empty.png', '06-public-signage-16x9.png'];
for (const stale of staleFiles) {
  const p = path.join(outputDir, stale);
  if (fs.existsSync(p)) {
    try { fs.unlinkSync(p); } catch (e) {}
  }
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(chromePath)) {
  console.error('❌ Chrome executable not found at:', chromePath);
  process.exit(1);
}

const baseIndexHtml = fs.readFileSync(distHtml, 'utf8');

// Synthetic dataset for populated states (using clearly synthetic identifiers)
const syntheticPopulatedRecords = [
  {
    id: 'issue-1730300000001-synth',
    ticketNumber: 'CP-1042',
    title: 'HVAC Unit Left Running in Vacant Hall',
    category: 'ENERGY',
    location: 'Core 1 Complex Room 102',
    zone: 'Core 1 Lecture Complex',
    urgency: 'HIGH',
    priorityScore: 74,
    priorityTier: 'HIGH',
    description: 'Split AC running continuously in empty auditorium.',
    reporterName: 'TEST-STUDENT-001 (Roll TEST-ROLL-001)',
    reportedAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'IN_PROGRESS',
    evidenceState: 'STATUS_RECORDED',
    ecoImpact: { type: 'kwh', basis: 'MODELLED', value: 25, unit: 'kWh' },
    auditHistory: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Reported', actor: 'TEST-STUDENT-001', note: 'Created' },
      { timestamp: new Date(Date.now() - 1800000).toISOString(), action: 'Triaged', actor: 'Local operator entry', note: 'Technician dispatched' }
    ]
  },
  {
    id: 'issue-1730300000002-synth',
    ticketNumber: 'CP-1043',
    title: 'Water Leak in Laundry Bay Bibcock',
    category: 'WATER',
    location: 'Manas Hostel Ground Bay',
    zone: 'Hostels (Manas / Brahmaputra)',
    urgency: 'HIGH',
    priorityScore: 69,
    priorityTier: 'HIGH',
    description: 'Persistent seepage at washing machine supply junction.',
    reporterName: 'TEST-STUDENT-002 (Roll TEST-ROLL-002)',
    reportedAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'RESOLVED',
    evidenceState: 'OPERATOR_DOCUMENTED',
    resolutionNotes: 'Synthetic QA note: Replaced bibcock washer and tightened coupling. Validated by hostel caretaker.',
    ecoImpact: { type: 'liters', basis: 'MODELLED', value: 450, unit: 'Liters' },
    auditHistory: [
      { timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'Reported', actor: 'TEST-STUDENT-002', note: 'Created' },
      { timestamp: new Date(Date.now() - 1200000).toISOString(), action: 'Resolved', actor: 'Local operator entry', note: 'Coupling repaired and inspected' }
    ]
  },
  {
    id: 'issue-1730300000003-synth',
    ticketNumber: 'CP-1044',
    title: 'Overflowing Recycling Bin Near Cafeteria',
    category: 'WASTE',
    location: 'Food Court Central Walkway',
    zone: 'Core 1 Lecture Complex',
    urgency: 'MEDIUM',
    priorityScore: 42,
    priorityTier: 'MEDIUM',
    description: 'Cardboard and plastic beverage containers overflowing.',
    reporterName: 'TEST-STUDENT-003',
    reportedAt: new Date(Date.now() - 10800000).toISOString(),
    status: 'SUBMITTED',
    evidenceState: 'STATUS_RECORDED',
    ecoImpact: { type: 'kg', basis: 'MODELLED', value: 30, unit: 'kg' },
    auditHistory: [
      { timestamp: new Date(Date.now() - 10800000).toISOString(), action: 'Reported', actor: 'TEST-STUDENT-003', note: 'Created' }
    ]
  }
];

const viewsToCapture = [
  {
    name: '01-landing-page-desktop.png',
    hash: '',
    width: 1280,
    height: 900,
    description: '1. Landing page — desktop',
    mode: 'empty'
  },
  {
    name: '02-landing-page-mobile.png',
    hash: '',
    width: 390,
    height: 844,
    description: '2. Landing page — mobile',
    mode: 'empty'
  },
  {
    name: '03-student-intake-desktop.png',
    hash: '#report',
    width: 1280,
    height: 900,
    description: '3. Student reporting — desktop',
    mode: 'empty'
  },
  {
    name: '04-student-intake-mobile.png',
    hash: '#report',
    width: 390,
    height: 844,
    description: '4. Student reporting — mobile',
    mode: 'empty'
  },
  {
    name: '05-student-intake-validation-errors.png',
    hash: '#report',
    width: 1280,
    height: 900,
    description: '5. Student form validation-error state',
    mode: 'validation_error'
  },
  {
    name: '06-operations-hub-empty.png',
    hash: '#operations',
    width: 1280,
    height: 900,
    description: '6. Operations — empty state',
    mode: 'empty'
  },
  {
    name: '07-operations-hub-populated.png',
    hash: '#operations',
    width: 1280,
    height: 900,
    description: '7. Operations — populated ticket state',
    mode: 'populated_queue'
  },
  {
    name: '08-operations-trust-ledger.png',
    hash: '#operations',
    width: 1280,
    height: 900,
    description: '8. Operations — resolution and ledger state',
    mode: 'populated_ledger'
  },
  {
    name: '09-public-signage-empty.png',
    hash: '#kiosk',
    width: 1920,
    height: 1080,
    description: '9. Public signage — empty state',
    mode: 'empty'
  },
  {
    name: '10-public-signage-populated.png',
    hash: '#kiosk',
    width: 1920,
    height: 1080,
    description: '10. Public signage — populated ticket state',
    mode: 'populated_signage'
  }
];

console.log('================================================================');
console.log('📸 CAMPUSPULSE VISUAL ACCEPTANCE SCREENSHOT CAPTURE SUITE');
console.log('   10 Mandatory Visual Coverage States (Headless Chrome)');
console.log('================================================================\n');

let capturedCount = 0;

for (const view of viewsToCapture) {
  const destPath = path.join(outputDir, view.name);
  let htmlToLoad = baseIndexHtml;
  const tempHarnessName = `harness-view-${view.name.replace('.png', '')}.html`;
  const tempHarnessPath = path.join(rootDir, 'dist', tempHarnessName);

  let injectScript = '';

  if (view.mode === 'empty') {
    injectScript = `
      <script>
        try { localStorage.clear(); } catch(e) {}
      </script>
    `;
  } else if (view.mode === 'validation_error') {
    injectScript = `
      <script>
        try { localStorage.clear(); } catch(e) {}
        window.addEventListener('load', () => {
          setTimeout(() => {
            const submitBtn = document.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
          }, 150);
        });
      </script>
    `;
  } else if (view.mode === 'populated_queue' || view.mode === 'populated_signage') {
    injectScript = `
      <script>
        try {
          localStorage.setItem('campuspulse_issues_v4', JSON.stringify(${JSON.stringify(syntheticPopulatedRecords)}));
        } catch(e) {}
      </script>
    `;
  } else if (view.mode === 'populated_ledger') {
    injectScript = `
      <script>
        try {
          localStorage.setItem('campuspulse_issues_v4', JSON.stringify(${JSON.stringify(syntheticPopulatedRecords)}));
        } catch(e) {}
        window.addEventListener('load', () => {
          setTimeout(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const ledgerBtn = buttons.find(b => b.textContent && b.textContent.includes('Trust & impact ledger'));
            if (ledgerBtn) ledgerBtn.click();
          }, 150);
        });
      </script>
    `;
  }

  htmlToLoad = baseIndexHtml.replace('</head>', `${injectScript}</head>`);
  fs.writeFileSync(tempHarnessPath, htmlToLoad, 'utf8');

  const targetUrl = `file:///${tempHarnessPath.replace(/\\/g, '/')}${view.hash ? view.hash : ''}`;

  console.log(`Capturing: ${view.description}...`);
  const chromeArgs = [
    '--headless',
    '--no-sandbox',
    '--allow-file-access-from-files',
    `--window-size=${view.width},${view.height}`,
    '--virtual-time-budget=2000',
    `--screenshot=${destPath}`,
    targetUrl
  ];

  const result = spawnSync(chromePath, chromeArgs, { encoding: 'utf8' });

  // Clean up temporary harness file immediately
  try {
    if (fs.existsSync(tempHarnessPath)) fs.unlinkSync(tempHarnessPath);
  } catch (e) {}

  if (fs.existsSync(destPath)) {
    const stats = fs.statSync(destPath);
    if (stats.size > 1000) {
      console.log(`  ✅ [PASS] Saved ${view.name} (${(stats.size / 1024).toFixed(1)} KB, viewport: ${view.width}x${view.height})`);
      capturedCount++;
    } else {
      console.error(`  ❌ [FAIL] Screenshot file ${view.name} is suspiciously small: ${stats.size} bytes`);
    }
  } else {
    console.error(`  ❌ [FAIL] Failed to write screenshot to ${destPath}`);
    if (result.stderr) console.error('     Stderr:', result.stderr.trim());
  }
}

console.log('\n================================================================');
console.log(`🎉 CAPTURED ${capturedCount}/${viewsToCapture.length} VISUAL ACCEPTANCE ARTIFACTS`);
console.log('   Output Directory: artifacts/acceptance/');
console.log('================================================================\n');

if (capturedCount !== viewsToCapture.length) {
  process.exit(1);
}
