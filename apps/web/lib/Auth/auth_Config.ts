import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@workspace/db";

const NEXT_AUTH_CONFIG: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.NEXT_GITHUB_CLIENT_ID || "",
      clientSecret: process.env.NEXT_GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,

  callbacks: {
    async jwt({ token, account, user }:any) {
      try {
        if (!token.email) return token; // Ensure email exists
  
        const dbUser = await prisma.user.upsert({
          where: { email: token.email },
          update: {},
          create: {
            email: token.email,
            username: token.name ?? "New User",
          profile: token.picture,
            Account: account?.provider === "google" ? "GOOGLE" : "GITHUB",
          },
        });
  
        token.id = dbUser.id;
        token.name = dbUser.username;
        token.email = dbUser.email;
        token.image = dbUser.profile;
        token.Account = dbUser.Account;
  
      } catch (error) {
        console.error("JWT Callback Error: ", error);
        
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id; // Ensure `id` is included
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
