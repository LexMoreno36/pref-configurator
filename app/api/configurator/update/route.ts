export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { mockData } from "@/lib/mock-data"
import { API_CONFIG, CORS_HEADERS } from "@/lib/api/constants"
import { logApiCall, readBody, handleCorsOptions } from "@/lib/api/utils"
import { fetch as undiciFetch, Agent } from "undici"

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function PUT(request: Request) {
  try {
    const requestBody = await request.json()

    if (!requestBody || !requestBody.name || !requestBody.options || !Array.isArray(requestBody.options)) {
      console.error("Invalid request body:", requestBody)
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    // Create undici agent to bypass SSL verification
    const dispatcher = new Agent({
      connect: { rejectUnauthorized: false },
    })

    // Step 1: PUT to kb.api.service to update the option list - use baseUrl and no auth
    const putUrl = `${API_CONFIG.baseUrl}/KB.api.Service/v1/optionLists/${API_CONFIG.maker}`
    logApiCall("PUT", putUrl)

    try {
      const putRes = await undiciFetch(putUrl, {
        dispatcher,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "text/plain",
        },
        body: JSON.stringify(requestBody),
      })

      const putBody = await readBody(putRes)

      if (!putRes.ok) {
        logApiCall("PUT", putUrl, putRes.status, putBody)
        console.error("PUT request failed:", putBody)
        return NextResponse.json(mockData, { headers: CORS_HEADERS })
      }

      let updatedOptionsList: any
      try {
        updatedOptionsList = JSON.parse(putBody)
      } catch (parseErr) {
        logApiCall("PUT", putUrl, undefined, `JSON parse error: ${parseErr}`)
        console.error("Failed to parse PUT response:", parseErr)
        return NextResponse.json(mockData, { headers: CORS_HEADERS })
      }

      // Step 2: POST to KB.UIConfigurator.Service to process the updated options - use baseUrl and no auth
      const postUrl = `${API_CONFIG.baseUrl}/KB.UIConfigurator.Service/api/v1/makers/${API_CONFIG.maker}/process-options/${API_CONFIG.uiDefinitionName}`
      logApiCall("POST", postUrl)

      const postRes = await undiciFetch(postUrl, {
        dispatcher,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(updatedOptionsList),
      })

      const postBody = await readBody(postRes)

      if (!postRes.ok) {
        logApiCall("POST", postUrl, postRes.status, postBody)
        console.error("POST request failed:", postBody)
        return NextResponse.json(mockData, { headers: CORS_HEADERS })
      }

      let processedData: any
      try {
        processedData = JSON.parse(postBody)
      } catch (parseErr) {
        logApiCall("POST", postUrl, undefined, `JSON parse error: ${parseErr}`)
        console.error("Failed to parse POST response:", parseErr)
        return NextResponse.json(mockData, { headers: CORS_HEADERS })
      }

      // Return the processed UI definition
      return NextResponse.json(processedData, { headers: CORS_HEADERS })
    } catch (fetchErr) {
      console.error("Fetch error:", fetchErr)
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }
  } catch (err) {
    logApiCall("PUT", "/api/configurator/update", undefined, err)
    console.error("Unexpected error in update route:", err)
    return NextResponse.json(mockData, { headers: CORS_HEADERS })
  }
}
