import NextTopLoader from 'nextjs-toploader';
import React from 'react';
import { MAIN_COLOR } from '@/theme/colors';

export default function TopLoader() {
  return (
    <NextTopLoader
      color={MAIN_COLOR}
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #2299DD,0 0 5px #2299DD"
    />
  );
}
