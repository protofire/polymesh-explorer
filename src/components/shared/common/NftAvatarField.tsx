import React from 'react';
import Image from 'next/image';
import { styled } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import { remotePatterns } from '../../../../next.config.mjs';
import { IS_DEVELOPMENT } from '../../../config/environment';

const StyledAvatarWrapper = styled('div')(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  borderRadius: '50%',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledCollectionsIcon = styled(CollectionsIcon)(({ theme }) => ({
  width: theme.spacing(2),
  height: theme.spacing(2),
  color: theme.palette.grey[500],
}));

const StyledImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const IconWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[800],
  borderRadius: '50%',
}));

const ALLOWED_DOMAINS = remotePatterns.map((pattern) => pattern.hostname);

interface NftAvatarFieldProps {
  imgUrl?: string;
  alt: string;
}

const logWarning = (message: string) => {
  if (IS_DEVELOPMENT) {
    // eslint-disable-next-line no-console
    console.warn(message);
  }
};

export function NftAvatarField({ imgUrl, alt }: NftAvatarFieldProps) {
  const isAllowedDomain =
    imgUrl && ALLOWED_DOMAINS.some((domain) => imgUrl.includes(domain));

  let avatarContent;
  if (imgUrl) {
    if (isAllowedDomain) {
      avatarContent = (
        <Image src={imgUrl} alt={alt} layout="fill" objectFit="cover" />
      );
    } else {
      logWarning(`Domain not in ALLOWED_DOMAINS: ${imgUrl}`);
      avatarContent = <StyledImg src={imgUrl} alt={alt} />;
    }
  } else {
    avatarContent = (
      <IconWrapper>
        <StyledCollectionsIcon />
      </IconWrapper>
    );
  }

  return <StyledAvatarWrapper>{avatarContent}</StyledAvatarWrapper>;
}
