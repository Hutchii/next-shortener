import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // if (req.nextUrl.pathname.startsWith("/api/get-url")) {
  //   console.log("Returning early from /api/get-url");
  //   return;
  // }

  console.log("Middleware", req.nextUrl.pathname);

  const slug = req.nextUrl.pathname.split("/").pop();
  //We can`t call PRISMA in here because this runs on the cloudflare edge in ther VE Runtime that isnt a native box so we cant use PRISMA because PRISMA uses rust uder the hood. We have to fetch from our own endpoint.

  const data = await (
    await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)
  ).json();

  console.log("Data", data);

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}
