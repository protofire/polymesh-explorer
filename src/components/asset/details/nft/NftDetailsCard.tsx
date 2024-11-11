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
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { NftAssetWithMetadata } from '@/domain/entities/NftData';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { CounterBadge } from '@/components/shared/common/CounterBadge';
import { GenericLink } from '@/components/shared/common/GenericLink';

interface NftDetailsCardProps {
  nft?: NftAssetWithMetadata | null;
  isLoading: boolean;
}

export function NftDetailsCard({ nft, isLoading }: NftDetailsCardProps) {
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
        <Chip
          icon={nft.isLocked ? <LockIcon /> : <LockOpenIcon />}
          label={nft.isLocked ? 'Locked' : 'Unlocked'}
          color={nft.isLocked ? 'error' : 'success'}
          variant="outlined"
          size="small"
        />
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
                <AccountOrDidTextField
                  value={nft.ownerDid || ''}
                  showIdenticon
                  isIdentity
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Owner Portfolio Id
                </Typography>
                <Typography variant="body1">
                  {nft.ownerPortfolioId || 'default'}
                </Typography>
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
