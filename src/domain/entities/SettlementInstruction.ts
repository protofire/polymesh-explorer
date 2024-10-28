import { InstructionStatus } from '@polymeshassociation/polymesh-sdk/types';
import { Portfolio } from './Portfolio';

export interface SettlementLeg {
  from: Portfolio;
  to: Portfolio;
  asset: string;
  amount: string;
  direction: 'Sending' | 'Receiving';
}

export interface SettlementInstruction {
  id: string;
  venueId?: string;
  status: InstructionStatus;
  memo: string | null;
  createdAt?: Date;
  counterparties: number;
  affirmedBy: number;
  settlementType: string;
  legs: SettlementLeg[];
}
