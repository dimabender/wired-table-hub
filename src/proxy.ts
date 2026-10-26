import { type NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  if (!req.cookies.has("__Host-session")) return redirectToHome(req);

  return NextResponse.next();
}

function redirectToHome(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = { matcher: ["/dashboard/:path*"] };
