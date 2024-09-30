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
import { IS_DEVELOPMENT } from '@/config/environment';
import { DEFAULT_NETWORK, NETWORK_MAP } from '@/config/constant';

interface IPolymeshSdkContext {
  polymeshService: PolymeshSdkService | null;
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
  const { currentNetworkConfig, currentNetwork } = useNetworkProvider();
  // const [currentNodeUrl] = useState<string>(POLYMESH_NODE_URL);

  useEffect(() => {
    if (!currentNetworkConfig) return;

    setIsLoading(true);
    setError(null);

    PolymeshSdkService.getInstance(currentNetworkConfig.rpc)

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

  console.log('__graphQl', currentNetwork, currentNetworkConfig);

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
