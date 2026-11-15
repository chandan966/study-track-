import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { generateUniqueStudentId } from "@/lib/studentId";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.replace(/[^0-9+]/g, "").trim();

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 400 }
      );
    }

    // Check if user with this mobile number already exists
    const existingPhone = await prisma.user.findFirst({
      where: { phone: normalizedPhone },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: "An account with this mobile number already exists" },
        { status: 400 }
      );
    }

    // Generate unique 12-digit student ID
    const studentId = await generateUniqueStudentId();

    // Hash password with 12 salt rounds for enhanced security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        studentId,
        password: hashedPassword,
        dailyGoalMinutes: 360, // 6 hours default
      },
    });

    return NextResponse.json(
      {
        message: "Registration successful! Your 12-digit student account has been created.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          studentId: user.studentId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
