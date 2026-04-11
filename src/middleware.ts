import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_AUTH_ROUTES = ["/login", "/recovery"];
const PROTECTED_PREFIXES = ["/admin", "/empresa", "/empleado"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isPublicAuthPath(pathname: string) {
  return PUBLIC_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

async function getAccessDetails(userId: string) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return { active: false, role: null };
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await adminClient
    .from("empleados")
    .select("id, rol, activo")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return { active: false, role: null };
  }

  return { active: data.activo, role: data.rol };
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    if (isPublicAuthPath(pathname) || isProtectedPath(pathname)) {
      const access = await getAccessDetails(user.id);
      const isInternalRole = access.active && (access.role === "admin_general" || access.role === "admin_empresa" || access.role === "empleado");

      if (isPublicAuthPath(pathname) && isInternalRole) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isProtectedPath(pathname)) {
        if (pathname.startsWith("/admin") && access.role !== "admin_general") {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/recovery",
    "/admin/:path*",
    "/empresa/:path*",
    "/empleado/:path*",
  ],
};
