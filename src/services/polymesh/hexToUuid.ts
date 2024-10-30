export const removeHexPrefix = (text: string) => {
  return text.startsWith('0x') ? text.substring(2) : text;
};

// Helper function to convert a 16-byte hex string to a UUID formatted string
export function hexToUuid(hex: string): string {
  const unprefixedHex = removeHexPrefix(hex);

  // Ensure the hex string is exactly 16 bytes (32 hex characters)
  if (unprefixedHex.length !== 32) {
    throw new Error(
      `Invalid hex length. Expected 16 bytes (32 hex characters), received ${unprefixedHex.length}`,
    );
  }

  // Insert dashes to form a UUID format
  return `${unprefixedHex.slice(0, 8)}-${unprefixedHex.slice(8, 12)}-${unprefixedHex.slice(12, 16)}-${unprefixedHex.slice(16, 20)}-${unprefixedHex.slice(20)}`;
}

// Helper function to convert a UUID formatted string to a 16-byte hex string with a 0x prefix
export function uuidToHex(uuid: string): string {
  const hexUuidRegex = /^0x[0-9a-fA-F]{32}$/;

  // If it's already in the correct hex format, return it as is
  if (hexUuidRegex.test(uuid)) {
    return uuid;
  }

  // Regex to check if it's a valid UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(uuid)) {
    throw new Error('Invalid UUID format.');
  }

  // Remove dashes and add '0x' prefix
  const hex = uuid.replace(/-/g, '');
  return `0x${hex}`;
}
