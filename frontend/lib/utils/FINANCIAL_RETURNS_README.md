# Financial Returns System

## Overview
This system calculates and displays expected investment returns for restaurant crowdfunding campaigns. Returns are expressed as **pure monetary returns**, not benefits like free food or discounts.

## Display Format
Each campaign shows:
- **Annual Return (%)**: Expected yearly return percentage
- **Monthly Effective Rate (%)**: Compound monthly interest rate
- **Risk Category**: Low, Medium, or High risk classification

Example: `5.2% annual (~0.43% monthly effective rate)`

## Calculation Logic

### Market Benchmarks (South Korea)
- **Inflation**: ~2.4% annual
- **Short-term government bonds**: ~2.83% annual
- **Target attractive returns**: 4-6% annual

### Risk-Adjusted Returns
Returns are calculated based on campaign size (target amount):

| Campaign Size (KRW) | Annual Return | Risk Category |
|---------------------|---------------|---------------|
| ≥100M | 5.0% | Low |
| 50M - 100M | 5.2% | Low |
| 20M - 50M | 5.5% | Medium |
| 10M - 20M | 5.8% | Medium |
| <10M | 6.0% | High |

### Funding Progress Adjustment
- **>75% funded**: -0.1% (lower risk)
- **<25% funded**: +0.1% (higher risk)

### Monthly Effective Rate Formula
```
monthlyRate = (1 + annualRate)^(1/12) - 1
```

## Implementation

### Usage Example
```typescript
import { calculateCampaignReturn } from '@/lib/utils/financialReturns';

const campaignReturn = calculateCampaignReturn(
  targetAmount,
  currentAmount
);

console.log(campaignReturn.annualReturnPercent); // e.g., 5.2
console.log(campaignReturn.monthlyEffectiveRate); // e.g., 0.423
console.log(campaignReturn.riskCategory); // 'low' | 'medium' | 'high'
```

### Helper Functions
- `formatReturnDisplay()`: Format return as display string
- `getRiskCategoryColor()`: Get Tailwind color class for risk level
- `getRiskCategoryLabel()`: Get human-readable risk label

## UI Components

### Campaign List Page
- Compact return indicator in green-themed box
- Tooltip with benchmark information
- Annual and monthly rates displayed

### Campaign Detail Page
- Prominent return section with gradient background
- Large display of both annual and monthly rates
- Risk category badge with emoji indicator
- Detailed tooltip explaining calculation methodology

## Future Enhancements
Currently using static/mocked values. Future improvements could include:
- Real-time market data integration
- Historical performance tracking
- Restaurant-specific risk factors
- Dynamic adjustment based on restaurant financials
- Comparison with actual returns post-campaign

## Testing
Comprehensive test suite in `__tests__/components/CampaignCard.test.tsx`:
- Return display verification
- Risk category validation
- Size-based return calculation
- Currency formatting (KRW)

## Notes
- All returns are **estimates** based on risk models
- Actual returns may vary based on campaign performance
- Users should be informed this is not guaranteed return
- Complies with FinTech transparency requirements
