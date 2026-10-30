import { CampusIssue, EcoMetrics } from '../types';

/**
 * Baseline empty operational state.
 * CampusPulse starts with zero runtime records until reports are created by users.
 * Representative test fixtures are maintained separately in tests/fixtures/.
 */
export const INITIAL_ISSUES: CampusIssue[] = [];

export const INITIAL_ECO_METRICS: EcoMetrics = {
  totalMeasuredKwhSaved: null,
  totalMeasuredLitersPreserved: null,
  totalMeasuredWasteDivertedKg: null,
  totalModelledKwhSaved: 0,
  totalModelledLitersPreserved: 0,
  totalModelledWasteDivertedKg: 0,
  activeResolvedCount: 0,
  evidenceAttachedCount: 0,
  operatorDocumentedCount: 0,
  statusRecordedCount: 0,
};
