import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { StatusBadge } from '@/components/shared/common/StatusBadge';
import {
  SettlementLegDirectionField,
  SettlementLegDirectionFieldProps,
} from '@/components/shared/common/SettlementLegDirectionField';
import {
  SettlementInstruction,
  SettlementLeg,
} from '@/domain/entities/SettlementInstruction';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { Identity } from '@/domain/entities/Identity';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { getColSpan } from './getColSpan';

export interface RowInstructionProps {
  instruction: SettlementInstruction;
  currentIdentityDid?: Identity['did'];
  isHistorical: boolean;
  showVenueId?: boolean;
}

export function RowInstruction({
  instruction,
  currentIdentityDid,
  isHistorical,
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
            <GenericLink href={`${ROUTES.Venue}/${instruction.venueId}`}>
              {instruction.venueId}
            </GenericLink>
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
            {instruction.upatedAt ? (
              <FormattedDate date={instruction.upatedAt} />
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Direction</TableCell>
                    <TableCell>Sending Portfolio</TableCell>
                    <TableCell>Receiving Portfolio</TableCell>
                    <TableCell>Asset</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instruction.legs.map((leg: SettlementLeg) => {
                    let direction:
                      | SettlementLegDirectionFieldProps['direction']
                      | undefined;

                    if (currentIdentityDid) {
                      direction =
                        leg.from.id === currentIdentityDid
                          ? 'Sending'
                          : 'Receiving';
                    }

                    return (
                      <TableRow
                        key={`leg-${leg.index}-${instruction.venueId}-${instruction.id}`}
                      >
                        <TableCell>
                          {typeof direction !== undefined ? (
                            <SettlementLegDirectionField
                              direction={
                                direction as SettlementLegDirectionFieldProps['direction']
                              }
                            />
                          ) : (
                            <EmptyDash />
                          )}
                        </TableCell>
                        <TableCell>
                          <AccountOrDidTextField
                            value={leg.from.id}
                            isIdentity
                            variant="body2"
                            showIdenticon
                          >
                            {`${leg.from.id}/${leg.from.number}`}
                          </AccountOrDidTextField>
                          {/* {leg.from.name && (
                            <TruncatedPortfolioNameWithTooltip
                              text={leg.from.name}
                            />
                          )} */}
                        </TableCell>
                        <TableCell>
                          <AccountOrDidTextField
                            value={leg.to.id}
                            isIdentity
                            variant="body2"
                            showIdenticon
                          >
                            {`${leg.to.id}/${leg.to.number}`}
                          </AccountOrDidTextField>
                          {/* {leg.to.name && (
                            <TruncatedPortfolioNameWithTooltip
                              text={leg.to.name}
                            />
                          )} */}
                        </TableCell>
                        <TableCell>
                          <GenericLink href={`${ROUTES.Asset}/${leg.assetId}`}>
                            {leg.assetId}
                          </GenericLink>
                        </TableCell>
                        <TableCell>{leg.amount}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
