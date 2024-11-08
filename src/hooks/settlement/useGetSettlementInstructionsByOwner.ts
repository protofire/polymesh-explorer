import { useQuery } from '@tanstack/react-query';
import {
  Instruction,
  InstructionStatus,
} from '@polymeshassociation/polymesh-sdk/types';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { customReportError } from '@/utils/customReportError';
import { SettlementInstruction } from '@/domain/entities/SettlementInstruction';
import { transformSettlementInstruction } from '@/services/transformers/settlementInstructionTransformer';

export interface GroupedSettlementInstructions {
  affirmed: SettlementInstruction[];
  failed: SettlementInstruction[];
  pending: SettlementInstruction[];
}

interface Props {
  identity?: Identity | null;
}

export const useGetSettlementInstructionsByOwner = ({ identity }: Props) => {
  const { polymeshService } = usePolymeshSdkService();

  const queryResult = useQuery<GroupedSettlementInstructions | null, Error>({
    queryKey: ['useGetSettlementInstructionsByDid', identity?.did],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk) {
        throw new Error('Polymesh SDK not initialized');
      }

      try {
        const polymeshIdentity =
          await polymeshService.polymeshSdk.identities.getIdentity({
            did: identity!.did,
          });
        const instructions = await polymeshIdentity.getInstructions();

        const processedInstructions = await Promise.all(
          Object.entries(instructions).flatMap(([status, instructionArray]) =>
            instructionArray.map(async (instruction: Instruction) => {
              const details = await instruction.details();
              const legs = await instruction.getLegs();
              const affirmations = await instruction.getAffirmations();

              return {
                status: status as InstructionStatus,
                instruction: transformSettlementInstruction(
                  instruction,
                  details,
                  legs.data,
                  affirmations.data,
                  identity!.did,
                ),
              };
            }),
          ),
        );

        const groupedInstructions =
          processedInstructions.reduce<GroupedSettlementInstructions>(
            (acc, { status, instruction }) => {
              acc[
                status.toLowerCase() as keyof GroupedSettlementInstructions
              ].push(instruction);
              return acc;
            },
            { affirmed: [], failed: [], pending: [] },
          );

        return groupedInstructions;
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!identity && !!polymeshService,
  });

  return queryResult;
};
