import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  Instruction,
  InstructionStatus,
} from '@polymeshassociation/polymesh-sdk/types';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { VenueGraphRepo } from '@/services/repositories/VenueGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Venue } from '@/domain/entities/Venue';
import { transformSettlementInstruction } from '@/services/transformers/settlementInstructionTransformer';
import { GroupedSettlementInstructions } from '@/hooks/settlement/useGetSettlementInstructionsByOwner';

export interface VenueDetails extends Venue {
  instructions: GroupedSettlementInstructions;
}

export interface UseGetVenueReturn {
  venueDetails: VenueDetails | null | undefined;
  status: {
    isLoadingVenue: boolean;
    isLoadingVenueInstructions: boolean;
    isFetchedVenue: boolean;
    isFetchedVenueInstructions: boolean;
  };
  error: {
    getVenueError: Error | null;
    getVenueInstructionsError: Error | null;
  };
}

export function useGetVenue(venueId: string): UseGetVenueReturn {
  const { graphQlClient, polymeshService } = usePolymeshSdkService();
  const venueService = useMemo(() => {
    if (!graphQlClient) return null;

    return new VenueGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ['venue', graphQlClient, venueId],
        queryFn: async () => {
          if (!venueService) throw new Error('Venue service not initialized');
          return venueService.findById(venueId);
        },
        enabled: !!venueService && !!venueId,
      },
      {
        queryKey: ['venueInstructions', venueId],
        queryFn: async () => {
          if (!polymeshService?.polymeshSdk)
            throw new Error('Polymesh SDK not initialized');

          const polymeshVenue =
            await polymeshService.polymeshSdk.settlements.getVenue({
              id: new BigNumber(venueId),
            });

          const instructions = await polymeshVenue.getInstructions();
          const polymeshDetails = await polymeshVenue.details();

          const processedInstructions = await Promise.all(
            Object.entries(instructions).flatMap(([status, instructionArray]) =>
              instructionArray.map(async (instruction: Instruction) => {
                const details = await instruction.details();
                const legs = await instruction.getLegs();
                const affirmations = await instruction.getAffirmations();
                const isExecuted = await instruction.isExecuted();

                return {
                  status: status as InstructionStatus,
                  instruction: transformSettlementInstruction(
                    instruction,
                    { ...details, isExecuted },
                    legs.data,
                    affirmations.data,
                    polymeshDetails.owner.did,
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
        },
        enabled: !!polymeshService?.polymeshSdk && !!venueId,
      },
    ],
  });

  const [venueQuery, instructionsQuery] = queries;
  const instructions = instructionsQuery.data || {
    affirmed: [],
    failed: [],
    pending: [],
  };

  return {
    venueDetails: venueQuery.data
      ? { ...venueQuery.data, instructions }
      : venueQuery.data,
    status: {
      isFetchedVenue: venueQuery.isFetched,
      isLoadingVenue: venueQuery.isLoading,
      isFetchedVenueInstructions: instructionsQuery.isFetched,
      isLoadingVenueInstructions: instructionsQuery.isLoading,
    },
    error: {
      getVenueError: venueQuery.error,
      getVenueInstructionsError: venueQuery.error,
    },
  };
}
