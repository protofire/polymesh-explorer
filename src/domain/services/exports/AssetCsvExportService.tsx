import { format } from 'date-fns';
import { Asset } from '@/domain/entities/Asset';
import { CsvColumn, CsvExporterPort } from '@/services/csv/types';

export class AssetCsvExportService {
  private readonly csvExporter: CsvExporterPort<Asset>;

  constructor(csvExporter: CsvExporterPort<Asset>) {
    this.csvExporter = csvExporter;
  }

  public static getAssetColumns(): CsvColumn<Asset>[] {
    return [
      {
        header: 'Id',
        accessor: (asset) => asset.assetId || '',
      },
      {
        header: 'Ticker',
        accessor: (asset) => asset.ticker || '',
      },
      {
        header: 'Name',
        accessor: (asset) => asset.name || '',
      },
      {
        header: 'Type',
        accessor: (asset) => asset.type || '',
      },
      {
        header: 'Token Type',
        accessor: (asset) =>
          asset.isNftCollection ? 'NFT Collection' : 'Fungible Token',
      },
      {
        header: 'Total Supply',
        accessor: (asset) =>
          asset.totalSupply ? parseFloat(asset.totalSupply) : 0,
      },
      {
        header: 'Owner',
        accessor: (asset) => asset.ownerDid || '',
      },
      {
        header: 'Documents',
        accessor: (asset) => asset.totalDocuments?.toString() || '0',
      },
      {
        header: 'Created At',
        accessor: (asset) => asset.createdAt || new Date(),
      },
    ];
  }

  public exportAssets(assets: Asset[]): void {
    const filename = `assets-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    this.csvExporter.downloadCsv(assets, filename);
  }
}
