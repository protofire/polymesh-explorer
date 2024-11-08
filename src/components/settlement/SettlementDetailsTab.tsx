import React from 'react';
import {
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { UseGetSettlementInstructionByIdReturn } from '@/hooks/settlement/useGetSettlementInstructionById';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { LoadingDot } from '@/components/shared/common/LoadingDotComponent';
import { SettlementLegDirectionField } from '@/components/shared/common/SettlementLegDirectionField';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { AccountOrDidTextField } from '../shared/fieldAttributes/AccountOrDidTextField';

interface SettlementDetailsTabProps {
  settlementData: UseGetSettlementInstructionByIdReturn;
}

export function SettlementDetailsTab({
  settlementData,
}: SettlementDetailsTabProps): React.ReactElement {
  const { instruction, status } = settlementData;
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Legs
              {status.isLoadingSdk && <LoadingDot />}
            </Box>
          }
        />
      </Tabs>

      <GenericTabPanel value={value} index={0} labelKey="legs">
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Direction</TableCell>
                <TableCell>Sending </TableCell>
                <TableCell>Receiving </TableCell>
                <TableCell>Asset</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instruction?.legs.map((leg) => (
                <TableRow
                  key={`leg-${leg.index}-${instruction.venueId}-${instruction.id}`}
                >
                  <TableCell>
                    <SettlementLegDirectionField direction={leg.direction} />
                  </TableCell>
                  <TableCell>
                    <AccountOrDidTextField
                      value={leg.from.id}
                      showIdenticon
                      isIdentity
                    />
                  </TableCell>
                  <TableCell>
                    <AccountOrDidTextField
                      value={leg.to.id}
                      showIdenticon
                      isIdentity
                    />
                  </TableCell>
                  <TableCell>
                    <GenericLink href={`${ROUTES.Asset}/${leg.asset}`}>
                      {leg.asset}
                    </GenericLink>
                  </TableCell>
                  <TableCell>{leg.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GenericTabPanel>
    </>
  );
}
