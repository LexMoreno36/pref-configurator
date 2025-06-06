export const runtime = "nodejs"

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { mockData } from "@/lib/mock-data"
import { API_ENDPOINTS, CORS_HEADERS } from "@/lib/api/constants"
import { logApiCall, handleCorsOptions } from "@/lib/api/utils"
import { fetch as undiciFetch, Agent } from "undici"

export async function OPTIONS() {
  return handleCorsOptions()
}

interface Params {
  params: Promise<{ modelId: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const { modelId } = await params
  if (!modelId) {
    return NextResponse.json(mockData, { headers: CORS_HEADERS })
  }

  try {
    const dispatcher = new Agent({ connect: { rejectUnauthorized: false } })

    const getUrl = API_ENDPOINTS.models.cloudOptions(modelId)
    logApiCall("GET", getUrl)

    const getRes = await undiciFetch(getUrl, {
      dispatcher,
      method: "GET",
      headers: { accept: "text/plain" },
    })

    const getBody = await getRes.text()

    if (!getRes.ok) {
      logApiCall("GET", getUrl, getRes.status, getBody)
      console.error(`Failed to fetch option list: ${getRes.status}`, getBody)
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    let optionsList: unknown
    try {
      optionsList = JSON.parse(getBody)
    } catch (parseErr) {
      logApiCall("GET", getUrl, undefined, `JSON parse error: ${parseErr}`)
      console.error("Failed to parse option list:", parseErr)
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    const postUrl = API_ENDPOINTS.configurator.processOptions()
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
    const postBody = await postRes.text()

    if (!postRes.ok) {
      logApiCall("POST", postUrl, postRes.status, postBody)
      console.error(`Failed to process options: ${postRes.status}`, postBody)
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    let processedData: unknown
    try {
      processedData = JSON.parse(postBody)
    } catch (parseErr) {
      logApiCall("POST", postUrl, undefined, `JSON parse error: ${parseErr}`)
      console.error("Failed to parse processed options:", parseErr)
      return NextResponse.json(mockData, { headers: CORS_HEADERS })
    }

    return NextResponse.json(processedData, { headers: CORS_HEADERS })
  } catch (err) {
    logApiCall("GET", `/api/configurator/${modelId}`, undefined, err)
    console.error("Unexpected error in configurator route:", err)
    return NextResponse.json(mockData, { headers: CORS_HEADERS })
  }
}
