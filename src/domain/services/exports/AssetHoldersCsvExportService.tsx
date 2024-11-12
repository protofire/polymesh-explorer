import { format } from 'date-fns';
import { Asset } from '@/domain/entities/Asset';
import {
  AssetHolder,
  isAssetNonFungibleHolder,
} from '@/domain/entities/AssetHolder';
import { CsvColumn, CsvExporterPort } from '@/services/csv/types';
import { truncateAddress } from '@/services/polymesh/address';

export class AssetHoldersCsvExportService {
  private readonly csvExporter: CsvExporterPort<AssetHolder>;

  constructor(csvExporter: CsvExporterPort<AssetHolder>) {
    this.csvExporter = csvExporter;
  }

  private static getFungibleColumns(): CsvColumn<AssetHolder>[] {
    return [
      {
        header: 'Identity DID',
        accessor: (holder) => holder.identityDid,
      },
      {
        header: 'Balance',
        accessor: (holder) => holder.balance,
      },
      {
        header: 'Percentage',
        accessor: (holder) =>
          holder.percentage ? `${holder.percentage}%` : '0%',
      },
    ];
  }

  private static getNonFungibleColumns(): CsvColumn<AssetHolder>[] {
    return [
      {
        header: 'Identity DID',
        accessor: (holder) => holder.identityDid,
      },
      {
        header: 'NFT IDs',
        accessor: (holder) =>
          isAssetNonFungibleHolder(holder) ? holder.nftIds.join(', ') : '',
      },
      {
        header: 'Total NFTs',
        accessor: (holder) => holder.balance,
      },
      {
        header: 'Percentage',
        accessor: (holder) =>
          holder.percentage ? `${holder.percentage}%` : '0%',
      },
    ];
  }

  public static getHolderColumns(
    isNftCollection: boolean,
  ): CsvColumn<AssetHolder>[] {
    return isNftCollection
      ? AssetHoldersCsvExportService.getNonFungibleColumns()
      : AssetHoldersCsvExportService.getFungibleColumns();
  }

  public exportHolders(holders: AssetHolder[], asset: Asset): void {
    const assetIdentifier = asset.ticker || truncateAddress(asset.assetId, 4);
    const filename = `holders-${assetIdentifier}-${format(
      new Date(),
      'yyyy-MM-dd',
    )}.csv`;
    this.csvExporter.downloadCsv(holders, filename);
  }
}
