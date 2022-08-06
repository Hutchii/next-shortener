import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/").pop();
  const dataFetch = await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`);

  if (dataFetch.status === 404 || dataFetch.status === 500) {
    return NextResponse.redirect(req.nextUrl.origin);
  }

  const data = await dataFetch.json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}

export const config = {
  matcher: "/:slug",
};