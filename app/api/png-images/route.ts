import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { guid } = body

    // 1. Solicitar un nuevo session_id
    const sessionResp = await fetch("http://reydemo.prefnet.net:8012/usd-service/v1/Session/New", {
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

    // 2. Usar el session_id en la petición de imágenes
    const imagesResp = await fetch(`http://reydemo.prefnet.net:8012/usd-service/v1/Images?sessionId=${sessionId}`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        models: [
          {
            filePathsOrGuids: `${guid}`,
            maker: "Reynaers",
            system: "MasterPatio",
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
