import { TrustedFor } from '@polymeshassociation/polymesh-sdk/types';

export function formatTrustedFor(claimType: TrustedFor): string {
  if (
    typeof claimType === 'object' &&
    claimType !== null &&
    'customClaimTypeId' in claimType
  ) {
    return `Custom (${claimType.customClaimTypeId.toString()})`;
  }

  return String(claimType);
}

export function formatTrustedForList(
  trustedFor: TrustedFor[] | null,
): string[] | null {
  if (!trustedFor) {
    return null;
  }

  return trustedFor.map(formatTrustedFor);
}
