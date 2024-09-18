export function isDid(input: string): boolean {
  // DID format: 0x followed by 64 hexadecimal characters
  const didPattern = /^0x[a-fA-F0-9]{64}$/;
  return didPattern.test(input);
}
