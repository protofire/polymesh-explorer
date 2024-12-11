import {
  InstructionStatus,
  InstructionStatusEnum,
} from '@polymeshassociation/polymesh-sdk/types';
import { Balance } from '@polkadot/types/interfaces';
import { balanceToBigNumber } from '@polymeshassociation/polymesh-sdk/utils/conversion';
import { RawInstructionNode, RawLegNode } from '../repositories/types';
import {
  SettlementInstructionWithEvents,
  SettlementLeg,
} from '@/domain/entities/SettlementInstruction';

export function statusEnumToInstructionStatus(
  instruction: InstructionStatusEnum,
): InstructionStatus {
  if (instruction === 'Failed') {
    return InstructionStatus.Failed;
  }

  if (instruction === 'Rejected') {
    return InstructionStatus.Rejected;
  }

  if (instruction === 'Executed') {
    return InstructionStatus.Success;
  }

  return InstructionStatus.Pending;
}

export function rawLegToSettlementLeg(leg: RawLegNode): SettlementLeg {
  return {
    index: leg.legIndex,
    from: {
      id: leg.from,
      name: leg.fromPortfolio === 0 ? 'Default' : '',
      number: leg.fromPortfolio.toString(),
    },
    to: {
      id: leg.to,
      name: leg.toPortfolio === 0 ? 'Default' : '',
      number: leg.toPortfolio.toString(),
    },
    assetId: leg.assetId,
    assetTicker: leg.ticker,
    amount: leg.amount
      ? balanceToBigNumber(leg.amount as unknown as Balance).toString()
      : leg.amount,
    nftIds: leg.nftIds,
    legType: leg.legType,
  };
}

export function rawInstructiontoSettlementInstruction(
  rawInstruction: RawInstructionNode,
): SettlementInstructionWithEvents {
  const uniqueCounterparties = new Set(
    rawInstruction.legs.nodes.flatMap((leg) => [leg.from, leg.to]),
  );

  return {
    id: rawInstruction.id,
    venueId: rawInstruction.venue?.id,
    venueDescription: rawInstruction.venue?.details,
    status: statusEnumToInstructionStatus(rawInstruction.status),
    memo: rawInstruction.memo,
    createdAt: rawInstruction.createdBlock.datetime
      ? new Date(`${rawInstruction.createdBlock.datetime}Z`)
      : undefined,
    upatedAt: rawInstruction.updatedBlock.datetime
      ? new Date(`${rawInstruction.updatedBlock.datetime}Z`)
      : undefined,
    counterparties: uniqueCounterparties.size,
    affirmedBy: rawInstruction.affirmations.nodes.filter(
      (a) => a.status === 'Affirmed',
    ).length,
    settlementType: rawInstruction.type,
    legs: rawInstruction.legs.nodes.map(rawLegToSettlementLeg),
    isExecuted: rawInstruction.status !== 'Created',
    events: rawInstruction.events.nodes,
    affirmations: rawInstruction.affirmations.nodes.map((a) => ({
      ...a,
      createdAt: new Date(`${a.createdAt}Z`),
    })),
  };
}
