import { CORS_HEADERS } from "./constants"
import { NextResponse } from "next/server"

// Helper to read response body safely
export async function readBody(res: Response): Promise<string> {
  try {
    return await res.text()
  } catch {
    return "<unable to read body>"
  }
}

// Helper to log API requests and responses
export function logApiCall(method: string, url: string, status?: number, error?: any) {
  const timestamp = new Date().toISOString()

  if (error) {
    console.error(`[${timestamp}] ${method} ${url} failed:`, error)
    return
  }

  if (status) {
    console.log(`[${timestamp}] ${method} ${url} - Status: ${status}`)
    return
  }

  console.log(`[${timestamp}] ${method} ${url}`)
}

// Helper to create a response with CORS headers
export function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS,
  })
}

// Helper to create an error response with CORS headers
export function corsErrorResponse(message: string, status = 500) {
  return NextResponse.json(
    { error: true, message },
    {
      status,
      headers: CORS_HEADERS,
    },
  )
}

// Handle OPTIONS requests for CORS preflight
export function handleCorsOptions() {
  return new Response(null, {
    status: 204, // No content
    headers: CORS_HEADERS,
  })
}
