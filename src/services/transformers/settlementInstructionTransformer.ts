import {
  FungibleLeg,
  NftLeg,
  OffChainLeg,
  DefaultPortfolio,
  NumberedPortfolio,
  Identity,
  InstructionDetails,
  Instruction,
  Leg,
  InstructionAffirmation,
} from '@polymeshassociation/polymesh-sdk/types';
import {
  SettlementInstruction,
  SettlementLeg,
} from '@/domain/entities/SettlementInstruction';
import { Portfolio } from '@/domain/entities/Portfolio';

function getPortfolioFromParty(
  party: DefaultPortfolio | NumberedPortfolio | Identity,
): Portfolio {
  if ('did' in party) {
    return { id: party.did, name: 'Default Portfolio', number: '0' };
  }
  if ('id' in party) {
    return {
      id: party.owner.did,
      name: `Portfolio ${party.id.toString()}`,
      number: party.id.toString(),
    };
  }
  return { id: party.owner.did, name: 'Default Portfolio', number: '0' };
}

function getLegAsset(leg: FungibleLeg | NftLeg | OffChainLeg): string {
  if ('asset' in leg) {
    return typeof leg.asset === 'string' ? leg.asset : leg.asset.ticker;
  }
  return 'Unknown';
}

function getLegAmount(leg: FungibleLeg | NftLeg | OffChainLeg): string {
  if ('amount' in leg) {
    return leg.amount.toString();
  }
  if ('nfts' in leg) {
    return `${leg.nfts.length} NFTs`;
  }
  if ('offChainAmount' in leg) {
    return leg.offChainAmount.toString();
  }
  return 'Unknown';
}

function transformLeg(
  leg: FungibleLeg | NftLeg | OffChainLeg,
  currentIdentityDid: string,
): SettlementLeg {
  const from = getPortfolioFromParty(leg.from);
  const to = getPortfolioFromParty(leg.to);
  return {
    from,
    to,
    asset: getLegAsset(leg),
    amount: getLegAmount(leg),
    direction: from.id === currentIdentityDid ? 'Sending' : 'Receiving',
  };
}

function getSettlementType(details: InstructionDetails): string {
  if ('type' in details) {
    return details.type;
  }
  return 'Unknown';
}

export function transformSettlementInstruction(
  instruction: Instruction,
  details: InstructionDetails,
  legs: Leg[],
  affirmations: InstructionAffirmation[],
  currentIdentityDid: string,
): SettlementInstruction {
  const uniqueCounterparties = new Set(
    legs.flatMap((leg) => [
      'owner' in leg.from ? leg.from.owner.did : leg.from.did,
      'owner' in leg.to ? leg.to.owner.did : leg.to.did,
    ]),
  );

  return {
    id: instruction.id.toString(),
    venueId: details.venue?.id.toString(),
    status: details.status,
    memo: details.memo,
    createdAt: details.createdAt ? new Date(details.createdAt) : undefined,
    counterparties: uniqueCounterparties.size,
    affirmedBy: affirmations.filter((a) => a.status === 'Affirmed').length,
    settlementType: getSettlementType(details),
    legs: legs.map((leg) => transformLeg(leg, currentIdentityDid)),
  };
}
