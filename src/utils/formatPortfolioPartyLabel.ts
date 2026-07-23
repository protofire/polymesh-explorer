import { Portfolio } from '@/domain/entities/Portfolio';

export function formatPortfolioPartyLabel(
  identityId: string,
  portfolio?: Portfolio,
  portfolioId?: string,
): string {
  const portfolioNumber = portfolio?.number ?? portfolioId?.split('/')[1];

  return portfolioNumber !== undefined
    ? `${identityId}/${portfolioNumber}`
    : identityId;
}
