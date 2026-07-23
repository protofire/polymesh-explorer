export const DEFAULT_VENUE_ID = 'default';

export interface Venue {
  id: string;
  details: string;
  type: string;
  ownerId: string;
  createdAt: Date;
}

export const DEFAULT_VENUE: Venue = {
  id: DEFAULT_VENUE_ID,
  details: '',
  type: '',
  ownerId: '',
  createdAt: new Date(0),
};
