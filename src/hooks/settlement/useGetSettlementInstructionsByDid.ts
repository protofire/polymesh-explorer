import { useQuery } from '@tanstack/react-query';
import {
  InstructionStatus,
  Leg,
  InstructionDetails,
} from '@polymeshassociation/polymesh-sdk/types';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { customReportError } from '@/utils/customReportError';

export interface SettlementInstructionInfo {
  id: string;
  venueId: string;
  status: InstructionStatus;
  createdAt: string;
  counterparties: number;
  settlementType: string;
  legs: Leg[];
}

interface Props {
  identity?: Identity | null;
}

function getSettlementType(details: InstructionDetails): string {
  if ('type' in details) {
    return details.type;
  }
  return 'Unknown';
}

export const useGetSettlementInstructionsByDid = ({ identity }: Props) => {
  const { polymeshService } = usePolymeshSdkService();

  const queryResult = useQuery<SettlementInstructionInfo[] | null, Error>({
    queryKey: ['useGetSettlementInstructionsByDid', identity?.did],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk) {
        throw new Error('Polymesh SDK not initialized');
      }

      try {
        const polymeshIdentity =
          await polymeshService.polymeshSdk.identities.getIdentity({
            did: (identity as Identity).did,
          });
        const instructions = await polymeshIdentity.getInstructions();

        const allInstructions = [
          ...instructions.pending,
          ...instructions.failed,
          ...instructions.affirmed,
        ];

        const instructionInfos: SettlementInstructionInfo[] = await Promise.all(
          allInstructions.map(async (instruction) => {
            const details = await instruction.details();
            const status = await instruction.getStatus();
            const legs = await instruction.getLegs();
            return {
              id: instruction.id.toString(),
              venueId: details.venue.id.toString(),
              status: status.status,
              createdAt: details.createdAt.toISOString(),
              counterparties: legs.data.length,
              settlementType: getSettlementType(details),
              legs: legs.data,
            };
          }),
        );

        return instructionInfos;
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!identity && !!polymeshService,
  });

  return queryResult;
};
