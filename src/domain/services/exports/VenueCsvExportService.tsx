import { format } from 'date-fns';
import { Venue } from '@/domain/entities/Venue';
import { CsvColumn, CsvExporterPort } from '@/services/csv/types';

export class VenueCsvExportService {
  private readonly csvExporter: CsvExporterPort<Venue>;

  constructor(csvExporter: CsvExporterPort<Venue>) {
    this.csvExporter = csvExporter;
  }

  public static getVenueColumns(): CsvColumn<Venue>[] {
    return [
      {
        header: 'ID',
        accessor: (venue) => venue.id,
      },
      {
        header: 'Type',
        accessor: (venue) => venue.type,
      },
      {
        header: 'Details',
        accessor: (venue) => venue.details,
      },
      {
        header: 'Owner ID',
        accessor: (venue) => venue.ownerId,
      },
      {
        header: 'Created At',
        accessor: (venue) => venue.createdAt,
      },
    ];
  }

  public exportVenues(venues: Venue[]): void {
    const filename = `venues-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    this.csvExporter.downloadCsv(venues, filename);
  }
}
