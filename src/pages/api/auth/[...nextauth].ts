// import NextAuth from "next-auth";

// import { authOptions } from "~/server/auth";

// export default NextAuth(authOptions);

import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
'allowImportingTsExtensions'
import { env } from "../../../env.mjs";
import { db } from "~/server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Get the user's role from the database and add it to the session
        // This is used to determine if the user is an admin or not
        const userRole = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        session.user.role = userRole?.role || 1;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(db),
    providers: [
    //   need to fix
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    maxAge: 60 * 60 * 24 * 1, // 1 day
    updateAge: 60 * 60 * 12, // 12 hours
  },
};

export default NextAuth(authOptions);