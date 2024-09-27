import { PolymeshEntityType } from '../entities/PolymeshEntity';

export type SearchTextInputOption =
  | {
      key: string;
      value: string;
      type: Exclude<PolymeshEntityType, 'Unknown'>;
      link: string;
    }
  | {
      key: string;
      value: string;
      type: 'Unknown';
    };
