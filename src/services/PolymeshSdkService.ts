/* eslint-disable no-console */
import { BigNumber, Polymesh } from '@polymeshassociation/polymesh-sdk';
import {
  ExtrinsicData,
  ExtrinsicsOrderBy,
  ResultSet,
} from '@polymeshassociation/polymesh-sdk/types';
import {
  DefaultPortfolio,
  NumberedPortfolio,
} from '@polymeshassociation/polymesh-sdk/internal';
import {
  DEFAULT_PORTFOLIO_NAME,
  PortfolioWithAssets,
} from '@/domain/entities/Portfolio';

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

  public async getIdentityPortfolios(
    did: string,
  ): Promise<PortfolioWithAssets[]> {
    if (!this.polymeshSdk) {
      throw new Error('Polymesh SDK not initialized');
    }

    try {
      const polymeshIdentity = await this.polymeshSdk.identities.getIdentity({
        did,
      });

      let portfolios = await polymeshIdentity.portfolios.getPortfolios();
      const custodiedPortfolios =
        await polymeshIdentity.portfolios.getCustodiedPortfolios();

      if (custodiedPortfolios?.data && custodiedPortfolios.data.length > 0) {
        portfolios = [
          portfolios[0],
          ...portfolios.slice(1),
          ...custodiedPortfolios.data,
        ] as [DefaultPortfolio, ...NumberedPortfolio[]];
      }

      return await Promise.all(
        portfolios.map(async (portfolio) => {
          const assetBalances = await portfolio.getAssetBalances();
          const custodian = await portfolio.getCustodian();
          const assets = assetBalances
            .filter(({ total }) => total.toNumber() > 0)
            .map((balance) => {
              return {
                assetId: balance.asset.id,
                balance: balance.total.toString(),
              };
            });

          const number = portfolio.toHuman().id
            ? (portfolio.toHuman().id as string)
            : '0';
          const name = portfolio.toHuman().id
            ? await (portfolio as NumberedPortfolio).getName()
            : DEFAULT_PORTFOLIO_NAME;
          const ownerDid = portfolio.toHuman().did;

          return {
            id: `${portfolio.toHuman().did}/${number}`,
            number,
            name,
            assets,
            custodianDid: custodian.did !== did ? custodian.did : undefined,
            otherOwner: ownerDid !== did ? ownerDid : undefined,
            portfolioSdk: portfolio,
          };
        }),
      );
    } catch (error) {
      console.error('Error fetching identity portfolios:', error);
      throw error;
    }
  }
}
