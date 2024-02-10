import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // await connectDB();
  // console.log(" i run very very very first ");
  const token = request.cookies.get("token");
  const userId = request.cookies.get("userId");
  const uniqueBrowserId = request.cookies.get("browserId");
  const currentPath = request.nextUrl.pathname;
  const isAuthenticated = token?.value && userId?.value && uniqueBrowserId?.value;
  const isPublicPath = currentPath === "/login" || currentPath === "/sign-up";

  // console.log({ currentPath }, token?.value, userId?.value, uniqueBrowserId?.value);
  // const isLoginPage = currentPath === "/login";
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));

    // return NextResponse.next();
  }

  // console.log({ isAuthenticated, currentPath }, request.nextUrl.pathname);

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/sign-up", "/", "/reset-password", "/verify-email"],
};
