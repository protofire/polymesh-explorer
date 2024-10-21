import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  FungibleLeg,
  NftLeg,
  OffChainLeg,
  DefaultPortfolio,
  NumberedPortfolio,
  Identity,
} from '@polymeshassociation/polymesh-sdk/types';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { SettlementInstructionInfo } from '@/hooks/settlement/useGetSettlementInstructionsByDid';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { StatusBadge } from '@/components/shared/common/StatusBadge';

interface SettlementInstructionsTabProps {
  instructions: SettlementInstructionInfo[] | null | undefined;
  isLoading: boolean;
}

function getLegAsset(leg: FungibleLeg | NftLeg | OffChainLeg): string {
  if ('asset' in leg) {
    return typeof leg.asset === 'string' ? leg.asset : leg.asset.ticker;
  }
  return 'Unknown';
}

function getLegAmount(leg: FungibleLeg | NftLeg | OffChainLeg): string {
  if ('amount' in leg) {
    return leg.amount.toString();
  }
  if ('nfts' in leg) {
    return `${leg.nfts.length} NFTs`;
  }
  if ('offChainAmount' in leg) {
    return leg.offChainAmount.toString();
  }
  return 'Unknown';
}

function getLegParty(
  party: DefaultPortfolio | NumberedPortfolio | Identity,
): string {
  if ('did' in party) {
    return party.did;
  }
  if ('id' in party) {
    return `Portfolio ${party.id.toString()}`;
  }
  return 'Default Portfolio';
}

function Row({ instruction }: { instruction: SettlementInstructionInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{instruction.id}</TableCell>
        <TableCell>
          <GenericLink href={`${ROUTES.Venue}/${instruction.venueId}`}>
            {instruction.venueId}
          </GenericLink>
        </TableCell>
        <TableCell>
          <StatusBadge status={instruction.status} />
        </TableCell>
        <TableCell>
          <FormattedDate date={instruction.createdAt} />
        </TableCell>
        <TableCell>{instruction.counterparties}</TableCell>
        <TableCell>{instruction.settlementType}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Legs
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Asset</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instruction.legs.map((leg) => (
                    <TableRow
                      key={`leg-${instruction.venueId}-${instruction.id}`}
                    >
                      <TableCell>{getLegParty(leg.from)}</TableCell>
                      <TableCell>{getLegParty(leg.to)}</TableCell>
                      <TableCell>{getLegAsset(leg)}</TableCell>
                      <TableCell>{getLegAmount(leg)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function SettlementInstructionsTab({
  instructions,
  isLoading,
}: SettlementInstructionsTabProps) {
  if (isLoading || instructions === undefined) {
    return <GenericTableSkeleton columnCount={7} rowCount={8} />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Instruction ID</TableCell>
            <TableCell>Venue ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell># Counterparties</TableCell>
            <TableCell>Settlement Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instructions && instructions.length > 0 ? (
            instructions.map((instruction) => (
              <Row key={instruction.id} instruction={instruction} />
            ))
          ) : (
            <NoDataAvailableTBody
              colSpan={7}
              message="No settlement instructions found."
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
