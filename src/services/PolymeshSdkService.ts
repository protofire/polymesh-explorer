/* eslint-disable no-console */
import { BigNumber, Polymesh } from '@polymeshassociation/polymesh-sdk';
import {
  ExtrinsicData,
  ExtrinsicsOrderBy,
  ResultSet,
} from '@polymeshassociation/polymesh-sdk/types';

export class PolymeshSdkService {
  private static instances: Map<string, Promise<PolymeshSdkService>> =
    new Map();

  public polymeshSdk: Polymesh;

  private constructor(polymesh: Polymesh) {
    this.polymeshSdk = polymesh;
  }

  public static async getInstance(
    nodeUrl: string,
    graphQlNode: string,
  ): Promise<PolymeshSdkService> {
    const url = nodeUrl;
    if (!this.instances.has(url)) {
      this.instances.set(url, this.initialize(url, graphQlNode));
    }
    return this.instances.get(url)!;
  }

  private static async initialize(
    nodeUrl: string,
    graphQlNode: string,
  ): Promise<PolymeshSdkService> {
    try {
      const polymesh = await Polymesh.connect({
        nodeUrl,
        middlewareV2: { link: graphQlNode, key: '' },
      });
      return new PolymeshSdkService(polymesh);
    } catch (error) {
      console.error('Failed to connect to Polymesh: ', error);
      throw new Error(
        `Failed to initialize PolymeshService for node: ${nodeUrl}`,
      );
    }
  }

  public static async switchInstance(
    newNodeUrl: string,
    graphQlNode: string,
  ): Promise<PolymeshSdkService> {
    if (!this.instances.has(newNodeUrl)) {
      await this.getInstance(newNodeUrl, graphQlNode);
    }
    return this.instances.get(newNodeUrl)!;
  }

  public async getAccountsTransactionHistory(
    addresses: string[],
    params: {
      orderBy?: ExtrinsicsOrderBy;
      size?: BigNumber;
      start?: BigNumber;
    },
  ): Promise<ResultSet<ExtrinsicData>[]> {
    if (!this.polymeshSdk) {
      throw new Error('Polymesh SDK not initialized');
    }

    const histories = await Promise.all(
      addresses.map(async (address) => {
        const account = await this.polymeshSdk.accountManagement.getAccount({
          address,
        });
        return account.getTransactionHistory(params);
      }),
    );

    return histories;
  }
}
