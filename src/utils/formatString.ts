export function capitalizeFirstLetter(identifier: string | undefined) {
  return identifier
    ? identifier.charAt(0).toUpperCase() + identifier.slice(1)
    : '';
}
