import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { InstructionGraphRepo } from '@/services/repositories/InstructionGraphRepo';
import { customReportError } from '@/utils/customReportError';
import { SettlementInstructionWithEvents } from '@/domain/entities/SettlementInstruction';

export interface UseGetSettlementInstructionByIdReturn {
  instruction: SettlementInstructionWithEvents | null | undefined;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
}

export function useGetSettlementInstructionById(
  instructionId: string,
): UseGetSettlementInstructionByIdReturn {
  const { graphQlClient } = usePolymeshSdkService();
  const instructionService = useMemo(() => {
    if (!graphQlClient) return null;

    return new InstructionGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const query = useQuery({
    queryKey: ['useGetSettlementInstructionById', instructionId],
    queryFn: async () => {
      try {
        const instructionFromService =
          await instructionService?.findById(instructionId);

        if (!instructionFromService) {
          return null;
        }

        return instructionFromService;
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!instructionService && !!instructionId,
  });

  return {
    instruction: query.data,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    error: query.error,
  };
}
