import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Asset } from '@/domain/entities/Asset';

interface NftMetadataTabProps {
  asset: Asset;
}

export function NftMetadataTab({ asset }: NftMetadataTabProps) {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        NFT Collection Metadata
      </Typography>
      <Grid container spacing={2}>
        {asset.nftMetadata?.map((nft) => (
          <Grid item xs={12} sm={6} md={4} key={nft.id}>
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 