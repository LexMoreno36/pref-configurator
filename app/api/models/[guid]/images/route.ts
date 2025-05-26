export const runtime = "nodejs"

import type { NextRequest } from "next/server"
import { API_ENDPOINTS, ImageType, CORS_HEADERS } from "@/lib/api/constants"
import { corsErrorResponse, logApiCall, handleCorsOptions } from "@/lib/api/utils"
import { NextResponse } from "next/server"
import { fetch as undiciFetch, Agent } from "undici"

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ guid: string }> }) {
  try {
    const { guid } = await params

    const { imageType, width = 500, height = 500 } = await request.json().catch(() => ({}))

    if (!imageType) {
      return corsErrorResponse("Missing imageType parameter", 400)
    }

    const authResponse = await fetch(`${request.nextUrl.origin}/api/auth`)
    if (!authResponse.ok) {
      const errorData = await authResponse.json()
      return corsErrorResponse(`Failed to get auth token: ${errorData.message}`, authResponse.status)
    }

    const { accessToken } = await authResponse.json()

    // Create undici agent to bypass SSL verification
    const dispatcher = new Agent({
      connect: { rejectUnauthorized: false },
    })

    const url = API_ENDPOINTS.models.images(guid)
    logApiCall("POST", url)

    const response = await undiciFetch(url, {
      dispatcher,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageType,
        width,
        height,
        units: 0,
        usePrefOne: true,
        visualPropertiesXML: `
<VisualProperties xsltType="0" xsltSubType="0" xsltName="">
  <ModelVisualProperties
    glassDimensionMode="ToVisibleGlass"
    gbModelDimensionsMode="default"
    textSize="3"
    minTextSize="0"
    scale="1"
    printWidth="50"
    printHeight="50"
    printMinWidth="0"
    printMinHeight="0"
    dpi="600"
    printQuality="vectorial"
  >
    <DimensionProperties>
      <DimensionHandle visible="1"/>
      <ModelDimensions visible="1"/>
      <GeorgianBarDimensionsInModel visible="1"/>
      <CompactDimensionText visible="0"/>
      <CompactCurvesText visible="0"/>
    </DimensionProperties>
    <ColorProperties>
      <ModelColors visible="1"/>
      <ModelGradientColors visible="1"/>
      <GlassesColors visible="1"/>
    </ColorProperties>
  </ModelVisualProperties>
</VisualProperties>
`,
        CadRenderer: {
          base64Textures: true,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logApiCall("POST", url, response.status, errorText)
      return corsErrorResponse(`Fetch image failed: ${response.status} ${errorText}`, response.status)
    }

    logApiCall("POST", url, response.status)

    if (imageType === ImageType.SVG) {
      const svgBase64 = await response.text()
      return NextResponse.json(
        { base64: svgBase64 },
        {
          headers: CORS_HEADERS,
        },
      )
    }

    if (imageType === ImageType.GLTF) {
      const buffer = await response.arrayBuffer()
      const base64 = Buffer.from(buffer).toString("base64")

      return NextResponse.json(
        { base64 },
        {
          headers: CORS_HEADERS,
        },
      )
    }

    if (imageType === ImageType.PNG) {
      const buffer = await response.arrayBuffer()
      return new Response(buffer, {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "image/png",
        },
      })
    }

    const data = await response.blob()
    return new Response(data, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
      },
    })
  } catch (error) {
    try {
      const { guid } = await params
      logApiCall("POST", `/api/models/${guid}/images`, undefined, error)
    } catch {
      logApiCall("POST", `/api/models/[unknown]/images`, undefined, error)
    }

    return corsErrorResponse(`Fetch image error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
