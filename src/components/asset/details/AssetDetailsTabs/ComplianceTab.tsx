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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedIcon from '@mui/icons-material/Verified';
import RuleIcon from '@mui/icons-material/Rule';
import LockIcon from '@mui/icons-material/Lock';
import { Asset as AssetSdk } from '@polymeshassociation/polymesh-sdk/types';
import { useGetAssetCompliance } from '@/hooks/asset/useGetAssetCompliance';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';

interface ComplianceTabProps {
  assetSdk?: AssetSdk;
  isLoading: boolean;
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
        <Alert severity="info">No default trusted claim issuers</Alert>
      )}

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
        <Alert severity="info">No compliance rules configured</Alert>
      )}

      <Typography variant="h6" gutterBottom>
        <LockIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
        Transfer Restrictions
      </Typography>
      {transferRestrictions ? (
        <Typography>
          Maximum number of holders:{' '}
          {transferRestrictions.restrictions.length || 'No limit'}
        </Typography>
      ) : (
        <Typography>No transfer restrictions set</Typography>
      )}
    </Paper>
  );
}
