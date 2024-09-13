import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { IAccountRepository } from '../../domain/services/IAccountRepository';
import { Account } from '../../domain/entities/Account';
import { getPolymeshSdk } from '../getPolymeshSdk';

export class AccountRepository implements IAccountRepository {
  private getPolymeshInstance: () => Promise<Polymesh>;

  constructor(
    polymeshInstanceGetter: () => Promise<Polymesh> = getPolymeshSdk,
  ) {
    this.getPolymeshInstance = polymeshInstanceGetter;
  }

  async getAccountByPublicKey(publicKey: string): Promise<Account> {
    const polymesh = await this.getPolymeshInstance();
    const accountInfo = await polymesh.accountManagement.getAccount({
      address: publicKey,
    });
    const balance = await accountInfo.getBalance();

    return {
      address: publicKey,
      balance: balance.free.toString(),
    };
  }
}
