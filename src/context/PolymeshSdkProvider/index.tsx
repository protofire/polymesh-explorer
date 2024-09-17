import {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { GraphQLClient } from 'graphql-request';
import { PolymeshSdkService } from '@/services/PolymeshSdkService';
import { GRAPHQL_ENDPOINT, POLYMESH_NODE_URL } from '@/config/constant';

interface IPolymeshSdkContext {
  polymeshService: PolymeshSdkService | null;
  isLoading: boolean;
  error: Error | null;
  graphQlClient: GraphQLClient;
}

const graphQlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export const PolymeshSdkContext = createContext<IPolymeshSdkContext>({
  polymeshService: null,
  isLoading: false,
  error: null,
  graphQlClient,
});

export function PolymeshSdkProvider({ children }: PropsWithChildren) {
  const [polymeshService, setPolymeshSdk] = useState<PolymeshSdkService | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentNodeUrl] = useState<string>(POLYMESH_NODE_URL);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    PolymeshSdkService.getInstance(currentNodeUrl)
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
  }, [currentNodeUrl]);

  const contextValue = useMemo(
    () => ({
      polymeshService,
      isLoading,
      error,
      graphQlClient,
    }),
    [polymeshService, isLoading, error],
  );

  return (
    <PolymeshSdkContext.Provider value={contextValue}>
      {children}
    </PolymeshSdkContext.Provider>
  );
}
