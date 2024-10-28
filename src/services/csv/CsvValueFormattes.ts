import { format as formatDate } from 'date-fns';
import { CsvFormatterOptions } from './types';

export class CsvValueFormatter {
  private dateFormat: string;

  private numberFormat: Intl.NumberFormatOptions;

  private locale: string;

  constructor(options?: CsvFormatterOptions) {
    this.dateFormat = options?.dateFormat ?? 'yyyy-MM-dd HH:mm:ss';
    this.locale = options?.numberFormat?.locale ?? 'en-US';
    this.numberFormat = {
      minimumFractionDigits: options?.numberFormat?.minimumFractionDigits ?? 0,
      maximumFractionDigits: options?.numberFormat?.maximumFractionDigits ?? 2,
    };
  }

  formatValue(value: unknown): string {
    if (value instanceof Date) {
      return formatDate(value, this.dateFormat);
    }
    if (typeof value === 'number') {
      return new Intl.NumberFormat(this.locale, this.numberFormat).format(
        value,
      );
    }
    return String(value);
  }
}
