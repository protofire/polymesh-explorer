import { format } from 'date-fns';
import { Identity } from '@/domain/entities/Identity';
import { CsvColumn, CsvExporterPort } from '@/services/csv/types';

export class IdentityCsvExportService {
  private readonly csvExporter: CsvExporterPort<Identity>;

  constructor(csvExporter: CsvExporterPort<Identity>) {
    this.csvExporter = csvExporter;
  }

  public static getIdentityColumns(): CsvColumn<Identity>[] {
    return [
      {
        header: 'DID',
        accessor: (identity) => identity.did,
      },
      {
        header: 'Primary Account',
        accessor: (identity) => identity.primaryAccount,
      },
      {
        header: 'Portfolios Count',
        accessor: (identity) => identity.portfoliosCount.toString(),
      },
      {
        header: 'Claims Count',
        accessor: (identity) => identity.claimsCount.toString(),
      },
      {
        header: 'Assets Count',
        accessor: (identity) => identity.assetsCount.toString(),
      },
      {
        header: 'Venues Count',
        accessor: (identity) => identity.venuesCount.toString(),
      },
      {
        header: 'Custodied Portfolios',
        accessor: (identity) => identity.custodiedPortfoliosCount.toString(),
      },
      {
        header: 'Is Custodian',
        accessor: (identity) => identity.isCustodian.toString(),
      },
      {
        header: 'Created At',
        accessor: (identity) => identity.createdAt,
      },
    ];
  }

  public exportIdentities(identities: Identity[]): void {
    const filename = `identities-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    this.csvExporter.downloadCsv(identities, filename);
  }
}
