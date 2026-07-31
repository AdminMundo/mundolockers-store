import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}

export async function updateAuthSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = request.nextUrl.pathname.startsWith("/mi-cuenta");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");

  if ((isAdminRoute || isAccountRoute) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && user) {
    const rawNext = request.nextUrl.searchParams.get("next") || "";
    const next = rawNext.startsWith("/")
      ? rawNext
      : isAdminEmail(user.email)
        ? "/admin"
        : "/mi-cuenta";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = next;
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
