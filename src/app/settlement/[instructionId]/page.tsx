'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { useGetSettlementInstructionById } from '@/hooks/settlement/useGetSettlementInstructionById';
import { SettlementCard } from '@/components/settlement/SettlementCard';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { SettlementDetailsTab } from '@/components/settlement/SettlementDetailsTab';
import { useNetworkProvider } from '@/context/NetworkProvider/useNetworkProvider';

export default function SettlementDetailPage() {
  const { instructionId } = useParams();
  const { instruction, isLoading, isFetched, error } =
    useGetSettlementInstructionById(instructionId as string);
  const { currentNetworkConfig } = useNetworkProvider();

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (instruction === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <SettlementCard instruction={instruction} isLoading={!isFetched} />
      {instruction && (
        <SettlementDetailsTab
          instruction={instruction}
          isLoading={!isFetched || isLoading}
          subscanUrl={currentNetworkConfig?.subscanUrl || ''}
        />
      )}
    </MainWrapper>
  );
}
