import React from 'react';
import { Typography, Tooltip } from '@mui/material';

interface TruncatedTextProps {
  text: string;
  maxLines?: number;
  lineHeight?: number;
  maxWidth?: string;
}

export function TruncatedText({
  text,
  maxLines = 2,
  lineHeight = 1.2,
  maxWidth = '200px',
}: TruncatedTextProps) {
  const style: React.CSSProperties = {
    maxWidth,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: maxLines,
    WebkitBoxOrient: 'vertical',
    lineHeight: `${lineHeight}em`,
    maxHeight: `${lineHeight * maxLines}em`,
    wordBreak: 'break-word',
    hyphens: 'auto',
  };

  return (
    <Tooltip title={text} arrow>
      <Typography variant="body2" style={style}>
        {text}
      </Typography>
    </Tooltip>
  );
}
