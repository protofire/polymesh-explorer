import { ValidationResult } from '@/domain/ui/ValidationResult';
import { uuidToHex } from '../hexToUuid';

const HEX_PATTERN = /^0x[a-f0-9]{32}$/i;
const UUID_PATTERN =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

/**
 * Normalizes an asset ID to hex format
 * @param assetId - Asset ID in either hex or UUID format
 * @returns normalized hex format or null if invalid
 */
export function normalizeAssetId(assetId: string): string | null {
  if (HEX_PATTERN.test(assetId)) {
    return assetId.toLowerCase();
  }

  if (UUID_PATTERN.test(assetId)) {
    return uuidToHex(assetId).toLowerCase();
  }

  return null;
}

/**
 * Validates and normalizes an asset ID
 * @param assetId - The asset ID to validate (hex or UUID format)
 * @returns ValidationResult object containing validation status, normalized ID, and error message if any
 */
export interface AssetIdValidationResult extends ValidationResult {
  normalizedId?: string;
}

export const validateAssetId = (assetId: string): AssetIdValidationResult => {
  if (!assetId) {
    return {
      isValid: false,
      error: 'Asset ID is required',
    };
  }

  const normalizedId = normalizeAssetId(assetId);

  if (!normalizedId) {
    return {
      isValid: false,
      error:
        'Invalid asset ID format. Expected formats:\n- Hex: 0x + 32 hex characters\n- UUID: 8-4-4-4-12 hex characters',
    };
  }

  return {
    isValid: true,
    normalizedId,
  };
};
