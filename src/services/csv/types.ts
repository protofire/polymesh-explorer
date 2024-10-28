export interface CsvFormatterOptions {
  dateFormat?: string;
  numberFormat?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  };
}

export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number | Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (value: any) => string;
}

export interface CsvExporterPort<T> {
  generateCsv(data: T[]): string;
  downloadCsv(data: T[], filename: string): void;
}
