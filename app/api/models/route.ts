export const runtime = "nodejs"

import type { NextRequest } from "next/server"
import { API_ENDPOINTS } from "@/lib/api/constants"
import { corsResponse, corsErrorResponse, logApiCall, handleCorsOptions } from "@/lib/api/utils"
import { fetch as undiciFetch, Agent } from "undici"

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function POST(request: NextRequest) {
  try {
    // Get model code from request body or use default
    const { modelCode = "1_vent_1rail_OG" } = await request.json().catch(() => ({}))

    // Get auth token
    const authResponse = await fetch(`${request.nextUrl.origin}/api/auth`)
    if (!authResponse.ok) {
      const error = await authResponse.json()
      return corsErrorResponse(`Failed to get auth token: ${error.message}`, authResponse.status)
    }

    const { accessToken } = await authResponse.json()

    // Create undici agent to bypass SSL verification
    const dispatcher = new Agent({
      connect: { rejectUnauthorized: false },
    })

    const url = API_ENDPOINTS.models.create()
    logApiCall("POST", url)

    const response = await undiciFetch(url, {
      dispatcher,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ModelCode: modelCode,
        IsPersistable: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logApiCall("POST", url, response.status, errorText)
      return corsErrorResponse(`Create model failed: ${response.status} ${errorText}`, response.status)
    }

    // Parse the response to get the itemId
    const responseData = await response.json()
    const guid = responseData.itemId

    if (!guid) {
      return corsErrorResponse("Invalid response: missing itemId", 500)
    }

    logApiCall("POST", url, response.status)

    return corsResponse({ guid, modelCode })
  } catch (error) {
    logApiCall("POST", "/api/models", undefined, error)
    return corsErrorResponse(`Create model error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
