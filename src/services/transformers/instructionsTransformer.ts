import { Balance } from '@polkadot/types/interfaces';
import {
  InstructionStatus,
  InstructionStatusEnum,
} from '@polymeshassociation/polymesh-sdk/types';
import { balanceToBigNumber } from '@polymeshassociation/polymesh-sdk/utils/conversion';
import {
  SettlementInstructionWithEvents,
  SettlementLeg,
} from '@/domain/entities/SettlementInstruction';
import { RawInstructionNode, RawLegNode } from '../repositories/types';

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
    fromPortfolio: leg.fromPortfolio ?? undefined,
    from: leg.from ?? undefined,
    fromAccount: leg.fromAccount ?? undefined,
    toPortfolio: leg.toPortfolio ?? undefined,
    to: leg.to ?? undefined,
    toAccount: leg.toAccount ?? undefined,
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
    rawInstruction.legs.nodes.flatMap((leg) =>
      [leg.from, leg.to, leg.fromAccount, leg.toAccount].filter(
        (party): party is string => Boolean(party),
      ),
    ),
  );

  return {
    id: rawInstruction.id,
    venueId: rawInstruction.venue?.id,
    venueDescription: rawInstruction.venue?.details,
    status: statusEnumToInstructionStatus(rawInstruction.status),
    memo: rawInstruction.memo,
    createdAt: new Date(`${rawInstruction.createdBlock.datetime}Z`),
    updatedAt: new Date(`${rawInstruction.updatedBlock.datetime}Z`),
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
      createdAt: new Date(`${a.createdBlock.datetime}Z`),
    })),
    createdBlock: rawInstruction.createdBlock,
    createdEvent: rawInstruction.createdEvent,
  };
}
