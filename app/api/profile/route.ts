import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// Strict Password Validation Rule:
// - At least 8 characters
// - At least 1 uppercase letter (A-Z)
// - At least 1 lowercase letter (a-z)
// - At least 2 numbers (0-9)
// - At least 1 special character (!@#$%^&* etc.)
function validatePasswordRules(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: "New password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "New password must contain at least 1 uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "New password must contain lowercase letters (a-z)." };
  }
  const digitCount = (password.match(/\d/g) || []).length;
  if (digitCount < 2) {
    return { valid: false, error: "New password must contain at least 2 numbers (0-9)." };
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-=+~`[\]\\;/]/.test(password)) {
    return { valid: false, error: "New password must contain at least 1 special character (!@#$%^&* etc.)." };
  }
  return { valid: true };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        studentId: true,
        image: true,
        college: true,
        course: true,
        branch: true,
        academicYear: true,
        semester: true,
        dailyGoalMinutes: true,
        preferredStudyHours: true,
        soundEnabled: true,
        notificationsEnabled: true,
        theme: true,
        createdAt: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid profile data" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name: result.data.name.trim(),
      college: result.data.college || null,
      course: result.data.course || null,
      branch: result.data.branch || null,
      academicYear: result.data.academicYear || null,
      semester: result.data.semester || null,
      dailyGoalMinutes: result.data.dailyGoalMinutes,
      preferredStudyHours: result.data.preferredStudyHours || null,
      soundEnabled: body.soundEnabled !== undefined ? Boolean(body.soundEnabled) : undefined,
      notificationsEnabled: body.notificationsEnabled !== undefined ? Boolean(body.notificationsEnabled) : undefined,
      theme: body.theme || undefined,
    };

    // 1. Email Update & Uniqueness Check
    if (result.data.email) {
      const targetEmail = result.data.email.toLowerCase().trim();
      if (targetEmail !== existingUser.email.toLowerCase()) {
        const emailExists = await prisma.user.findFirst({
          where: {
            email: targetEmail,
            NOT: { id: user.id },
          },
        });
        if (emailExists) {
          return NextResponse.json(
            { error: "This email address is already registered to another student account." },
            { status: 400 }
          );
        }
        updateData.email = targetEmail;
      }
    }

    // 2. Mobile Number Update & Uniqueness Check
    if (result.data.phone !== undefined) {
      const rawPhone = (result.data.phone || "").trim();
      if (rawPhone) {
        const normalizedPhone = rawPhone.replace(/[^\d+]/g, "");
        const digitsOnly = normalizedPhone.replace(/\D/g, "");
        if (digitsOnly.length < 10) {
          return NextResponse.json(
            { error: "Mobile number must contain at least 10 digits." },
            { status: 400 }
          );
        }

        if (normalizedPhone !== existingUser.phone) {
          const phoneExists = await prisma.user.findFirst({
            where: {
              OR: [
                { phone: normalizedPhone },
                { phone: digitsOnly },
              ],
              NOT: { id: user.id },
            },
          });
          if (phoneExists) {
            return NextResponse.json(
              { error: "This mobile number is already in use by another student account." },
              { status: 400 }
            );
          }
          updateData.phone = normalizedPhone;
        }
      } else {
        updateData.phone = null;
      }
    }

    // 3. Password Change Verification & 5 Security Rules
    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: "Please enter your current password to verify your identity before changing your password." },
          { status: 400 }
        );
      }

      // Verify current password against database hash
      const isCurrentValid = await bcrypt.compare(body.currentPassword, existingUser.password);
      if (!isCurrentValid) {
        return NextResponse.json(
          { error: "The current password you entered is incorrect." },
          { status: 400 }
        );
      }

      // Verify confirm password matching
      if (body.confirmNewPassword && body.newPassword !== body.confirmNewPassword) {
        return NextResponse.json(
          { error: "The new password and confirmation password do not match." },
          { status: 400 }
        );
      }

      // Validate against strict 5-rule password complexity
      const ruleCheck = validatePasswordRules(body.newPassword);
      if (!ruleCheck.valid) {
        return NextResponse.json(
          { error: ruleCheck.error },
          { status: 400 }
        );
      }

      // Hash with 12 salt rounds
      updateData.password = await bcrypt.hash(body.newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        studentId: true,
        college: true,
        course: true,
        branch: true,
        academicYear: true,
        semester: true,
        dailyGoalMinutes: true,
        preferredStudyHours: true,
        soundEnabled: true,
        notificationsEnabled: true,
        theme: true,
      },
    });

    return NextResponse.json({
      success: true,
      profile: updated,
      passwordChanged: Boolean(body.newPassword),
    });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
