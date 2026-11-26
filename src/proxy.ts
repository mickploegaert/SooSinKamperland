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
  const { loggedIn, cookiesToSet, headers } = await getAuthService().checkSession(request);

  let response: NextResponse;
  if (pathname.startsWith(DASHBOARD_PATH) && !loggedIn) {
    response = NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl));
  } else if (pathname === LOGIN_PATH && loggedIn) {
    response = NextResponse.redirect(new URL(DASHBOARD_PATH, request.nextUrl));
  } else {
    // Geeft eventueel ververste cookies door aan de pagina's van dit verzoek.
    response = NextResponse.next({ request });
  }

  // Ververste sessiecookies (Supabase) ook naar de browser sturen.
  for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
  for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/inloggen"],
};
