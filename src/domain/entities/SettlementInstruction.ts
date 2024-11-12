import { InstructionStatus } from '@polymeshassociation/polymesh-sdk/types';
import { Portfolio } from './Portfolio';
import {
  RawAffirmationNode,
  RawBlock,
  RawInstructionEvent,
} from '@/services/repositories/types';

export interface SettlementLeg {
  index: number;
  from: Portfolio;
  to: Portfolio;
  assetId: string;
  assetTicker?: string;
  amount: string;
  nftIds?: Array<string> | null;
  direction?: 'Sending' | 'Receiving';
}

export interface SettlementInstruction {
  id: string;
  venueId?: string;
  venueDescription?: string;
  status: InstructionStatus;
  memo: string | null;
  createdAt?: Date;
  upatedAt?: Date;
  counterparties: number;
  affirmedBy: number;
  settlementType: string;
  legs: SettlementLeg[];
  isExecuted: boolean;
  createdBlock?: RawBlock;
}

type RawAffirmationNodeExtended = Omit<RawAffirmationNode, 'createdAt'> & {
  createdAt: Date;
};

export interface SettlementInstructionWithEvents extends SettlementInstruction {
  events: RawInstructionEvent[];
  affirmations: RawAffirmationNodeExtended[];
}
