import { format } from 'date-fns';
import { ExtrinsicTransaction } from '@/domain/entities/ExtrinsicTransaction';
import { CsvColumn, CsvExporterPort } from '@/services/csv/types';
import { truncateAddress } from '@/services/polymesh/address';

export class TransactionHistoryCsvExportService {
  private readonly csvExporter: CsvExporterPort<ExtrinsicTransaction>;

  constructor(csvExporter: CsvExporterPort<ExtrinsicTransaction>) {
    this.csvExporter = csvExporter;
  }

  public static getTransactionColumns(): CsvColumn<ExtrinsicTransaction>[] {
    return [
      {
        header: 'Date',
        accessor: (transaction) => transaction.block.datetime,
      },
      {
        header: 'Block ID',
        accessor: (transaction) => transaction.blockId.toString(),
      },
      {
        header: 'Extrinsic Index',
        accessor: (transaction) => transaction.extrinsicIdx.toString(),
      },
      {
        header: 'From Address',
        accessor: (transaction) => transaction.address,
      },
      {
        header: 'Module',
        accessor: (transaction) => transaction.moduleId,
      },
      {
        header: 'Call',
        accessor: (transaction) => transaction.callId,
      },
      {
        header: 'Success',
        accessor: (transaction) => transaction.success.toString(),
      },
    ];
  }

  public exportTransactions(
    transactions: ExtrinsicTransaction[],
    did: string,
  ): void {
    const filename = `transactions-${truncateAddress(did, 4)}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    this.csvExporter.downloadCsv(transactions, filename);
  }
}
