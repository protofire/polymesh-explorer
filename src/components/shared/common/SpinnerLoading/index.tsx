import { styled } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import { SPINNER_IMAGE } from '@/config/images';

const RotatingDiv = styled('div')`
  @keyframes rotate {
    100% {
      transform: rotate(0deg);
    }
    0% {
      transform: rotate(360deg);
    }
  }
  animation: rotate 2s linear infinite;
`;

interface SpinnnerLoadingProps {
  maxWidth?: string;
  height?: string;
  imgSize?: number;
}

export function SpinnerLoading({
  maxWidth = '16px',
  height = '16px',
  imgSize = 16,
}: SpinnnerLoadingProps) {
  return (
    <RotatingDiv
      style={{
        width: 'fit',
        maxWidth: maxWidth as string,
        height: height as string,
        display: 'flex',
      }}
    >
      <Image
        src={SPINNER_IMAGE}
        width={imgSize}
        height={imgSize}
        alt="loading"
        color="white"
      />
    </RotatingDiv>
  );
}
