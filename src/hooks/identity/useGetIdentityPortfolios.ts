import { useQuery } from '@tanstack/react-query';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { customReportError } from '@/utils/customReportError';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';

interface Props {
  identity?: Identity | null;
}

export const useGetIdentityPortfolios = ({ identity }: Props) => {
  const { polymeshService } = usePolymeshSdkService();

  const queryResult = useQuery<PortfolioWithAssets[] | null, Error>({
    queryKey: ['useGetIdentityDetails', identity?.did],
    queryFn: async () => {
      if (!identity || !polymeshService) return null;

      try {
        return await polymeshService.getIdentityPortfolios(identity.did);
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!identity && !!polymeshService,
  });

  return queryResult;
};
