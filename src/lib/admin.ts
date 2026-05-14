export const ADMIN_EMAILS = [
  "avnishverma718@gmail.com",
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
  // Add your personal email here to grant yourself admin access:
  // "your.email@example.com"
].filter(Boolean);

/**
 * Checks if a given email has admin privileges.
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}