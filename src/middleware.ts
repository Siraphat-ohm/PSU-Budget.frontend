import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    
    if (!token) {
      const absoluteURL = new URL("/auth/signin", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/budget/:path*"],
};
