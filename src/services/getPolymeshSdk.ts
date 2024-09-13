import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { POLYMESH_NODE_URL } from '@/config/constant';

let instance: Polymesh | null = null;

export async function getPolymeshSdk(): Promise<Polymesh> {
  if (!instance) {
    instance = await Polymesh.connect({
      nodeUrl: POLYMESH_NODE_URL,
    });
  }
  return instance;
}
