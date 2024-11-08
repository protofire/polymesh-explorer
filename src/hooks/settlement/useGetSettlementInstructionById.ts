import { useQueries } from '@tanstack/react-query';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { transformSettlementInstruction } from '@/services/transformers/settlementInstructionTransformer';
import { SettlementInstruction } from '@/domain/entities/SettlementInstruction';
import { InstructionGraphRepo } from '@/services/repositories/InstructionGraphRepo';
import { RawInstructionNode } from '@/services/repositories/types';
import { customReportError } from '@/utils/customReportError';

export interface UseGetSettlementInstructionByIdReturn {
  instruction: SettlementInstruction | null | undefined;
  rawInstruction: RawInstructionNode | null | undefined;
  status: {
    isLoadingSdk: boolean;
    isFetchedSdk: boolean;
    isLoadingService: boolean;
    isFetchedService: boolean;
  };
  error: {
    sdkError: Error | null;
    serviceError: Error | null;
  };
}

export function useGetSettlementInstructionById(
  instructionId: string,
): UseGetSettlementInstructionByIdReturn {
  const { polymeshService, graphQlClient } = usePolymeshSdkService();
  const instructionService = useMemo(() => {
    if (!graphQlClient) return null;

    return new InstructionGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const queries = useQueries({
    queries: [
      {
        queryKey: [
          'useGetSettlementInstructionByIdSdk',
          graphQlClient,
          instructionId,
        ],
        queryFn: async () => {
          try {
            if (!polymeshService?.polymeshSdk)
              throw new Error('Polymesh SDK not initialized');

            const instructionClass =
              await polymeshService.polymeshSdk.settlements.getInstruction({
                id: new BigNumber(instructionId),
              });

            const isExecuted = await instructionClass.isExecuted();
            const [details, legs, affirmations] = await Promise.all([
              instructionClass.details(),
              isExecuted ? { data: [] } : instructionClass.getLegs(),
              isExecuted ? { data: [] } : instructionClass.getAffirmations(),
            ]);

            return transformSettlementInstruction(
              instructionClass,
              { ...details, isExecuted },
              legs.data,
              affirmations.data,
              '',
            );
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!polymeshService?.polymeshSdk && !!instructionId,
      },
      {
        queryKey: ['useGetSettlementInstructionByIdService', instructionId],
        queryFn: async () => {
          try {
            const instructionFromService =
              await instructionService?.findById(instructionId);
            if (!instructionFromService) {
              throw new Error('Instruction not found');
            }
            return instructionFromService;
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!instructionService && !!instructionId,
      },
    ],
  });

  const [sdkQuery, serviceQuery] = queries;

  return {
    instruction: sdkQuery.data,
    rawInstruction: serviceQuery.data,
    status: {
      isLoadingSdk: sdkQuery.isLoading,
      isFetchedSdk: sdkQuery.isFetched,
      isLoadingService: serviceQuery.isLoading,
      isFetchedService: serviceQuery.isFetched,
    },
    error: {
      sdkError: sdkQuery.error,
      serviceError: serviceQuery.error,
    },
  };
}
