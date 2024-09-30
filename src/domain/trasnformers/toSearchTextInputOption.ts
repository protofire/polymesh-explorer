import { UseSearchPolymeshEntityResult } from '@/hooks/polymeshEntity/useSearchPolymeshEntity';
import { PolymeshEntityType } from '../entities/PolymeshEntity';
import { Account } from '../entities/Account';
import { Identity } from '../entities/Identity';
import { Venue } from '../entities/Venue';
import { Asset } from '../entities/Asset';
import { ROUTES } from '@/config/routes';
import { SearchTextInputOption } from '../ui/SearchTextInputOption';

export function transformToOption(
  data: UseSearchPolymeshEntityResult,
): SearchTextInputOption {
  switch (data.searchCriteria.type) {
    case PolymeshEntityType.Account: {
      const account = data.entity as Account;

      return {
        key: account.key,
        type: PolymeshEntityType.Account,
        value: account.key,
        link: `${ROUTES.Account}/${account.key}`,
      };
    }
    case PolymeshEntityType.DID: {
      const identity = data.entity as Identity;

      return {
        key: identity.did,
        type: PolymeshEntityType.DID,
        value: identity.did,
        link: `${ROUTES.Identity}/${identity.did}`,
      };
    }
    case PolymeshEntityType.Venue: {
      const venue = data.entity as Venue;

      return {
        key: venue.id.toString(),
        type: PolymeshEntityType.Venue,
        value: venue.id.toString(),
        link: `${ROUTES.Venue}/${venue.id.toString()}`,
      };
    }
    case PolymeshEntityType.Asset: {
      const asset = data.entity as Asset;
      return {
        key: asset.did,
        type: PolymeshEntityType.Asset,
        value: asset.ticker,
        link: `${ROUTES.Asset}/${asset.ticker}`,
      };
    }
    default:
      return {
        key: 'unknown',
        type: PolymeshEntityType.Unknown,
        value: data.searchCriteria.searchTerm,
      };
  }
}
