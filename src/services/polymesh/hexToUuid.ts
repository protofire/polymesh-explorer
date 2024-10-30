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
