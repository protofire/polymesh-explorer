import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import { Nft } from '@/hooks/asset/non-fungible/useGetNftById';

interface NftDetailsCardProps {
  nft?: Nft | null;
  isLoading: boolean;
}

export function NftDetailsCard({ nft, isLoading }: NftDetailsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <Skeleton variant="rectangular" height={300} />
        <CardContent>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </CardContent>
      </Card>
    );
  }

  if (!nft) return null;

  return (
    <Card>
      {nft.imgUrl && (
        <CardMedia
          component="img"
          height="300"
          image={nft.imgUrl}
          alt={nft.name || 'NFT Image'}
        />
      )}
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {nft.name || `NFT #${nft.nftId}`}
        </Typography>

        {nft.description && (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {nft.description}
          </Typography>
        )}

        <Box mt={2}>
          <Typography variant="subtitle2">Owner DID:</Typography>
          <Typography variant="body2" color="text.secondary">
            {nft.ownerDid}
          </Typography>
        </Box>

        {nft.onChainDetails && nft.onChainDetails.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              On-Chain Properties
            </Typography>
            {nft.onChainDetails.map((detail) => (
              <Box key={detail.metaKey} mb={1}>
                <Typography variant="subtitle2">{detail.metaKey}:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {detail.metaValue}
                </Typography>
                {detail.metaDescription && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {detail.metaDescription}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {nft.offChainDetails && nft.offChainDetails.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Off-Chain Properties
            </Typography>
            {nft.offChainDetails.map((detail) => (
              <Box key={detail.metaKey} mb={1}>
                <Typography variant="subtitle2">{detail.metaKey}:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {detail.metaValue}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
