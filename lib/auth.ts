import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email or 12-Digit Student ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your Email or 12-Digit Student ID and password");
        }

        const identifier = credentials.email.trim();
        const isEmail = identifier.includes("@");

        // Find user by either email or 12-digit studentId
        const user = isEmail
          ? await prisma.user.findUnique({
              where: {
                email: identifier.toLowerCase(),
              },
            })
          : await prisma.user.findFirst({
              where: {
                OR: [
                  { studentId: identifier },
                  { email: identifier.toLowerCase() },
                ],
              },
            });

        if (!user || !user.password) {
          throw new Error("No student account found with this Email or 12-Digit Student ID");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password. Please check your credentials.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.studentId = user.studentId;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.studentId = token.studentId as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "studytrack_development_fallback_secret_key_32_characters",
};

export default authOptions;
