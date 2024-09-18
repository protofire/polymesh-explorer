/* eslint-disable no-console */
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { POLYMESH_NODE_URL } from '@/config/constant';

export class PolymeshSdkService {
  private static instances: Map<string, Promise<PolymeshSdkService>> =
    new Map();

  public polymeshSdk: Polymesh;

  private constructor(polymesh: Polymesh) {
    this.polymeshSdk = polymesh;
  }

  public static async getInstance(
    nodeUrl?: string,
  ): Promise<PolymeshSdkService> {
    const url = nodeUrl || POLYMESH_NODE_URL;
    if (!this.instances.has(url)) {
      this.instances.set(url, this.initialize(url));
    }
    return this.instances.get(url)!;
  }

  private static async initialize(
    nodeUrl: string,
  ): Promise<PolymeshSdkService> {
    try {
      const polymesh = await Polymesh.connect({ nodeUrl });
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
  ): Promise<PolymeshSdkService> {
    if (!this.instances.has(newNodeUrl)) {
      await this.getInstance(newNodeUrl);
    }
    return this.instances.get(newNodeUrl)!;
  }
}
