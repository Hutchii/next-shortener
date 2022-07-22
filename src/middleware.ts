import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("PATH", req.nextUrl.pathname);
  if (
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/api/")
  ) {
    console.log("Test");
    return;
  }

  const slug = req.nextUrl.pathname.split("/").pop();
  console.log("Test2");
  const data = await (
    await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)
  ).json();

  // console.log("Data", data);

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}

// export const config = {
//   matcher: "/:path*",
// };
