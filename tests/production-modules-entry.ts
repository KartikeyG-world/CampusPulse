// Re-exports actual production modules for Node.js test runners
export { calculatePriorityScore, getCategoryBadge, getTierColor } from '../src/utils/priority';
export {
  validateResolutionInput,
  validateAttachment,
  validateReportSubmission,
  sanitizeForPublicSignage,
  resolveIssue
} from '../src/utils/validation';
export {
  computeEcoMetrics,
  migrateStorageIssues,
  resolveAppRole,
  KNOWN_SEED_IDS,
  STORAGE_KEY_ISSUES,
  STORAGE_KEY_METRICS
} from '../src/context/CampusPulseContext';
export { INITIAL_ISSUES, INITIAL_ECO_METRICS } from '../src/data/seedData';
