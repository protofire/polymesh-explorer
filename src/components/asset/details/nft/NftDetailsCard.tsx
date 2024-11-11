import React from 'react';
import {
  Typography,
  Box,
  Skeleton,
  Stack,
  Chip,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Table,
  Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { NftAssetWithMetadata } from '@/domain/entities/NftData';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { CounterBadge } from '@/components/shared/common/CounterBadge';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { truncateAddress } from '@/services/polymesh/address';
import { Asset } from '@/domain/entities/Asset';
import { ROUTES } from '@/config/routes';

interface NftDetailsCardProps {
  nft?: NftAssetWithMetadata | null;
  isLoading: boolean;
  collection: Asset | null | undefined;
  isLoadingCollection: boolean;
}

function EmptyOrCollectionLink({
  collection,
}: {
  collection: Asset | null | undefined;
}) {
  if (!collection) return <EmptyDash />;

  return (
    <GenericLink href={`${ROUTES.Asset}/${collection.assetId}`}>
      {collection.ticker || truncateAddress(collection.assetUuid)}
    </GenericLink>
  );
}

export function NftDetailsCard({
  nft,
  isLoading,
  collection,
  isLoadingCollection,
}: NftDetailsCardProps) {
  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4">NFT Details</Typography>
        <Box mt={2}>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
          <Skeleton width="40%" />
        </Box>
      </Box>
    );
  }

  if (!nft) return null;

  const totalOnChainProps = nft.onChainDetails?.length || 0;
  const totalOffChainProps = nft.offChainDetails?.length || 0;

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4">NFT Details</Typography>
          <DocumentationIconButton polymeshEntity="nft" />
        </Box>
        <Tooltip
          title={
            nft.isLocked
              ? 'When an NFT is locked, it cannot be transferred. This state is commonly used for NFTs representing assets that temporarily should not change ownership.'
              : 'This NFT can be freely transferred between wallets, subject to applicable compliance rules.'
          }
          arrow
        >
          <Chip
            icon={nft.isLocked ? <LockIcon /> : <LockOpenIcon />}
            label={nft.isLocked ? 'Locked' : 'Unlocked'}
            color={nft.isLocked ? 'error' : 'success'}
            variant="outlined"
          />
        </Tooltip>
      </Box>

      <Stack spacing={3} mt={4}>
        <Stack direction="row" spacing={4} alignItems="flex-start">
          {nft.imgUrl && (
            <Box
              sx={{
                width: 390,
                height: 390,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={nft.imgUrl}
                alt={nft.name || 'NFT Image'}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}

          <Stack spacing={3} flex={1}>
            <Box>
              <Typography variant="body2" color="textSecondary" mb={1}>
                Name
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {nft.name || `NFT #${nft.id}`}
              </Typography>
            </Box>

            {nft.description && (
              <Box>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Description
                </Typography>
                <Typography variant="body1">{nft.description}</Typography>
              </Box>
            )}

            <Stack direction="row" spacing={2}>
              <Box flex={1}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Owner
                </Typography>
                {nft.ownerDid ? (
                  <AccountOrDidTextField
                    value={nft.ownerDid}
                    showIdenticon
                    isIdentity
                  />
                ) : (
                  <EmptyDash />
                )}
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Owner Portfolio Id
                </Typography>
                {nft.ownerPortfolioId ? (
                  <Typography variant="body1">
                    {nft.ownerPortfolioId}
                  </Typography>
                ) : (
                  <EmptyDash />
                )}
              </Box>
            </Stack>

            <Stack spacing={2}>
              {nft.imgUrl && (
                <Box>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    Image URL
                  </Typography>
                  <Box sx={{ wordBreak: 'break-all' }}>
                    <GenericLink href={nft.imgUrl} isExternal>
                      {nft.imgUrl}
                    </GenericLink>
                  </Box>
                </Box>
              )}

              {nft.tokenUri && (
                <Box>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    Token URI
                  </Typography>
                  <Box sx={{ wordBreak: 'break-all' }}>
                    <GenericLink href={nft.tokenUri} isExternal>
                      {nft.tokenUri}
                    </GenericLink>
                  </Box>
                </Box>
              )}
            </Stack>

            <Box>
              <Typography variant="body2" color="textSecondary" mb={1}>
                Collection
              </Typography>
              {isLoadingCollection ? (
                <Skeleton width="40%" />
              ) : (
                <EmptyOrCollectionLink collection={collection} />
              )}
            </Box>
          </Stack>
        </Stack>

        {nft.onChainDetails && nft.onChainDetails.length > 0 && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CounterBadge count={totalOnChainProps}>
                <Typography variant="h6">On-Chain Properties</Typography>
              </CounterBadge>
            </Box>
            <TableContainer>
              <Table>
                <TableBody>
                  {nft.onChainDetails.map((detail) => (
                    <TableRow
                      key={detail.metaKey}
                      sx={{
                        '&:nth-of-type(odd)': {
                          bgcolor: 'background.paper',
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          width: '30%',
                          border: 'none',
                          py: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          {detail.metaKey}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: 'none', py: 1 }}>
                        <Typography variant="body1">
                          {detail.metaValue}
                        </Typography>
                        {detail.metaDescription && (
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            {detail.metaDescription}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {nft.offChainDetails && nft.offChainDetails.length > 0 && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CounterBadge count={totalOffChainProps}>
                <Typography variant="h6">Off-Chain Properties</Typography>
              </CounterBadge>
            </Box>
            <TableContainer>
              <Table>
                <TableBody>
                  {nft.offChainDetails.map((detail) => (
                    <TableRow
                      key={detail.metaKey}
                      sx={{
                        '&:nth-of-type(odd)': {
                          bgcolor: 'background.paper',
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          width: '30%',
                          border: 'none',
                          py: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          {detail.metaKey}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: 'none', py: 1 }}>
                        <Typography variant="body1">
                          {detail.metaValue}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Stack>
    </>
  );
}
