import { IAccountRepository } from '../../domain/services/IAccountRepository';
import { Account } from '../../domain/entities/Account';
import { PolymeshSdkService } from '../PolymeshSdkService';

export class AccountRepository implements IAccountRepository {
  private getPolymeshInstance: () => Promise<PolymeshSdkService>;

  constructor(
    polymeshInstanceGetter: () => Promise<PolymeshSdkService> = PolymeshSdkService.getInstance,
  ) {
    this.getPolymeshInstance = polymeshInstanceGetter;
  }

  async getAccountByPublicKey(publicKey: string): Promise<Account> {
    const { polymeshSdk: polymesh } = await this.getPolymeshInstance();
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
