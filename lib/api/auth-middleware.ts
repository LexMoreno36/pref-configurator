import type { NextRequest } from "next/server"
import { corsErrorResponse } from "./utils"

/**
 * Middleware to check if the request has a valid API key
 * This is for server-to-server API protection, not user authentication
 */
export async function validateApiKey(request: NextRequest): Promise<boolean> {
  const apiKey = request.headers.get("x-api-key")

  // If API key validation is enabled and configured
  if (process.env.ENABLE_API_KEY_VALIDATION === "true" && process.env.API_KEY) {
    return apiKey === process.env.API_KEY
  }

  // If validation is not enabled, consider it valid
  return true
}

/**
 * Middleware to handle API authentication
 * This wraps your API handler and adds authentication checks
 */
export function withApiAuth(handler: (req: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    // Skip validation for OPTIONS requests (CORS preflight)
    if (request.method === "OPTIONS") {
      return handler(request)
    }

    // Validate API key if present
    const isValidApiKey = await validateApiKey(request)
    if (!isValidApiKey) {
      return corsErrorResponse("Invalid API key", 401)
    }

    // Continue to the handler
    return handler(request)
  }
}
