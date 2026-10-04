import { NextResponse, type NextRequest } from "next/server";
import { pagehubMiddleware } from "@pagehub/next";

// Hands /_pagehub/* to PageHub with the visitor's IP attached.
// Every other path falls through to the app (and then to PageHub's fallback rewrite).
export function proxy(request: NextRequest) {
  const pagehub = pagehubMiddleware(request, {
    site: "ph-email-test",
    mountKey: process.env.PAGEHUB_MOUNT_KEY,
  });
  if (pagehub) return pagehub;

  return NextResponse.next();
}

export const config = { matcher: ["/_pagehub/:path*"] };
