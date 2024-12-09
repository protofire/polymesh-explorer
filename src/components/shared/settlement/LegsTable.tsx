import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import {
  SettlementLegDirectionField,
  SettlementLegDirectionFieldProps,
} from '@/components/shared/common/SettlementLegDirectionField';
import {
  SettlementInstructionWithAssets,
  SettlementLeg,
} from '@/domain/entities/SettlementInstruction';
import { truncateAddress } from '@/services/polymesh/address';
import NftIdsDisplay from '../NftIdsDisplay';
import { FormattedNumber } from '../fieldAttributes/FormattedNumber';

interface LegsTableProps {
  legs: SettlementLeg[];
  assetsMap?: SettlementInstructionWithAssets['assetsInvolved'];
  currentIdentityDid?: string;
  tableSize?: 'small' | 'medium';
}

export function LegsTable({
  legs,
  assetsMap,
  currentIdentityDid,
  tableSize = 'small',
}: LegsTableProps) {
  const isFungible =
    assetsMap && legs.length > 0 && assetsMap[legs[0].assetId]
      ? !assetsMap[legs[0].assetId].isNftCollection
      : false;

  return (
    <Table size={tableSize}>
      <TableHead>
        <TableRow>
          {currentIdentityDid && <TableCell>Direction</TableCell>}
          <TableCell>Sending Portfolio</TableCell>
          <TableCell>Receiving Portfolio</TableCell>
          <TableCell>Asset</TableCell>
          <TableCell>{isFungible ? 'Amount' : 'Nft Id'}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {legs.map((leg: SettlementLeg) => {
          let direction:
            | SettlementLegDirectionFieldProps['direction']
            | undefined;

          if (currentIdentityDid) {
            direction =
              leg.from.id === currentIdentityDid ? 'Sending' : 'Receiving';
          }
          const asset = assetsMap && assetsMap[leg.assetId];

          return (
            <TableRow key={`leg-${leg.index}`}>
              {currentIdentityDid && (
                <TableCell>
                  {typeof direction !== 'undefined' ? (
                    <SettlementLegDirectionField direction={direction} />
                  ) : (
                    <EmptyDash />
                  )}
                </TableCell>
              )}
              <TableCell>
                <AccountOrDidTextField
                  value={leg.from.id}
                  isIdentity
                  variant="body2"
                  showIdenticon
                >
                  {`${leg.from.id}/${leg.from.number}`}
                </AccountOrDidTextField>
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
              </TableCell>
              <TableCell>
                <GenericLink href={`${ROUTES.Asset}/${leg.assetId}`}>
                  {asset
                    ? `${asset.name || asset.ticker} (${truncateAddress(asset.id, 4)})`
                    : leg.assetId}
                </GenericLink>
              </TableCell>

              <TableCell>
                {isFungible
                  ? leg.amount && <FormattedNumber value={leg.amount} />
                  : leg.nftIds && (
                      <NftIdsDisplay
                        nftIds={leg.nftIds}
                        assetId={leg.assetId}
                        maxIdsToShow={3}
                      />
                    )}
                {leg.amount}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
