import { ValidationResult } from '@/domain/ui/ValidationResult';

const ASSET_ID_PATTERN = /^0x[a-f0-9]{32}$/i;

/**
 * Validates an asset ID format
 * @param assetId - The asset ID to validate (format: 0x + 32 hex characters)
 * @returns ValidationResult object containing validation status and error message if any
 */
export const validateAssetId = (assetId: string): ValidationResult => {
  if (!assetId) {
    return {
      isValid: false,
      error: 'Asset ID is required',
    };
  }

  if (!ASSET_ID_PATTERN.test(assetId)) {
    return {
      isValid: false,
      error: 'Invalid asset ID format. Expected format: 0x + 32 hex characters',
    };
  }

  return {
    isValid: true,
  };
};
