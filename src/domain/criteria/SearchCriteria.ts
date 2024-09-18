import { PolymeshEntityType } from '@/domain/entities/PolymeshEntity';

export interface SearchCriteria {
  type?: PolymeshEntityType;
  searchTerm: string;
}
