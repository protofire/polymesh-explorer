import React from 'react';
import { Box, Typography } from '@mui/material';
import { Asset } from '@/domain/entities/Asset';

interface NftMetadataTabProps {
  asset: Asset;
}

export function NftMetadataTab({ asset }: NftMetadataTabProps) {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        NFT Collection Metadata on {asset.name}
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        {/* {asset.nftMetadata?.map((nft) => (
          <Box
            gridColumn={{ xs: 'span 12', sm: 'span 6', md: 'span 4' }}
            key={nft.id}
          >
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Token ID: {nft.id}
                </Typography>
                {Object.entries(nft.metadata).map(([key, value]) => (
                  <Box key={key} mb={1}>
                    <Typography color="textSecondary" variant="body2">
                      {key}:
                    </Typography>
                    <Typography>{value}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        ))} */}
      </Box>
    </Box>
  );
}
