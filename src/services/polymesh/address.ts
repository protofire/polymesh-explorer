export const truncateAddress = (
  value: string | undefined,
  sideLength = 6,
): string => {
  if (!value) {
    return '';
  }

  if (value.length <= sideLength * 2) {
    return value;
  }

  const start = value.substring(0, sideLength);
  const end = value.substring(value.length - sideLength);
  return `${start}...${end}`;
};
