export const getColSpan = (
  isHistorical: boolean,
  showVenueId: boolean,
): number => {
  const baseColumns = 6;
  const venueIdColumn = showVenueId ? 1 : 0;
  const executionAtColumn = isHistorical ? 1 : 0;

  return baseColumns + venueIdColumn + executionAtColumn;
};
