import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock component for testing
const CampaignCard = ({ campaign }: { campaign: any }) => {
  const progress = (campaign.currentAmount / campaign.targetAmount) * 100;

  return (
    <div data-testid="campaign-card">
      <h3 data-testid="campaign-title">{campaign.title}</h3>
      <p data-testid="campaign-description">{campaign.description}</p>
      <div data-testid="campaign-progress">
        <div style={{ width: `${progress}%` }} />
        <span data-testid="progress-percentage">{progress.toFixed(0)}%</span>
      </div>
      <div data-testid="campaign-amounts">
        <span data-testid="current-amount">${campaign.currentAmount.toLocaleString()}</span>
        <span data-testid="target-amount"> / ${campaign.targetAmount.toLocaleString()}</span>
      </div>
      <span data-testid="campaign-status" className={`status-${campaign.status}`}>
        {campaign.status}
      </span>
    </div>
  );
};

describe('CampaignCard Component', () => {
  const mockCampaign = {
    id: '123',
    title: 'Help Local Pizzeria',
    description: 'Support our neighborhood pizza place',
    targetAmount: 50000,
    currentAmount: 25000,
    status: 'active',
  };

  it('should render campaign information correctly', () => {
    render(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByTestId('campaign-title')).toHaveTextContent('Help Local Pizzeria');
    expect(screen.getByTestId('campaign-description')).toHaveTextContent(
      'Support our neighborhood pizza place'
    );
    expect(screen.getByTestId('campaign-status')).toHaveTextContent('active');
  });

  it('should display correct amounts', () => {
    render(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByTestId('current-amount')).toHaveTextContent('$25,000');
    expect(screen.getByTestId('target-amount')).toHaveTextContent('/ $50,000');
  });

  it('should calculate progress percentage correctly', () => {
    render(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByTestId('progress-percentage')).toHaveTextContent('50%');
  });

  it('should handle 0% progress', () => {
    const zeroCampaign = { ...mockCampaign, currentAmount: 0 };
    render(<CampaignCard campaign={zeroCampaign} />);

    expect(screen.getByTestId('progress-percentage')).toHaveTextContent('0%');
  });

  it('should handle 100% progress', () => {
    const completeCampaign = { ...mockCampaign, currentAmount: 50000 };
    render(<CampaignCard campaign={completeCampaign} />);

    expect(screen.getByTestId('progress-percentage')).toHaveTextContent('100%');
  });

  it('should apply correct status class', () => {
    render(<CampaignCard campaign={mockCampaign} />);

    const statusElement = screen.getByTestId('campaign-status');
    expect(statusElement).toHaveClass('status-active');
  });
});
