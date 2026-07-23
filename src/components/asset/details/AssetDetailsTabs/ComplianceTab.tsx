import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedIcon from '@mui/icons-material/Verified';
import RuleIcon from '@mui/icons-material/Rule';
import LockIcon from '@mui/icons-material/Lock';
import {
  Asset as AssetSdk,
  ClaimType,
  InputStatClaim,
  TransferRestriction,
  TransferRestrictionType,
} from '@polymeshassociation/polymesh-sdk/types';
import { useGetAssetCompliance } from '@/hooks/asset/useGetAssetCompliance';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';

interface ComplianceTabProps {
  assetSdk?: AssetSdk;
  isLoading: boolean;
}

function formatStatClaim(claim: InputStatClaim): string {
  switch (claim.type) {
    case ClaimType.Jurisdiction:
      return `Jurisdiction: ${claim.countryCode ?? 'Any'}`;
    case ClaimType.Accredited:
      return `Accredited: ${claim.accredited ? 'Yes' : 'No'}`;
    case ClaimType.Affiliate:
      return `Affiliate: ${claim.affiliate ? 'Yes' : 'No'}`;
    default:
      return 'Unknown claim';
  }
}

function getRestrictionKey(restriction: TransferRestriction): string {
  switch (restriction.type) {
    case TransferRestrictionType.Count:
    case TransferRestrictionType.Percentage:
      return `${restriction.type}-${restriction.value.toString()}`;
    case TransferRestrictionType.ClaimCount:
      return `${restriction.type}-${restriction.value.issuer.did}-${restriction.value.claim.type}-${restriction.value.min.toString()}-${restriction.value.max?.toString()}`;
    case TransferRestrictionType.ClaimPercentage:
      return `${restriction.type}-${restriction.value.issuer.did}-${restriction.value.claim.type}-${restriction.value.min.toString()}-${restriction.value.max.toString()}`;
    default:
      return JSON.stringify(restriction);
  }
}

export function ComplianceTab({
  assetSdk,
  isLoading,
}: ComplianceTabProps): React.ReactElement {
  const { data: complianceData, isLoading: isLoadingCompliance } =
    useGetAssetCompliance(assetSdk);

  if (isLoading || isLoadingCompliance) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!complianceData) {
    return (
      <Alert severity="info">
        No compliance information available for this asset
      </Alert>
    );
  }

  const {
    defaultTrustedClaimIssuers,
    requirements,
    isPaused,
    transferRestrictions,
  } = complianceData;

  return (
    <Paper sx={{ p: 3 }}>
      {isPaused && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Compliance rules are currently paused
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        <VerifiedIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
        Default Trusted Claim Issuers
      </Typography>
      {defaultTrustedClaimIssuers.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Issuer DID</TableCell>
                <TableCell>Allowed Claim Types</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {defaultTrustedClaimIssuers.map((issuer) => (
                <TableRow key={issuer.did}>
                  <TableCell>
                    <AccountOrDidTextField
                      value={issuer.did}
                      isIdentity
                      showIdenticon
                    />
                  </TableCell>
                  <TableCell>
                    {issuer.trustedFor ? (
                      <Stack direction="row" spacing={1}>
                        {issuer.trustedFor.map((claimType) => (
                          <Chip
                            key={claimType}
                            label={claimType}
                            size="small"
                          />
                        ))}
                      </Stack>
                    ) : (
                      'No allowed claim types'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No default trusted claim issuers</Typography>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        <RuleIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
        Compliance Rules
      </Typography>
      {requirements.length > 0 ? (
        requirements.map((rule) => (
          <Accordion key={rule.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Rule {rule.id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Condition</TableCell>
                      <TableCell>Applies to</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Required Claim</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rule.conditions.map((condition, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableRow key={`${index}-${condition.identityDid}`}>
                        <TableCell>Condition {index + 1}</TableCell>
                        <TableCell>{condition.target}</TableCell>
                        <TableCell>{condition.type}</TableCell>
                        <TableCell>
                          {condition.claim ? (
                            <>
                              {condition.claim.type}
                              {condition.claim.scope && (
                                <>
                                  <br />
                                  Scope: {condition.claim.scope.type} -{' '}
                                  {condition.claim.scope.value}
                                </>
                              )}
                            </>
                          ) : (
                            'No required claim'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>No compliance rules configured</Typography>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        <LockIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
        Transfer Restrictions
      </Typography>
      {transferRestrictions ? (
        <Stack spacing={1}>
          {transferRestrictions.paused && (
            <Alert severity="warning">
              Transfer restrictions are currently paused
            </Alert>
          )}
          {transferRestrictions.restrictions.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Limit</TableCell>
                    <TableCell>Claim Issuer</TableCell>
                    <TableCell>Applies To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transferRestrictions.restrictions.map((restriction) => (
                    <TableRow key={getRestrictionKey(restriction)}>
                      <TableCell>
                        {restriction.type === TransferRestrictionType.Count &&
                          'Max Holders'}
                        {restriction.type ===
                          TransferRestrictionType.Percentage &&
                          'Max Holding Percentage'}
                        {restriction.type ===
                          TransferRestrictionType.ClaimCount && 'Claim Count'}
                        {restriction.type ===
                          TransferRestrictionType.ClaimPercentage &&
                          'Claim Percentage'}
                      </TableCell>
                      <TableCell>
                        {restriction.type === TransferRestrictionType.Count &&
                          restriction.value.toString()}
                        {restriction.type ===
                          TransferRestrictionType.Percentage &&
                          `${restriction.value.toString()}%`}
                        {restriction.type ===
                          TransferRestrictionType.ClaimCount &&
                          `Min: ${restriction.value.min.toString()}${
                            restriction.value.max
                              ? `, Max: ${restriction.value.max.toString()}`
                              : ''
                          }`}
                        {restriction.type ===
                          TransferRestrictionType.ClaimPercentage &&
                          `Min: ${restriction.value.min.toString()}%, Max: ${restriction.value.max.toString()}%`}
                      </TableCell>
                      <TableCell>
                        {(restriction.type ===
                          TransferRestrictionType.ClaimCount ||
                          restriction.type ===
                            TransferRestrictionType.ClaimPercentage) && (
                          <AccountOrDidTextField
                            value={restriction.value.issuer.did}
                            isIdentity
                            showIdenticon
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {(restriction.type ===
                          TransferRestrictionType.ClaimCount ||
                          restriction.type ===
                            TransferRestrictionType.ClaimPercentage) &&
                          formatStatClaim(restriction.value.claim)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No transfer restrictions set</Typography>
          )}
        </Stack>
      ) : (
        <Typography>No transfer restrictions set</Typography>
      )}
    </Paper>
  );
}
