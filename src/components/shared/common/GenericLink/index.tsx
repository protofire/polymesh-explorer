/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Box, Link as MuiLink, styled, Tooltip } from '@mui/material';
import NextLink from 'next/link';

interface GenericLinkProps {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
  tooltipText?: string;
}

const StyledLink = styled(MuiLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'inline-block',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

const StyledNextLink = styled(NextLink)({
  display: 'inline-block',
});

export function GenericLink({
  href,
  children,
  isExternal = false,
  tooltipText,
}: GenericLinkProps) {
  const linkContent = (
    <StyledLink href={isExternal ? href : undefined}>{children}</StyledLink>
  );

  const link = isExternal ? (
    <StyledLink href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </StyledLink>
  ) : (
    <StyledNextLink href={href} passHref legacyBehavior>
      {linkContent}
    </StyledNextLink>
  );

  if (!tooltipText) {
    return link;
  }

  return (
    <Tooltip title={tooltipText}>
      <Box display="inline-block">{link}</Box>
    </Tooltip>
  );
}
