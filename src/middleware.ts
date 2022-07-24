import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/static") ||
    /\.(.*)$/.test(req.nextUrl.pathname)
  ) {
    return;
  }

  const slug = req.nextUrl.pathname.split("/").pop();
  const data = await (
    await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)
  ).json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}
