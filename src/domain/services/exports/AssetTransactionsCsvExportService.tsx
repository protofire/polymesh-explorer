import { format } from 'date-fns';
import { Asset } from '@/domain/entities/Asset';
import { CsvColumn, CsvExporterPort } from '@/services/csv/types';
import { truncateAddress } from '@/services/polymesh/address';

interface AssetTransaction {
  id: string;
  eventId: string;
  instructionId?: string;
  venueId?: string;
  fromId?: string;
  toId?: string;
  amount?: string;
  nftIds?: string[];
  memo?: string;
  fundingRound?: string;
  createdBlock: {
    blockId: string;
    datetime: Date;
  };
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
        accessor: (tx) => (tx.fromId ? tx.fromId.split('/')[0] : ''),
      },
      {
        header: 'To',
        accessor: (tx) => (tx.toId ? tx.toId.split('/')[0] : ''),
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
        accessor: (tx) => (tx.fromId ? tx.fromId.split('/')[0] : ''),
      },
      {
        header: 'To',
        accessor: (tx) => (tx.toId ? tx.toId.split('/')[0] : ''),
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
