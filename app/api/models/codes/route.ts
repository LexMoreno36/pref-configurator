export const runtime = "nodejs"

import type { NextRequest } from "next/server"
import { API_ENDPOINTS, buildUrl } from "@/lib/api/constants"
import { corsResponse, corsErrorResponse, logApiCall, handleCorsOptions } from "@/lib/api/utils"
import { fetch as undiciFetch, Agent } from "undici"

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function GET(request: NextRequest) {
  try {
    const authResponse = await fetch(`${request.nextUrl.origin}/api/auth`)
    if (!authResponse.ok) {
      const errorData = await authResponse.json()
      return corsErrorResponse(`Failed to get auth token: ${errorData.message}`, authResponse.status)
    }

    const { accessToken } = (await authResponse.json()) as {
      accessToken: string
    }

    const dispatcher = new Agent({
      connect: { rejectUnauthorized: false },
    })

    const url = buildUrl(API_ENDPOINTS.models.codes(), {
      pageNumber: 1,
      pageSize: 50,
    })

    logApiCall("GET", url)

    const response = await undiciFetch(url, {
      dispatcher,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      logApiCall("GET", url, response.status, errorText)
      return corsErrorResponse(`Fetch model codes failed: ${response.status} ${errorText}`, response.status)
    }

    const modelCodes = await response.json()
    return corsResponse({ modelCodes })
  } catch (error) {
    logApiCall("GET", "/api/models/codes", undefined, error)
    return corsErrorResponse(`Fetch model codes error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
