export const runtime = "nodejs"

import type { NextRequest } from "next/server"
import { fetch, Agent } from "undici"
import { API_ENDPOINTS, API_CONFIG } from "@/lib/api/constants"
import { corsResponse, corsErrorResponse, handleCorsOptions, logApiCall } from "@/lib/api/utils"

interface TokenResponse {
  access_token: string
  expires_in: number
}

const authState: {
  accessToken: string | null
  expiresAt: number | null
  fetchPromise: Promise<{ accessToken: string; expiresIn: number }> | null
} = {
  accessToken: null,
  expiresAt: null,
  fetchPromise: null,
}

export async function GET(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return handleCorsOptions()
  }

  try {
    // Return cached token if still valid
    if (authState.accessToken && authState.expiresAt && Date.now() < authState.expiresAt) {
      return corsResponse({
        accessToken: authState.accessToken,
        expiresIn: Math.floor((authState.expiresAt - Date.now()) / 1000),
      })
    }

    // If a fetch is already in progress, await it
    if (authState.fetchPromise) {
      return corsResponse(await authState.fetchPromise)
    }

    // Kick off a new fetch
    authState.fetchPromise = fetchNewToken()

    try {
      const result = await authState.fetchPromise
      return corsResponse(result)
    } finally {
      authState.fetchPromise = null
    }
  } catch (error) {
    logApiCall("GET", "/api/auth", undefined, error)
    return corsErrorResponse(`Authentication error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function fetchNewToken(): Promise<{
  accessToken: string
  expiresIn: number
}> {
  const formData = new URLSearchParams({
    grant_type: "password",
    username: API_CONFIG.username,
    password: API_CONFIG.password,
  })

  const url = API_ENDPOINTS.auth.token()
  logApiCall("POST", url)

  // Use Undici's Agent to disable cert validation (only for dev/local)
  const dispatcher = new Agent({
    connect: { rejectUnauthorized: false },
  })

  const response = await fetch(url, {
    dispatcher,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logApiCall("POST", url, response.status, errorText)
    throw new Error(`Authentication failed: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as TokenResponse
  logApiCall("POST", url, response.status)

  authState.accessToken = data.access_token
  authState.expiresAt = Date.now() + data.expires_in * 1000 - 300_000

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  }
}
