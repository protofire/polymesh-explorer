import {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { GraphQLClient } from 'graphql-request';
import { useNetworkProvider } from '../NetworkProvider';
import { PolymeshSdkService } from '@/services/PolymeshSdkService';
import { DEFAULT_NETWORK, NETWORK_MAP } from '@/config/constant';

interface IPolymeshSdkContext {
  polymeshService: PolymeshSdkService;
  isLoading: boolean;
  error: Error | null;
  graphQlClient: GraphQLClient;
}

export const PolymeshSdkContext = createContext<IPolymeshSdkContext>(
  {} as IPolymeshSdkContext,
);

export function PolymeshSdkProvider({ children }: PropsWithChildren) {
  const [polymeshService, setPolymeshSdk] = useState<PolymeshSdkService | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentNetworkConfig } = useNetworkProvider();
  // const [currentNodeUrl] = useState<string>(POLYMESH_NODE_URL);

  useEffect(() => {
    const rpc = currentNetworkConfig
      ? currentNetworkConfig.rpc
      : NETWORK_MAP[DEFAULT_NETWORK].rpc;

    setIsLoading(true);
    setError(null);

    PolymeshSdkService.getInstance(rpc)

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
  }, [currentNetworkConfig]);

  const graphQlClient = useMemo(() => {
    if (!currentNetworkConfig?.graphQlNode) {
      return null;
    }

    return new GraphQLClient(currentNetworkConfig.graphQlNode);
  }, [currentNetworkConfig?.graphQlNode]);

  const contextValue = useMemo(
    () => ({
      polymeshService,
      isLoading,
      error,
      graphQlClient,
    }),
    [polymeshService, isLoading, error, graphQlClient],
  );

  return (
    <PolymeshSdkContext.Provider value={contextValue}>
      {children}
    </PolymeshSdkContext.Provider>
  );
}
