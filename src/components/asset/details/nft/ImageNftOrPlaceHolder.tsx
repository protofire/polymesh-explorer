import React from 'react';
import { Typography, Box } from '@mui/material';
import DataObjectIcon from '@mui/icons-material/DataObject';

export function ImageNftOrPlaceholder({
  imgUrl,
  name,
}: {
  imgUrl?: string;
  name?: string;
}) {
  const boxStyles = {
    width: 390,
    height: 390,
    borderRadius: 2,
    overflow: 'hidden',
    bgcolor: 'background.paper',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (!imgUrl) {
    return (
      <Box sx={boxStyles}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <DataObjectIcon
            sx={{ fontSize: '3rem', color: 'action.disabled', mb: '5%' }}
          />
          <Typography variant="body1" color="text.secondary">
            No image
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={boxStyles}>
      <Box
        component="img"
        src={imgUrl}
        alt={name || 'NFT Image'}
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}
