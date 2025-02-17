import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions, Session } from "next-auth";
import { prisma } from "@workspace/db/";
import { JWT } from "next-auth/jwt";

interface SessionProps extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string;
    Account?: "GOOGLE" | "GITHUB";
  };
}

interface JWTProps extends JWT {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string;
  Account?: "GOOGLE" | "GITHUB";
}

const NEXT_AUTH_CONFIG: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({ user }) {
      return !!user.name;
    },
    async jwt({ token, account, user }) {
      try {
        if (user) {
          let dbUser = await prisma.user.findUnique({
            where: { username: user.name ?? undefined },
          });
          console.log("dbUser", dbUser);
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                username: user.name!,
                email: user.email,
                Account: account?.provider === "google" ? "GOOGLE" : "GITHUB",
                profile: user.image,
              },
            });
          }

          token.id = dbUser.id;
          token.name = dbUser.username;
          token.email = dbUser.email;
          token.image = dbUser.profile;
          token.Account = dbUser.Account;
        }
      } catch (error) {
        console.error("Error in login:", error);
      }
      return token;
    },
    async session({ session, token }: any)  {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.email = token.email ?? null;
        session.user.name = token.name ?? null;
        session.user.image = token.image ?? undefined;
        session.user.Account = token.Account ?? undefined;
      }
      return session;
    },
  },
};

export default NEXT_AUTH_CONFIG;
