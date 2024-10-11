import {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { GraphQLClient } from 'graphql-request';
import { PolymeshSdkService } from '@/services/PolymeshSdkService';
import { DEFAULT_NETWORK, NETWORK_MAP } from '@/config/constant';
import { useNetworkProvider } from '@/context/NetworkProvider/useNetworkProvider';

interface IPolymeshSdkContext {
  polymeshService: PolymeshSdkService | null;
  isLoading: boolean;
  error: Error | null;
  graphQlClient: GraphQLClient;
  networkConfig: { rpc: string; graphQlNode: string };
}

export const PolymeshSdkContext = createContext<IPolymeshSdkContext>(
  {} as IPolymeshSdkContext,
);

export function PolymeshSdkProvider({ children }: PropsWithChildren) {
  const [polymeshService, setPolymeshSdk] = useState<PolymeshSdkService | null>(
    null,
  );
  const [graphQlClient, setGraphQlClient] = useState<GraphQLClient | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentNetworkConfig } = useNetworkProvider();

  const networkConfig = useMemo(() => {
    const { rpc, graphQlNode } = currentNetworkConfig || {
      rpc: NETWORK_MAP[DEFAULT_NETWORK].rpc,
      graphQlNode: NETWORK_MAP[DEFAULT_NETWORK].graphQlNode,
    };
    return { rpc, graphQlNode };
  }, [currentNetworkConfig]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    setGraphQlClient(new GraphQLClient(networkConfig.graphQlNode));
    PolymeshSdkService.getInstance(networkConfig.rpc, networkConfig.graphQlNode)
      .then((service) => {
        setPolymeshSdk(service);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to initialize PolymeshService'),
        );
        setPolymeshSdk(null);
      })
      .finally(() => setIsLoading(false));
  }, [networkConfig]);

  const contextValue = useMemo(
    () => ({
      polymeshService,
      isLoading,
      error,
      graphQlClient,
      networkConfig,
    }),
    [polymeshService, isLoading, error, graphQlClient, networkConfig],
  );
  return (
    <PolymeshSdkContext.Provider value={contextValue as IPolymeshSdkContext}>
      {children}
    </PolymeshSdkContext.Provider>
  );
}
