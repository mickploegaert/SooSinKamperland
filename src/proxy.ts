import { NextResponse, type NextRequest } from "next/server";
import { getAuthService } from "@/lib/auth/service";

const LOGIN_PATH = "/inloggen";
const DASHBOARD_PATH = "/dashboard";

/**
 * Optimistische controle op de sessiecookie. De echte controle gebeurt in de
 * Data Access Layer (`requireAdmin`) dichtbij de gegevens.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = await getAuthService().hasValidSession(request);

  if (pathname.startsWith(DASHBOARD_PATH) && !loggedIn) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl));
  }

  if (pathname === LOGIN_PATH && loggedIn) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/inloggen"],
};
