import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { GenericLink } from '@/components/shared/common/GenericLink';
import {
  EInstructionDirection,
  SettlementLegDirectionField,
  SettlementLegDirectionFieldProps,
} from '@/components/shared/common/SettlementLegDirectionField';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { ROUTES } from '@/config/routes';
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

export const getLegDirection = ({
  from,
  to,
  identity,
}: {
  from: string;
  to: string;
  identity: string;
}) => {
  if (from === identity && to === identity) {
    return EInstructionDirection.INTER_PORTFOLIO;
  }
  if (from === identity) {
    return EInstructionDirection.OUTGOING;
  }
  if (to === identity) {
    return EInstructionDirection.INCOMING;
  }
  return EInstructionDirection.NONE;
};

const resolveLegPartyIdentity = (did?: string, account?: string) =>
  did ?? account ?? '';

function renderLegSender(leg: SettlementLeg): React.ReactElement {
  if (leg.fromAccount) {
    return (
      <AccountOrDidTextField
        value={leg.fromAccount}
        variant="body2"
        showIdenticon
      >
        {leg.fromAccount}
      </AccountOrDidTextField>
    );
  }

  if (leg.from) {
    return (
      <AccountOrDidTextField
        value={leg.from}
        isIdentity
        variant="body2"
        showIdenticon
      >
        {`${leg.from}/${leg.fromPortfolio}`}
      </AccountOrDidTextField>
    );
  }

  return <EmptyDash />;
}

function renderLegReceiver(leg: SettlementLeg): React.ReactElement {
  if (leg.toAccount) {
    return (
      <AccountOrDidTextField
        value={leg.toAccount}
        variant="body2"
        showIdenticon
      >
        {leg.toAccount}
      </AccountOrDidTextField>
    );
  }

  if (leg.to) {
    return (
      <AccountOrDidTextField
        value={leg.to}
        isIdentity
        variant="body2"
        showIdenticon
      >
        {`${leg.to}/${leg.toPortfolio}`}
      </AccountOrDidTextField>
    );
  }

  return <EmptyDash />;
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
          <TableCell>Sender</TableCell>
          <TableCell>Receiver</TableCell>
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
              leg.legType === EInstructionDirection.OFF_CHAIN
                ? EInstructionDirection.OFF_CHAIN
                : getLegDirection({
                    from: resolveLegPartyIdentity(leg.from, leg.fromAccount),
                    to: resolveLegPartyIdentity(leg.to, leg.toAccount),
                    identity: currentIdentityDid,
                  });
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
              <TableCell>{renderLegSender(leg)}</TableCell>
              <TableCell>{renderLegReceiver(leg)}</TableCell>
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
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
