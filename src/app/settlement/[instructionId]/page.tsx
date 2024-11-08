'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { useGetSettlementInstructionById } from '@/hooks/settlement/useGetSettlementInstructionById';
import { SettlementCard } from '@/components/settlement/SettlementCard';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';

export default function SettlementDetailPage() {
  const { instructionId } = useParams();
  const { instruction, rawInstruction, status, error } =
    useGetSettlementInstructionById(instructionId as string);

  if (error.sdkError) {
    return (
      <Typography color="error">Error: {error.sdkError?.message}</Typography>
    );
  }

  if (instruction === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <SettlementCard
        instruction={instruction}
        rawInstruction={rawInstruction}
        isLoading={!status.isFetchedSdk}
      />
    </MainWrapper>
  );
}
