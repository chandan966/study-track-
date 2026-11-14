import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Helper to mask email for privacy (e.g. "chandan@gmail.com" -> "c*****n@gmail.com")
function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) {
    return `${name[0]}*@${domain}`;
  }
  return `${name[0]}${"*".repeat(Math.max(name.length - 2, 3))}${name[name.length - 1]}@${domain}`;
}

// Password validation rule helper:
// - At least 8 characters
// - At least 1 uppercase letter
// - At least 1 lowercase letter
// - At least 2 numbers (digits)
// - At least 1 special character
function validatePasswordRules(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain lowercase letters (a-z)." };
  }
  const digitCount = (password.match(/\d/g) || []).length;
  if (digitCount < 2) {
    return { valid: false, error: "Password must contain at least 2 numbers (0-9)." };
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-=+~`[\]\\;/]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 special character (!@#$%^&* etc.)." };
  }
  return { valid: true };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // ACTION 1: Verify Student ID / Scan Account
    if (action === "verify_id") {
      const identifier = (body.identifier || "").toString().replace(/\s+/g, "").trim();

      if (!identifier) {
        return NextResponse.json(
          { error: "Please enter your 12-digit student ID or registered email." },
          { status: 400 }
        );
      }

      const isEmail = identifier.includes("@");
      const user = isEmail
        ? await prisma.user.findUnique({
            where: { email: identifier.toLowerCase() },
            select: { id: true, name: true, email: true, studentId: true },
          })
        : await prisma.user.findFirst({
            where: {
              OR: [
                { studentId: identifier },
                { email: identifier.toLowerCase() },
              ],
            },
            select: { id: true, name: true, email: true, studentId: true },
          });

      if (!user) {
        return NextResponse.json(
          { error: "No student account found with this 12-digit Student ID or Email." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        exists: true,
        userId: user.id,
        name: user.name,
        studentId: user.studentId,
        maskedEmail: maskEmail(user.email),
        message: "Student account verified successfully on the educational ledger.",
      });
    }

    // ACTION 2: Reset Password with strict security rules
    if (action === "reset_password") {
      const identifier = (body.identifier || "").toString().replace(/\s+/g, "").trim();
      const newPassword = body.newPassword || "";
      const confirmPassword = body.confirmPassword || "";

      if (!identifier) {
        return NextResponse.json(
          { error: "Missing student identifier." },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "New passwords do not match." },
          { status: 400 }
        );
      }

      // Check strict password criteria
      const validation = validatePasswordRules(newPassword);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Find user
      const isEmail = identifier.includes("@");
      const user = isEmail
        ? await prisma.user.findUnique({
            where: { email: identifier.toLowerCase() },
          })
        : await prisma.user.findFirst({
            where: {
              OR: [
                { studentId: identifier },
                { email: identifier.toLowerCase() },
              ],
            },
          });

      if (!user) {
        return NextResponse.json(
          { error: "Account could not be found to update." },
          { status: 404 }
        );
      }

      // Hash with 12 rounds
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully updated! You can now log in.",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing password reset." },
      { status: 500 }
    );
  }
}
