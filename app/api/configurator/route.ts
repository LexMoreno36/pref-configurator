export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { mockData } from "@/lib/mock-data"
import { API_CONFIG, CORS_HEADERS } from "@/lib/api/constants"
import { logApiCall, readBody, handleCorsOptions } from "@/lib/api/utils"
import { fetch as undiciFetch, Agent } from "undici"

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function GET() {
  try {
    // Create undici agent to bypass SSL verification
    const dispatcher = new Agent({
      connect: { rejectUnauthorized: false },
    })

    // 1. GET OptionList - use baseUrl for KB.api.Service and no auth
    const getUrl = `${API_CONFIG.baseUrl}/KB.api.Service/v1/optionLists/${API_CONFIG.maker}/${API_CONFIG.optionListName}`
    logApiCall("GET", getUrl)

    const getRes = await undiciFetch(getUrl, {
      dispatcher,
      method: "GET",
      headers: { accept: "text/plain" },
    })

    const getBody = await readBody(getRes)

    if (!getRes.ok) {
      logApiCall("GET", getUrl, getRes.status, getBody)
      console.error(`Failed to fetch option list: ${getRes.status}`, getBody)

      // Return mock data instead of error
      logApiCall("GET", getUrl, undefined, "Returning mock data due to API error")
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    let optionsList: any
    try {
      optionsList = JSON.parse(getBody)
    } catch (parseErr) {
      logApiCall("GET", getUrl, undefined, `JSON parse error: ${parseErr}`)
      console.error("Failed to parse option list:", parseErr)

      // Return mock data instead of error
      logApiCall("GET", getUrl, undefined, "Returning mock data due to parse error")
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    // 2. POST to process-options - use baseUrl for KB.UIConfigurator.Service and no auth
    const postUrl = `${API_CONFIG.baseUrl}/KB.UIConfigurator.Service/api/v1/makers/${API_CONFIG.maker}/process-options/${API_CONFIG.uiDefinitionName}`
    logApiCall("POST", postUrl)

    const postRes = await undiciFetch(postUrl, {
      dispatcher,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(optionsList),
    })

    const postBody = await readBody(postRes)

    if (!postRes.ok) {
      logApiCall("POST", postUrl, postRes.status, postBody)
      console.error(`Failed to process options: ${postRes.status}`, postBody)

      // Return mock data instead of error
      logApiCall("POST", postUrl, undefined, "Returning mock data due to API error")
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    let processedData: any
    try {
      processedData = JSON.parse(postBody)
    } catch (parseErr) {
      logApiCall("POST", postUrl, undefined, `JSON parse error: ${parseErr}`)
      console.error("Failed to parse processed options:", parseErr)

      // Return mock data instead of error
      logApiCall("POST", postUrl, undefined, "Returning mock data due to parse error")
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    // all good
    return NextResponse.json(processedData, { headers: CORS_HEADERS })
  } catch (err) {
    logApiCall("GET", "/api/configurator", undefined, err)
    console.error("Unexpected error in configurator route:", err)

    // Return mock data instead of error
    logApiCall("GET", "/api/configurator", undefined, "Returning mock data due to unexpected error")
    return NextResponse.json(mockData, { headers: CORS_HEADERS })
  }
}
