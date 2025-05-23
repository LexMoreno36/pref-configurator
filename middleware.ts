import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { CORS_HEADERS } from "./lib/api/constants"

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Handle OPTIONS requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    })
  }

  // For other requests, add CORS headers to the response
  const response = NextResponse.next()

  // Add CORS headers to all API responses
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: "/api/:path*",
}
