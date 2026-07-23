import { InstructionStatus } from '@polymeshassociation/polymesh-sdk/types';
import {
  LegAssetNode,
  RawAffirmationNode,
  RawBlock,
  RawInstructionEvent,
} from '@/services/repositories/types';

export interface SettlementLeg {
  index: number;
  from?: string;
  fromPortfolio?: number;
  fromAccount?: string;
  to?: string;
  toPortfolio?: number;
  toAccount?: string;
  assetId: string;
  assetTicker?: string;
  amount: string;
  legType: string;
  nftIds?: Array<string> | null;
  direction?: 'Sending' | 'Receiving';
}

export interface SettlementInstruction {
  id: string;
  venueId?: string;
  venueDescription?: string;
  status: InstructionStatus;
  memo: string | null;
  createdAt: Date;
  updatedAt: Date;
  counterparties: number;
  affirmedBy: number;
  settlementType: string;
  legs: SettlementLeg[];
  isExecuted: boolean;
  createdBlock: RawBlock;
  createdEvent: {
    id: string;
    eventId: string;
    eventIdx: number;
  };
}

type RawAffirmationNodeExtended = RawAffirmationNode & {
  createdAt: Date;
};

export interface SettlementInstructionWithEvents extends SettlementInstruction {
  events: RawInstructionEvent[];
  affirmations: RawAffirmationNodeExtended[];
}

export interface SettlementInstructionWithAssets {
  instructions: SettlementInstructionWithEvents[];
  assetsInvolved: Record<string, LegAssetNode>;
}
