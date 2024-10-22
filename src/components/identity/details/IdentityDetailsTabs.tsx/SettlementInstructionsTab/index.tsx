import React, { useState, useMemo } from 'react';
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
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GroupedSettlementInstructions } from '@/hooks/settlement/useGetSettlementInstructionsByDid';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { StatusBadge } from '@/components/shared/common/StatusBadge';
import { SettlementLegDirectionField } from '@/components/shared/common/SettlementLegDirectionField';
import {
  SettlementInstruction,
  SettlementLeg,
} from '@/domain/entities/SettlementInstruction';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';

interface SettlementInstructionsTabProps {
  instructions: GroupedSettlementInstructions | null | undefined;
  isLoading: boolean;
}

function Row({
  instruction,
  status,
}: {
  instruction: SettlementInstruction;
  status: 'pending' | 'affirmed' | 'failed';
}) {
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
          <StatusBadge status={status} />
        </TableCell>
        <TableCell>
          <FormattedDate date={instruction.createdAt.toISOString()} />
        </TableCell>
        <TableCell>
          {instruction.counterparties} (affirmed by {instruction.affirmedBy})
        </TableCell>
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
                    <TableCell>Direction</TableCell>
                    <TableCell>Sending Portfolio</TableCell>
                    <TableCell>Receiving Portfolio</TableCell>
                    <TableCell>Asset</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instruction.legs.map((leg: SettlementLeg) => (
                    <TableRow
                      key={`leg-${instruction.venueId}-${instruction.id}`}
                    >
                      <TableCell>
                        <SettlementLegDirectionField
                          direction={leg.direction}
                        />
                      </TableCell>
                      <TableCell>
                        <GenericLink href={`${ROUTES.Identity}/${leg.from.id}`}>
                          {leg.from.name}
                        </GenericLink>
                      </TableCell>
                      <TableCell>
                        <GenericLink href={`${ROUTES.Identity}/${leg.to.id}`}>
                          {leg.to.name}
                        </GenericLink>
                      </TableCell>
                      <TableCell>{leg.asset}</TableCell>
                      <TableCell>{leg.amount}</TableCell>
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
  const allInstructions = useMemo(() => {
    if (!instructions) return [];

    return Object.entries(instructions).flatMap(([status, instructionList]) =>
      instructionList.map((instruction: SettlementInstruction) => ({
        ...instruction,
        status,
      })),
    );
  }, [instructions]);

  const { paginatedItems: paginatedInstructions, ...paginationController } =
    useLocalPagination(allInstructions);

  if (isLoading || instructions === undefined) {
    return <GenericTableSkeleton columnCount={7} rowCount={8} />;
  }

  return (
    <>
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
            {paginatedInstructions.length > 0 ? (
              paginatedInstructions.map((instruction) => (
                <Row
                  key={`${instruction.status}-${instruction.id}`}
                  instruction={instruction}
                  status={
                    instruction.status as 'pending' | 'affirmed' | 'failed'
                  }
                />
              ))
            ) : (
              <NoDataAvailableTBody
                colSpan={7}
                message="No se encontraron instrucciones de liquidación."
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
