import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      backendToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    backendToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    backendToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            },
          );

          const data = await res.json();

          if (res.ok && data?.token && data?.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              backendToken: data.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Credentials Auth Error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

        if ("backendToken" in user) {
          token.backendToken = user.backendToken;
        }
      }

      if (account?.provider === "google" && user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                googleId: account.providerAccountId,
                avatar: user.image,
              }),
            },
          );

          const data = await response.json();

          if (response.ok && data.token) {
            token.backendToken = data.token;
            token.id = data.user.id;
          }
        } catch (error) {
          console.error("Google Token Exchange Failed:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.backendToken = token.backendToken;
      }
      return session;
    },
  },

  events: {
    async signOut() {
      console.log("NextAuth session cleared.");
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
