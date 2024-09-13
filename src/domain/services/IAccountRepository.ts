import { Account } from '@/domain/entities/Account';

export interface IAccountRepository {
  getAccountByPublicKey(publicKey: string): Promise<Account>;
}
