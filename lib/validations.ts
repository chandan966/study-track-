import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Mobile number must be at least 10 digits")
      .regex(/^[0-9+\s\-()]{10,20}$/, "Please enter a valid mobile number (e.g. 9876543210)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(3, "Please enter your Email, 12-digit Student ID, or Mobile Number"),
  password: z.string().min(1, "Password is required"),
});

export const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  description: z.string().optional(),
  color: z.string().default("#EC4899"),
  icon: z.string().optional().default("book-open"),
  targetHours: z.number().min(1, "Target hours must be at least 1").default(50),
});

export const topicSchema = z.object({
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).default("NOT_STARTED"),
  understanding: z.number().min(0).max(100).default(0),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  revisionDate: z.string().optional().nullable(),
  subjectId: z.string().min(1, "Subject is required"),
});

export const studySessionSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  topicId: z.string().optional().nullable(),
  mode: z.enum(["NORMAL", "POMODORO"]).default("NORMAL"),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
  durationSeconds: z.number().default(0),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  whatStudied: z.string().optional().nullable(),
  whatLearned: z.string().optional().nullable(),
  whatUnderstood: z.string().optional().nullable(),
  whatNotUnderstood: z.string().optional().nullable(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional().default("MEDIUM"),
  personalNotes: z.string().optional().nullable(),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional().nullable(),
  subjectId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  status: z.enum(["PENDING", "COMPLETED"]).default("PENDING"),
  isRecurring: z.boolean().default(false),
});

export const noteSchema = z.object({
  title: z.string().min(1, "Note title is required"),
  content: z.string().min(1, "Content cannot be empty"),
  subjectId: z.string().optional().nullable(),
  topicId: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z
    .string()
    .regex(/^[0-9+\s\-()]{10,20}$/, "Please enter a valid mobile number")
    .optional()
    .nullable()
    .or(z.literal("")),
  college: z.string().optional().nullable(),
  course: z.string().optional().nullable(),
  branch: z.string().optional().nullable(),
  academicYear: z.string().optional().nullable(),
  semester: z.string().optional().nullable(),
  dailyGoalMinutes: z.number().min(15).max(1440).default(360),
  preferredStudyHours: z.string().optional().nullable(),
});
