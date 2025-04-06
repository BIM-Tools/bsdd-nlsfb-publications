export function extractNamePart(name: string | null | undefined) {
  if (!name) {
    return "";
  }
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const parts = normalized.split(/[^a-zA-Z0-9\s]+/);
  const lastPart = parts[parts.length - 1].trim().toLowerCase();
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
}
