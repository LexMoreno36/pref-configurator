export const runtime = "nodejs"

import type { NextRequest } from "next/server"
import { API_CONFIG } from "@/lib/api/constants"
import { corsResponse, corsErrorResponse, logApiCall, handleCorsOptions } from "@/lib/api/utils"
import { createSetOptionValueCommand } from "@/lib/xml-utils"
import { fetch as undiciFetch, Agent } from "undici"

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ guid: string }> }) {
  try {
    const { guid } = await params

    if (!guid) {
      return corsErrorResponse("Missing model GUID", 400)
    }

    const { name, value } = await request.json()

    if (name === undefined || value === undefined) {
      return corsErrorResponse("Missing required parameters: name or value", 400)
    }

    // Create undici agent to bypass SSL verification
    const dispatcher = new Agent({
      connect: { rejectUnauthorized: false },
    })

    // Create the SetOptionsValues command
    const commandXml = createSetOptionValueCommand(name, value)

    // Use baseUrl for erp.hydrawebapi.service and no auth
    const url = `${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/${guid}/ExecuteCommand`
    logApiCall("POST", url)

    const response = await undiciFetch(url, {
      dispatcher,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandXml), // Direct stringify of the command XML
    })

    if (!response.ok) {
      const errorText = await response.text()
      logApiCall("POST", url, response.status, errorText)
      return corsErrorResponse(`Set option value failed: ${response.status} ${errorText}`, response.status)
    }

    // Return success response
    return corsResponse({
      success: true,
      message: `Option ${name} updated to ${value}`,
    })
  } catch (error) {
    logApiCall("POST", `/api/models/[guid]/options`, undefined, error)
    return corsErrorResponse(`Set option value error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
