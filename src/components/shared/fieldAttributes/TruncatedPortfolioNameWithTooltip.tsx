import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

interface TruncatedPortfolioNameWithTooltipProps {
  text: string;
  maxWidth?: string;
}

export function TruncatedPortfolioNameWithTooltip({
  text,
  maxWidth = '7rem',
}: TruncatedPortfolioNameWithTooltipProps) {
  const isTruncated = (element: HTMLDivElement | null) => {
    if (!element) return false;
    return element.scrollWidth > element.clientWidth;
  };

  const textRef = React.useRef<HTMLDivElement | null>(null);
  const [truncated, setTruncated] = React.useState(false);

  React.useEffect(() => {
    if (textRef.current) {
      setTruncated(isTruncated(textRef.current));
    }
  }, [text]);

  return (
    <Tooltip title={truncated ? text : ''} arrow>
      <Box
        ref={textRef}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth,
        }}
      >
        <Typography variant="caption"> {`(${text})`}</Typography>
      </Box>
    </Tooltip>
  );
}
