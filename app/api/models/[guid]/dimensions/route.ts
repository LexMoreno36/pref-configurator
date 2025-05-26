export const runtime = "nodejs"

import type { NextRequest } from "next/server"
import { API_ENDPOINTS } from "@/lib/api/constants"
import { corsResponse, corsErrorResponse, logApiCall, handleCorsOptions } from "@/lib/api/utils"
import {
  parseCommandResultValue,
  parseDimensionsString,
  createGetDimensionsCommand,
  createSetDimensionValueCommand,
} from "@/lib/xml-utils"
import { fetch as undiciFetch, Agent } from "undici"

export async function OPTIONS() {
  return handleCorsOptions()
}

// GET dimensions for a specific model
export async function GET(request: NextRequest, { params }: { params: Promise<{ guid: string }> }) {
  try {
    const { guid } = await params

    if (!guid) {
      return corsErrorResponse("Missing model GUID", 400)
    }

    // Create undici agent to bypass SSL verification
    const dispatcher = new Agent({
      connect: { rejectUnauthorized: false },
    })

    const url = API_ENDPOINTS.models.dimensions(guid)
    const commandXml = createGetDimensionsCommand()

    logApiCall("POST", url)

    const response = await undiciFetch(url, {
      dispatcher,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandXml),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logApiCall("POST", url, response.status, errorText)
      return corsErrorResponse(`Get dimensions failed: ${response.status} ${errorText}`, response.status)
    }

    // Parse the XML response
    const xmlResponse = await response.text()
    const dimensionsValue = parseCommandResultValue(xmlResponse)

    if (!dimensionsValue) {
      return corsErrorResponse("Failed to parse dimensions from response", 500)
    }

    // Parse the dimensions string into an object
    const dimensions = parseDimensionsString(dimensionsValue)

    return corsResponse({ dimensions })
  } catch (error) {
    logApiCall("GET", `/api/models/[guid]/dimensions`, undefined, error)
    return corsErrorResponse(`Get dimensions error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// SET a dimension value
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

    const commandXml = createSetDimensionValueCommand(name, value)
    const url = API_ENDPOINTS.models.dimensions(guid)

    logApiCall("POST", url)

    const response = await undiciFetch(url, {
      dispatcher,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandXml),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logApiCall("POST", url, response.status, errorText)
      return corsErrorResponse(`Set dimension failed: ${response.status} ${errorText}`, response.status)
    }

    // Get the updated dimensions
    const getDimensionsXml = createGetDimensionsCommand()

    const getDimensionsResponse = await undiciFetch(url, {
      dispatcher,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getDimensionsXml),
    })

    if (!getDimensionsResponse.ok) {
      const errorText = await getDimensionsResponse.text()
      logApiCall("POST", url, getDimensionsResponse.status, errorText)
      return corsErrorResponse(
        `Get updated dimensions failed: ${getDimensionsResponse.status}`,
        getDimensionsResponse.status,
      )
    }

    // Parse the XML response
    const xmlResponse = await getDimensionsResponse.text()
    const dimensionsValue = parseCommandResultValue(xmlResponse)

    if (!dimensionsValue) {
      return corsErrorResponse("Failed to parse dimensions from response", 500)
    }

    // Parse the dimensions string into an object
    const dimensions = parseDimensionsString(dimensionsValue)

    return corsResponse({
      success: true,
      dimensions,
    })
  } catch (error) {
    logApiCall("POST", `/api/models/[guid]/dimensions`, undefined, error)
    return corsErrorResponse(`Set dimension error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
