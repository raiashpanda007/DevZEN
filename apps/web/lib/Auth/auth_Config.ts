// nextauth-config.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import {prisma} from "@workspace/db";
import { JWT } from "next-auth/jwt";

const NEXT_AUTH_CONFIG: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }: { token: JWT; account: any; user: any }) {
      if (user) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                username: user.name || user.email?.split("@")[0],
                email: user.email,
                Account: account?.provider.toUpperCase() as "GOOGLE" | "GITHUB",
                profile: user.image || "",
              },
            });
          }

          token.id = dbUser.id;
          token.name = dbUser.username;
          token.email = dbUser.email;
          token.image = dbUser.profile || "";
          token.Account = dbUser.Account;
        } catch (error) {
          console.error("Error in login:", error);
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.Account = token.Account;
      }
      return session;
    },
  },
};

export default NEXT_AUTH_CONFIG;
