import { format } from 'date-fns';
import { Asset } from '@/domain/entities/Asset';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { CsvColumn, CsvExporterPort } from '@/services/csv/types';
import { truncateAddress } from '@/services/polymesh/address';

function formatTransactionParty(
  tx: AssetTransaction,
  side: 'from' | 'to',
): string {
  const account = side === 'from' ? tx.fromAccount : tx.toAccount;
  const identityId = side === 'from' ? tx.fromIdentityId : tx.toIdentityId;
  const portfolio = side === 'from' ? tx.from : tx.to;
  const portfolioId = side === 'from' ? tx.fromId : tx.toId;

  if (account) {
    return account;
  }

  if (identityId) {
    const portfolioNumber = portfolio?.number ?? portfolioId?.split('/')[1];

    return portfolioNumber !== undefined
      ? `${identityId}/${portfolioNumber}`
      : identityId;
  }

  return portfolioId ?? '';
}

export class AssetTransactionsCsvExportService {
  private readonly csvExporter: CsvExporterPort<AssetTransaction>;

  constructor(csvExporter: CsvExporterPort<AssetTransaction>) {
    this.csvExporter = csvExporter;
  }

  private static getFungibleColumns(): CsvColumn<AssetTransaction>[] {
    return [
      {
        header: 'Date',
        accessor: (tx) => tx.createdBlock.datetime,
      },
      {
        header: 'Block ID',
        accessor: (tx) => tx.createdBlock.blockId,
      },
      {
        header: 'Instruction ID',
        accessor: (tx) => tx.instructionId || '',
      },
      {
        header: 'Venue ID',
        accessor: (tx) => tx.venueId || '',
      },
      {
        header: 'Type',
        accessor: (tx) => tx.eventId,
      },
      {
        header: 'From',
        accessor: (tx) => formatTransactionParty(tx, 'from'),
      },
      {
        header: 'To',
        accessor: (tx) => formatTransactionParty(tx, 'to'),
      },
      {
        header: 'Amount',
        accessor: (tx) => tx.amount || '',
      },
      {
        header: 'Memo',
        accessor: (tx) => tx.memo || '',
      },
      {
        header: 'Funding Round',
        accessor: (tx) => tx.fundingRound || '',
      },
    ];
  }

  private static getNonFungibleColumns(): CsvColumn<AssetTransaction>[] {
    return [
      {
        header: 'Date',
        accessor: (tx) => tx.createdBlock.datetime,
      },
      {
        header: 'Block ID',
        accessor: (tx) => tx.createdBlock.blockId,
      },
      {
        header: 'Instruction ID',
        accessor: (tx) => tx.instructionId || '',
      },
      {
        header: 'Venue ID',
        accessor: (tx) => tx.venueId || '',
      },
      {
        header: 'Type',
        accessor: (tx) => tx.eventId,
      },
      {
        header: 'From',
        accessor: (tx) => formatTransactionParty(tx, 'from'),
      },
      {
        header: 'To',
        accessor: (tx) => formatTransactionParty(tx, 'to'),
      },
      {
        header: 'NFT IDs',
        accessor: (tx) => (tx.nftIds ? tx.nftIds.join(', ') : ''),
      },
      {
        header: 'Memo',
        accessor: (tx) => tx.memo || '',
      },
      {
        header: 'Funding Round',
        accessor: (tx) => tx.fundingRound || '',
      },
    ];
  }

  public static getTransactionColumns(
    isNftCollection: boolean,
  ): CsvColumn<AssetTransaction>[] {
    return isNftCollection
      ? AssetTransactionsCsvExportService.getNonFungibleColumns()
      : AssetTransactionsCsvExportService.getFungibleColumns();
  }

  public exportTransactions(
    transactions: AssetTransaction[],
    asset: Asset,
  ): void {
    const assetIdentifier = asset.ticker || truncateAddress(asset.assetId, 4);
    const filename = `transactions-${assetIdentifier}-${format(
      new Date(),
      'yyyy-MM-dd',
    )}.csv`;
    this.csvExporter.downloadCsv(transactions, filename);
  }
}
