export function base64ToGltf(base64String: string, filename = "model.glb") {
  return new Promise<{
    blob: Blob
    url: string
    filename: string
    extension: string
    dispose: () => void
  }>((resolve, reject) => {
    try {
      let cleanBase64 = base64String
      if (cleanBase64.startsWith('"') && cleanBase64.endsWith('"')) {
        cleanBase64 = cleanBase64.slice(1, -1)
      }

      if (cleanBase64.includes("base64,")) {
        cleanBase64 = cleanBase64.split("base64,")[1]
      }

      const firstDecode = atob(cleanBase64)

      let innerB64 = firstDecode.trim()
      if (
        (innerB64.startsWith('"') && innerB64.endsWith('"')) ||
        (innerB64.startsWith("'") && innerB64.endsWith("'"))
      ) {
        innerB64 = JSON.parse(innerB64)
      }
      innerB64 = innerB64.replace(/\s+/g, "")

      const secondDecode = atob(innerB64)

      let isJson = false
      let gltfJson = null
      try {
        gltfJson = JSON.parse(secondDecode)
        isJson = true
      } catch (e) {
        // Not valid JSON, likely binary GLB format
      }

      const bytes = new Uint8Array(secondDecode.length)
      for (let i = 0; i < secondDecode.length; i++) {
        bytes[i] = secondDecode.charCodeAt(i)
      }

      const isGlb = bytes.length > 4 && bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46

      let mimeType, extension
      if (isGlb) {
        mimeType = "model/gltf-binary"
        extension = ".glb"
        filename = filename.endsWith(".glb") ? filename : filename.replace(".gltf", ".glb")
      } else if (isJson) {
        mimeType = "model/gltf+json"
        extension = ".gltf"
        filename = filename.endsWith(".gltf") ? filename : filename.replace(".glb", ".gltf")
      } else {
        mimeType = "model/gltf-binary"
        extension = ".glb"
      }

      const blob = new Blob([bytes], { type: mimeType })
      const url = URL.createObjectURL(blob)

      resolve({
        blob,
        url,
        filename,
        extension,
        dispose: () => {
          URL.revokeObjectURL(url)
        },
      })
    } catch (error) {
      console.error("Error in base64ToGltf:", error)
      reject(new Error(`Error converting base64 to GLTF: ${error instanceof Error ? error.message : String(error)}`))
    }
  })
}

/**
 * Creates a URL from a base64-encoded GLTF/GLB model
 * @param base64String The base64-encoded model data
 * @returns Promise with the URL and a dispose function
 */
export function createModelUrlFromBase64(base64String: string) {
  return new Promise<{
    url: string
    dispose: () => void
  }>(async (resolve, reject) => {
    try {
      let cleanBase64 = base64String
      if (cleanBase64.startsWith('"') && cleanBase64.endsWith('"')) {
        cleanBase64 = cleanBase64.slice(1, -1)
      }

      if (cleanBase64.includes("base64,")) {
        cleanBase64 = cleanBase64.split("base64,")[1]
      }

      const firstDecode = atob(cleanBase64)

      let innerB64 = firstDecode.trim()
      if (
        (innerB64.startsWith('"') && innerB64.endsWith('"')) ||
        (innerB64.startsWith("'") && innerB64.endsWith("'"))
      ) {
        innerB64 = JSON.parse(innerB64)
      }
      innerB64 = innerB64.replace(/\s+/g, "")

      const secondDecode = atob(innerB64)

      let isJson = false
      try {
        JSON.parse(secondDecode)
        isJson = true
      } catch (e) {
        // Not valid JSON, likely binary GLB format
      }

      const bytes = new Uint8Array(secondDecode.length)
      for (let i = 0; i < secondDecode.length; i++) {
        bytes[i] = secondDecode.charCodeAt(i)
      }

      const isGlb = bytes.length > 4 && bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46

      let mimeType
      if (isGlb) {
        mimeType = "model/gltf-binary"
      } else if (isJson) {
        mimeType = "model/gltf+json"
      } else {
        mimeType = "model/gltf-binary" // Default to binary
      }

      const blob = new Blob([bytes], { type: mimeType })
      const url = URL.createObjectURL(blob)

      const dispose = () => {
        URL.revokeObjectURL(url)
      }

      resolve({ url, dispose })
    } catch (error) {
      console.error("Error creating model URL:", error)
      reject(new Error(`Error converting base64 to URL: ${error instanceof Error ? error.message : String(error)}`))
    }
  })
}

// Remove this function as it's now handled by the api-service.ts with the correct GUID
// export async function fetchGltfModel(modelGuid: string, width = 500, height = 500): Promise<string> {
//   try {
//     const response = await fetch(`/api/models/${modelGuid}/images`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         imageType: 11, // GLTF type
//         width,
//         height,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`Fetch GLTF model failed: ${response.status}`)
//     }

//     const data = await response.json()
//     return data.base64
//   } catch (error) {
//     console.error("Fetch model error:", error)
//     throw error
//   }
// }
