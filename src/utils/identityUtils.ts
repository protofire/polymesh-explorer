import { Identity } from '@/domain/entities/Identity';

export function getIdentityAddresses(identity: Identity): string[] {
  return [identity.primaryAccount, ...identity.secondaryAccounts];
}
