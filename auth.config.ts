import { compare } from "bcrypt-ts";
import Google from "next-auth/providers/google";
import credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./lib/zodSchemas";
import prisma from "./lib/prisma";

export default {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const result = LoginSchema.safeParse(credentials);
          if (!result.success) {
            return null;
          }

          const { email, password } = result.data;

          // Get user from database
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const passwordMatch = await compare(password, user.password);
          if (!passwordMatch) {
            return null;
          }

          // Important: Return user with all necessary fields
          const returnUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
          return returnUser;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
