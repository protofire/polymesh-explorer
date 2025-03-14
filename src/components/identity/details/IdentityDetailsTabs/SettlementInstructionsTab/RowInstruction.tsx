import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { StatusBadge } from '@/components/shared/common/StatusBadge';
import {
  SettlementInstruction,
  SettlementInstructionWithAssets,
} from '@/domain/entities/SettlementInstruction';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { Identity } from '@/domain/entities/Identity';
import { getColSpan } from './getColSpan';
import { LegsTable } from '@/components/shared/settlement/LegsTable';

export interface RowInstructionProps {
  instruction: SettlementInstruction;
  currentIdentityDid?: Identity['did'];
  isHistorical: boolean;
  assetsInvolved: SettlementInstructionWithAssets['assetsInvolved'] | undefined;
  showVenueId?: boolean;
}

export function RowInstruction({
  instruction,
  currentIdentityDid,
  isHistorical,
  assetsInvolved,
  showVenueId = true,
}: RowInstructionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <GenericLink href={`${ROUTES.Settlement}/${instruction.id}`}>
            {instruction.id}
          </GenericLink>
        </TableCell>
        {showVenueId && (
          <TableCell>
            {instruction.venueId ? (
              <GenericLink href={`${ROUTES.Venue}/${instruction.venueId}`}>
                {instruction.venueId}
              </GenericLink>
            ) : (
              <EmptyDash />
            )}
          </TableCell>
        )}
        <TableCell>
          <StatusBadge
            status={
              instruction.status.toLowerCase() as
                | 'pending'
                | 'affirmed'
                | 'failed'
            }
          />
        </TableCell>
        <TableCell>
          {instruction.createdAt ? (
            <FormattedDate date={instruction.createdAt} />
          ) : (
            <EmptyDash />
          )}
        </TableCell>
        {isHistorical && (
          <TableCell>
            {instruction.updatedAt ? (
              <FormattedDate date={instruction.updatedAt} />
            ) : (
              <EmptyDash />
            )}
          </TableCell>
        )}
        <TableCell>
          {instruction.counterparties}
          {!isHistorical && ` (affirmed by ${instruction.affirmedBy})`}
        </TableCell>
        <TableCell>{instruction.settlementType}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={getColSpan(isHistorical, showVenueId)}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Legs
              </Typography>
              <LegsTable
                legs={instruction.legs}
                currentIdentityDid={currentIdentityDid}
                assetsMap={assetsInvolved}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
