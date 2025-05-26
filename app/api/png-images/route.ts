import { type NextRequest, NextResponse } from "next/server"
import { API_ENDPOINTS, API_CONFIG } from "@/lib/api/constants"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { guid } = body

    // 1. Request a new session_id
    const sessionUrl = API_ENDPOINTS.usdService.newSession()
    const sessionResp = await fetch(sessionUrl, {
      method: "POST",
      headers: {
        accept: "*/*",
      },
      body: "",
    })

    if (!sessionResp.ok) {
      return NextResponse.json({ error: "No se pudo obtener el session_id" }, { status: 500 })
    }

    const sessionData = await sessionResp.json()
    const sessionId = sessionData.session_id

    if (!sessionId) {
      return NextResponse.json({ error: "Respuesta inválida al obtener session_id" }, { status: 500 })
    }

    // 2. Use the session_id to request images
    const imagesUrl = API_ENDPOINTS.usdService.images(sessionId)
    const imagesResp = await fetch(imagesUrl, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        models: [
          {
            filePathsOrGuids: `${guid}`,
            maker: API_CONFIG.makerCapitalized,
            system: API_CONFIG.system,
            generateWall: true,
          },
        ],
        quality: ["low"],
        resolution: ["2K"],
        cameras: ["Camera_Inner_01", "Camera_Outer_01"],
      }),
    })

    if (!imagesResp.ok) {
      return NextResponse.json({ error: "No se pudieron obtener las imágenes PNG" }, { status: 500 })
    }

    const data = await imagesResp.json()
    const images = Array.isArray(data.captured_image_path)
      ? data.captured_image_path.map((url: string) => url.replace(/[`'"]/g, "").replace(/\\/g, "/"))
      : []

    return NextResponse.json({ images })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error al cargar imágenes PNG" }, { status: 500 })
  }
}
