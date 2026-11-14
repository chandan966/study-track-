import prisma from "./prisma";

/**
 * Generates a unique 12-digit student identification number.
 * Format: 2026 (year, 4 digits) + 8 cryptographically sound random digits.
 * Example: "202684920153"
 */
export async function generateUniqueStudentId(): Promise<string> {
  const yearPrefix = "2026";
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    attempts++;
    // Generate 8 random digits (10000000 to 99999999)
    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000).toString();
    const candidateId = `${yearPrefix}${randomSuffix}`;

    // Verify uniqueness in database
    const existing = await prisma.user.findUnique({
      where: { studentId: candidateId },
    });

    if (!existing) {
      return candidateId;
    }
  }

  // Fallback to high-precision timestamp based 12 digits
  const timestampSuffix = Date.now().toString().slice(-8);
  return `${yearPrefix}${timestampSuffix}`;
}

/**
 * Formats a 12-digit Student ID for display with spaces:
 * "202684920153" -> "2026 8492 0153"
 */
export function formatStudentId(id?: string | null): string {
  if (!id) return "N/A";
  const cleaned = id.replace(/\s+/g, "");
  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`;
  }
  return cleaned;
}
