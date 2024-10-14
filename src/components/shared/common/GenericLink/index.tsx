import React from 'react';
import { Link as MuiLink, styled, Tooltip } from '@mui/material';
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
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

export function GenericLink({
  href,
  children,
  isExternal = false,
  tooltipText,
}: GenericLinkProps) {
  const linkContent = isExternal ? (
    <StyledLink href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </StyledLink>
  ) : (
    <NextLink href={href} passHref legacyBehavior>
      <StyledLink>{children}</StyledLink>
    </NextLink>
  );

  return tooltipText ? (
    <Tooltip title={tooltipText}>{linkContent}</Tooltip>
  ) : (
    linkContent
  );
}
