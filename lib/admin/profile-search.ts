const POSTGREST_RESERVED_CHARACTERS = /[%_,()*"\\]/g;
const REPEATED_WHITESPACE = /\s+/g;

function sanitizeSearchTerm(searchTerm: string): string {
  return searchTerm
    .replace(POSTGREST_RESERVED_CHARACTERS, " ")
    .replace(REPEATED_WHITESPACE, " ")
    .trim();
}

export function buildProfileSearchFilter(searchTerm: string): string | null {
  const safeTerm = sanitizeSearchTerm(searchTerm);
  if (!safeTerm) return null;
  const pattern = `"%${safeTerm}%"`;
  return `full_name.ilike.${pattern},email.ilike.${pattern}`;
}
