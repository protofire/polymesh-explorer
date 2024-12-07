import { EventIdEnum } from '@polymeshassociation/polymesh-sdk/types';

export function getEventLabel(event: EventIdEnum): {
  label: string;
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
} {
  switch (event) {
    case 'Issued':
      return { label: 'Issued', color: 'success' };
    case 'Redeemed':
      return { label: 'Redeemed', color: 'error' };
    case 'Transfer':
      return { label: 'Transfer', color: 'primary' };
    default:
      return { label: event, color: 'default' };
  }
}
