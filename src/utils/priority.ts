import { IssueCategory, UrgencyLevel } from '../types';

export interface PriorityCalculationResult {
  score: number;
  tier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  breakdown: {
    urgencyScore: number;
    categoryScore: number;
    ageScore: number;
  };
  explanation: string;
}

/**
 * Deterministic heuristic priority scoring engine.
 * Note: This is an explicit prototype triage heuristic designed for demonstration,
 * NOT an opaque machine-learning model or official institutional policy.
 *
 * Weights:
 * - Urgency Factor: 55%
 * - Category & Sustainability/Safety Factor: 35%
 * - Unresolved-Report Age Factor: 10% (prevents ticket starvation)
 */
export function calculatePriorityScore(
  urgency: UrgencyLevel,
  category: IssueCategory,
  hoursOpen: number = 0
): PriorityCalculationResult {
  // Defensive input sanitization & normalization
  const validUrgencies: UrgencyLevel[] = ['EMERGENCY', 'HIGH', 'MEDIUM', 'LOW'];
  const safeUrgency: UrgencyLevel = validUrgencies.includes(urgency) ? urgency : 'LOW';

  const validCategories: IssueCategory[] = ['SAFETY', 'ENERGY', 'WATER', 'WASTE', 'FACILITIES'];
  const safeCategory: IssueCategory = validCategories.includes(category) ? category : 'FACILITIES';

  const safeHours = Number.isFinite(hoursOpen) && hoursOpen > 0 ? hoursOpen : 0;

  // 1. Urgency Component (Weight: 55%)
  let urgencyScore = 20;
  switch (safeUrgency) {
    case 'EMERGENCY':
      urgencyScore = 100;
      break;
    case 'HIGH':
      urgencyScore = 75;
      break;
    case 'MEDIUM':
      urgencyScore = 45;
      break;
    case 'LOW':
      urgencyScore = 20;
      break;
  }

  // 2. Category & Sustainability/Safety Weight (Weight: 35%)
  let categoryScore = 50;
  switch (safeCategory) {
    case 'SAFETY':
      categoryScore = 95; // Routine safety or trip hazard
      break;
    case 'ENERGY':
      categoryScore = 80; // IITG Green Office energy audit priority
      break;
    case 'WATER':
      categoryScore = 80; // Water resource conservation
      break;
    case 'WASTE':
      categoryScore = 65; // Composting & sorting
      break;
    case 'FACILITIES':
      categoryScore = 50; // Routine fixtures & classroom AV
      break;
  }

  // 3. Unresolved-Report Age Factor (Weight: 10%)
  // Older unresolved tickets gradually ramp up to avoid triage starvation
  const ageScore = Math.min(100, Math.round(safeHours * 5));

  // Weighted sum
  const rawScore = (urgencyScore * 0.55) + (categoryScore * 0.35) + (ageScore * 0.10);
  const finalScore = Math.min(100, Math.max(1, Math.round(rawScore)));

  // Priority Tier
  let tier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (finalScore >= 80) tier = 'CRITICAL';
  else if (finalScore >= 60) tier = 'HIGH';
  else if (finalScore >= 40) tier = 'MEDIUM';

  const explanation = `${safeUrgency} urgency (${urgencyScore}pts) × 55% + ${safeCategory} impact (${categoryScore}pts) × 35% + Unresolved age (${ageScore}pts) × 10%`;

  return {
    score: finalScore,
    tier,
    breakdown: {
      urgencyScore,
      categoryScore,
      ageScore,
    },
    explanation,
  };
}

export function getTierColor(tier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (tier) {
    case 'CRITICAL':
      return {
        bg: 'bg-[#FEE2E2]',
        text: 'text-[#B91C1C]',
        border: 'border-[#FECACA]',
        badge: 'bg-[#B91C1C] text-white',
      };
    case 'HIGH':
      return {
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#B45309]',
        border: 'border-[#FDE68A]',
        badge: 'bg-[#B45309] text-white',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-[#E6F4F2]',
        text: 'text-[#0F766E]',
        border: 'border-[#CCECE8]',
        badge: 'bg-[#0F766E] text-white',
      };
    case 'LOW':
      return {
        bg: 'bg-[#F3F4F6]',
        text: 'text-[#4B5563]',
        border: 'border-[#E5E7EB]',
        badge: 'bg-[#4B5563] text-white',
      };
  }
}

export function getCategoryBadge(category: IssueCategory): {
  iconName: string;
  color: string;
  label: string;
} {
  switch (category) {
    case 'ENERGY':
      return { iconName: 'Zap', color: 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]', label: 'Energy & Power' };
    case 'WATER':
      return { iconName: 'Droplets', color: 'text-[#0F766E] bg-[#E6F4F2] border-[#CCECE8]', label: 'Water & Plumbing' };
    case 'WASTE':
      return { iconName: 'Trash2', color: 'text-[#246348] bg-[#EAF2ED] border-[#DCE2D9]', label: 'Waste & Composting' };
    case 'SAFETY':
      return { iconName: 'ShieldAlert', color: 'text-[#B91C1C] bg-[#FEE2E2] border-[#FECACA]', label: 'Safety & Hazard' };
    case 'FACILITIES':
      return { iconName: 'Wrench', color: 'text-[#4B5563] bg-[#F3F4F6] border-[#E5E7EB]', label: 'Facilities & Tech' };
  }
}
