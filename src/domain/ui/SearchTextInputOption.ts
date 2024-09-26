import { PolymeshEntityType } from '../entities/PolymeshEntity';

export type SearchTextInputOption =
  | {
      value: string;
      type: Exclude<PolymeshEntityType, 'Unknown'>;
      link: string;
    }
  | {
      value: string;
      type: 'Unknown';
    };
