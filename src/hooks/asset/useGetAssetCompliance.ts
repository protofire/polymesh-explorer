import { useQuery } from '@tanstack/react-query';
import {
  Asset as AssetSdk,
  ConditionType,
  ConditionTarget,
  ActiveTransferRestrictions,
} from '@polymeshassociation/polymesh-sdk/types';
import { customReportError } from '@/utils/customReportError';
import { formatTrustedForList } from '@/utils/formatSdkTypes';

export interface ComplianceCondition {
  target: string;
  type: string;
  claims?: {
    type: string;
    scope?: {
      type: string;
      value: string;
    };
  }[];
  claim?: {
    type: string;
    scope?: {
      type: string;
      value: string;
    };
  };
  identityDid?: string;
  trustedClaimIssuers?: {
    did: string;
    trustedFor: string[] | null;
  }[];
}

export interface ComplianceRule {
  id: string;
  conditions: ComplianceCondition[];
}

export interface ComplianceData {
  defaultTrustedClaimIssuers: {
    did: string;
    trustedFor: string[] | null;
  }[];
  requirements: ComplianceRule[];
  isPaused: boolean;
  transferRestrictions: ActiveTransferRestrictions | null;
}

export const useGetAssetCompliance = (assetSdk?: AssetSdk) => {
  return useQuery({
    queryKey: ['assetCompliance'],
    queryFn: async (): Promise<ComplianceData> => {
      if (!assetSdk) {
        throw new Error('Asset SDK not initialized');
      }

      try {
        const [complianceData, isPaused] = await Promise.all([
          assetSdk.compliance.requirements.get(),
          assetSdk.compliance.requirements.arePaused(),
        ]);

        let transferRestrictions: ActiveTransferRestrictions | null = null;

        if ('transferRestrictions' in assetSdk) {
          transferRestrictions =
            await assetSdk.transferRestrictions.getRestrictions();
        }

        const { defaultTrustedClaimIssuers, requirements } = complianceData;

        return {
          defaultTrustedClaimIssuers: defaultTrustedClaimIssuers.map(
            ({ identity, trustedFor }) => ({
              did: identity.did,
              trustedFor: formatTrustedForList(trustedFor),
            }),
          ),
          requirements: requirements.map(({ conditions, id }) => ({
            id: id.toString(),
            conditions: conditions.map((condition) => {
              const baseCondition = {
                target:
                  condition.target === ConditionTarget.Both
                    ? 'Sender and Receiver'
                    : condition.target,
                type: condition.type,
                trustedClaimIssuers: condition.trustedClaimIssuers?.map(
                  ({ identity, trustedFor }) => ({
                    did: identity.did,
                    trustedFor: formatTrustedForList(trustedFor),
                  }),
                ),
              };

              switch (condition.type) {
                case ConditionType.IsPresent:
                case ConditionType.IsAbsent:
                  return {
                    ...baseCondition,
                    claim: condition.claim,
                  };
                case ConditionType.IsAnyOf:
                case ConditionType.IsNoneOf:
                  return {
                    ...baseCondition,
                    claims: condition.claims,
                  };
                case ConditionType.IsIdentity:
                  return {
                    ...baseCondition,
                    identityDid: condition.identity.did,
                  };
                default:
                  return baseCondition;
              }
            }),
          })),
          isPaused,
          transferRestrictions,
        };
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!assetSdk,
  });
};
