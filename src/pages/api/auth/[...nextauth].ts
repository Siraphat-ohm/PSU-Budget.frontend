import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import axios from "@/lib/axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        try {
          const res = await axios.post( `/auth/signin`,  { username:  credentials?.username, password: credentials?.password  } );
          return res.data;
        } catch (error:any) {
          return error.response.data;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn( { user, credentials }){
      return user.allowLogin
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    maxAge: 29 * 24 * 60 * 60 
  }
};

export default NextAuth(authOptions);