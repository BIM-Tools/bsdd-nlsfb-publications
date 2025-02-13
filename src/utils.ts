export function extractNamePart(name: string | null | undefined) {
  if (!name) {
    return "";
  }
  const parts = name.split(/[^a-zA-Z0-9]+/);
  const lastPart = parts[parts.length - 1].trim().toLowerCase();
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
}