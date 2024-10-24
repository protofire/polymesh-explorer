import { Account as SdkAccount } from '@polymeshassociation/polymesh-sdk/types';
import { Account, IdentityRelationship } from '@/domain/entities/Account';

interface AccountTypeInfo {
  keyType: string;
  relation: string;
}

export function transformAccount(
  sdkAccount: SdkAccount,
  typeInfo: AccountTypeInfo,
  did: string | undefined | null,
): Account {
  return {
    key: sdkAccount.address,
    identityDid: did || null,
    identityRelationship: typeInfo.relation as IdentityRelationship,
    isMultisig: typeInfo.keyType === 'Multisig',
    isSmartContract: typeInfo.keyType === 'SmartContract',
    polymeshSdkClass: sdkAccount,
  };
}
