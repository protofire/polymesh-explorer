import {
  Account,
  DefaultPortfolio,
  HistoricAssetTransaction,
  HistoricNftTransaction,
  NumberedPortfolio,
} from '@polymeshassociation/polymesh-sdk/types';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { DEFAULT_PORTFOLIO_NAME, Portfolio } from '@/domain/entities/Portfolio';

function portfolioToId(
  portfolio: DefaultPortfolio | NumberedPortfolio,
): string {
  const human = portfolio.toHuman();

  return `${human.did}/${human.id ?? '0'}`;
}

function portfolioToEntity(
  portfolio: DefaultPortfolio | NumberedPortfolio,
): Portfolio {
  const human = portfolio.toHuman();
  const number = human.id ?? '0';

  return {
    id: human.did,
    number,
    name: number === '0' ? DEFAULT_PORTFOLIO_NAME : number,
  };
}

function resolveAssetHolder(
  portfolio: DefaultPortfolio | NumberedPortfolio | null,
  account: Account | null,
): {
  id: string;
  portfolio?: Portfolio;
  account?: string;
  identityId?: string;
} {
  if (portfolio) {
    const human = portfolio.toHuman();

    return {
      id: portfolioToId(portfolio),
      portfolio: portfolioToEntity(portfolio),
      identityId: human.did,
    };
  }

  if (account) {
    return { id: account.address, account: account.address };
  }

  return { id: '' };
}

function buildTransactionId(
  blockNumber: { toString(): string },
  extrinsicIndex: { toString(): string },
  eventIndex: { toString(): string },
): string {
  return `${blockNumber.toString()}-${extrinsicIndex.toString()}-${eventIndex.toString()}`;
}

function mapBaseHistoricTransaction(
  tx: HistoricAssetTransaction | HistoricNftTransaction,
  assetId: string,
  assetTicker: string,
  amount?: string,
  nftIds?: string[],
): AssetTransaction {
  const from = resolveAssetHolder(tx.from, tx.fromAccount);
  const to = resolveAssetHolder(tx.to, tx.toAccount);

  return {
    id: buildTransactionId(tx.blockNumber, tx.extrinsicIndex, tx.eventIndex),
    assetId,
    assetTicker,
    fromId: from.id || undefined,
    from: from.portfolio,
    fromAccount: from.account,
    fromIdentityId: from.identityId,
    toId: to.id || undefined,
    to: to.portfolio,
    toAccount: to.account,
    toIdentityId: to.identityId,
    amount,
    nftIds,
    createdBlock: {
      blockId: tx.blockNumber.toString(),
      datetime: tx.blockDate,
    },
    extrinsicIdx: tx.extrinsicIndex.toNumber(),
    eventIdx: tx.eventIndex.toNumber(),
    eventId: tx.event,
    instructionId: tx.instructionId?.toString(),
    memo: tx.instructionMemo,
    fundingRound: tx.fundingRound,
  };
}

export function historicAssetTransactionToAssetTransaction(
  tx: HistoricAssetTransaction,
  assetId: string,
  assetTicker: string,
): AssetTransaction {
  return mapBaseHistoricTransaction(
    tx,
    assetId,
    assetTicker,
    tx.amount.toString(),
  );
}

export function historicNftTransactionToAssetTransaction(
  tx: HistoricNftTransaction,
  assetId: string,
  assetTicker: string,
): AssetTransaction {
  return mapBaseHistoricTransaction(
    tx,
    assetId,
    assetTicker,
    undefined,
    tx.nfts.map((nft) => nft.id.toString()),
  );
}
