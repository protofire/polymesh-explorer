import { CsvValueFormatter } from './CsvValueFormattes';
import { CsvColumn, CsvExporterPort, CsvFormatterOptions } from './types';

export class CsvExporter<T> implements CsvExporterPort<T> {
  private readonly columns: CsvColumn<T>[];

  private readonly formatter: CsvValueFormatter;

  private readonly BOM = '\uFEFF';

  constructor(columns: CsvColumn<T>[], formatterOptions?: CsvFormatterOptions) {
    this.columns = columns;
    this.formatter = new CsvValueFormatter(formatterOptions);
  }

  private static escapeCSV(value: unknown): string {
    // Ensure not null/undefined
    const stringValue =
      value === null || value === undefined ? '' : String(value);

    if (
      stringValue.includes(',') ||
      stringValue.includes('"') ||
      stringValue.includes('\n')
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  private formatValue(
    value: unknown,
    formatter?: (value: unknown) => string,
  ): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (formatter) {
      return formatter(value);
    }
    return this.formatter.formatValue(value);
  }

  private createHeader(): string {
    return this.columns
      .map((col) => CsvExporter.escapeCSV(col.header))
      .join(',');
  }

  private createRow(item: T): string {
    return this.columns
      .map((col) => {
        const value = col.accessor(item);
        const formattedValue = this.formatValue(value, col.formatter);
        return CsvExporter.escapeCSV(formattedValue);
      })
      .join(',');
  }

  public generateCsv(data: T[]): string {
    const header = this.createHeader();
    const rows = data.map((item) => this.createRow(item));
    return this.BOM + [header, ...rows].join('\n');
  }

  public downloadCsv(data: T[], filename: string): void {
    const csvContent = this.generateCsv(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    if ('msSaveBlob' in navigator) {
      (
        navigator as Navigator & {
          msSaveBlob: (blob: Blob, filename: string) => void;
        }
      ).msSaveBlob(blob, filename);
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
