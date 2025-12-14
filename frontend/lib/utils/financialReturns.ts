/**
 * Financial Returns Utility
 * Calculates risk-adjusted expected returns for restaurant campaigns
 * Based on South Korean market benchmarks:
 * - Inflation: ~2.4%
 * - Short-term government bonds: ~2.83%
 * - Target attractive returns: 4-6% annual
 */

export interface CampaignReturn {
  annualReturnPercent: number;
  monthlyEffectiveRate: number;
  riskCategory: 'low' | 'medium' | 'high';
}

/**
 * Calculate risk-adjusted return based on campaign characteristics
 * @param targetAmount - Campaign target amount in KRW
 * @param currentAmount - Current funded amount in KRW
 * @returns CampaignReturn object with annual and monthly rates
 */
export function calculateCampaignReturn(
  targetAmount: number,
  currentAmount: number = 0
): CampaignReturn {
  // Risk assessment based on campaign size
  // Larger campaigns = lower risk = lower return
  // Smaller campaigns = higher risk = higher return
  
  let annualReturnPercent: number;
  let riskCategory: 'low' | 'medium' | 'high';

  if (targetAmount >= 100000000) {
    // Large campaigns (≥100M KRW) - Lower risk
    annualReturnPercent = 5.0;
    riskCategory = 'low';
  } else if (targetAmount >= 50000000) {
    // Medium-large campaigns (50M-100M KRW)
    annualReturnPercent = 5.2;
    riskCategory = 'low';
  } else if (targetAmount >= 20000000) {
    // Medium campaigns (20M-50M KRW)
    annualReturnPercent = 5.5;
    riskCategory = 'medium';
  } else if (targetAmount >= 10000000) {
    // Small-medium campaigns (10M-20M KRW)
    annualReturnPercent = 5.8;
    riskCategory = 'medium';
  } else {
    // Small campaigns (<10M KRW) - Higher risk
    annualReturnPercent = 6.0;
    riskCategory = 'high';
  }

  // Add small variance based on funding progress
  // More funded = slightly lower risk = slightly lower return
  const fundingProgress = currentAmount / targetAmount;
  if (fundingProgress > 0.75) {
    annualReturnPercent -= 0.1;
  } else if (fundingProgress < 0.25) {
    annualReturnPercent += 0.1;
  }

  // Calculate monthly effective interest rate
  // Formula: (1 + annual)^(1/12) - 1
  const monthlyEffectiveRate = (Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1) * 100;

  return {
    annualReturnPercent: Number(annualReturnPercent.toFixed(2)),
    monthlyEffectiveRate: Number(monthlyEffectiveRate.toFixed(3)),
    riskCategory,
  };
}

/**
 * Format return display string
 */
export function formatReturnDisplay(campaignReturn: CampaignReturn): string {
  return `${campaignReturn.annualReturnPercent}% annual (~${campaignReturn.monthlyEffectiveRate}% monthly)`;
}

/**
 * Get risk category display color
 */
export function getRiskCategoryColor(riskCategory: 'low' | 'medium' | 'high'): string {
  switch (riskCategory) {
    case 'low':
      return 'text-green-400';
    case 'medium':
      return 'text-amber-400';
    case 'high':
      return 'text-orange-400';
  }
}

/**
 * Get risk category label
 */
export function getRiskCategoryLabel(riskCategory: 'low' | 'medium' | 'high'): string {
  switch (riskCategory) {
    case 'low':
      return 'Lower Risk';
    case 'medium':
      return 'Moderate Risk';
    case 'high':
      return 'Higher Risk';
  }
}
