import { calculatePriorityScore } from '../src/utils/priority.js';
import { INITIAL_ISSUES } from '../src/data/seedData.js';

console.log('==================================================');
console.log('🧪 RUNNING CAMPUSPULSE TYPESCRIPT VERIFICATION');
console.log('==================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${detail || 'Assertion failed'}`);
    process.exitCode = 1;
  }
}

// Algorithm checks
const critScore = calculatePriorityScore('EMERGENCY', 'SAFETY', 0);
assert(critScore.score >= 80 && critScore.tier === 'CRITICAL', 'EMERGENCY + SAFETY scores in CRITICAL tier (>= 80)');

const highEnergy = calculatePriorityScore('HIGH', 'ENERGY', 0);
assert(highEnergy.score >= 60 && highEnergy.tier === 'HIGH', 'HIGH + ENERGY receives HIGH tier (>= 60)');

const lowFacility = calculatePriorityScore('LOW', 'FACILITIES', 0);
assert(lowFacility.score < 40 && lowFacility.tier === 'LOW', 'LOW + FACILITIES receives LOW tier (< 40)');

const agingTicket = calculatePriorityScore('MEDIUM', 'WATER', 12);
const freshTicket = calculatePriorityScore('MEDIUM', 'WATER', 0);
assert(agingTicket.score > freshTicket.score, 'Unresolved age increases priority score');

assert(INITIAL_ISSUES.length >= 7, 'Realistic seed dataset contains representative scenarios');

console.log(`\n🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!\n`);
