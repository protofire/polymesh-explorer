export function capitalizeFirstLetter(identifier: string | undefined) {
  return identifier
    ? identifier.charAt(0).toUpperCase() + identifier.slice(1)
    : '';
}

export function splitCamelCase(text: string): string {
  // Don't split if the string already has spaces or is uppercase
  if (/\s/.test(text) || text === text.toUpperCase()) {
    return text;
  }

  // Regex to identify camelCase or UpperCamelCase
  // Note: this function will also split by non alpha numeric characters e.g. underscore
  const match = text.match(/([a-z0-9]+|[A-Z][a-z0-9]*)/g);

  if (match) {
    return match.join(' ');
  }

  return text;
}

export function removeLeadingZeros(str: string) {
  return str.replace(/^0+/, '');
}
