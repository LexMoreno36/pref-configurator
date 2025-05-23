import { ImageType } from "./api/constants"

const modelState: {
  guid: string | null
  modelCode: string
  createModelPromise: Promise<string> | null
} = {
  guid: null,
  modelCode: "1_vent_1rail_OG",
  createModelPromise: null,
}

export async function getModelGuid(): Promise<string> {
  if (modelState.guid) {
    return modelState.guid
  }

  if (modelState.createModelPromise) {
    return modelState.createModelPromise
  }

  modelState.createModelPromise = createModelInternal()

  try {
    return await modelState.createModelPromise
  } finally {
    modelState.createModelPromise = null
  }
}

async function createModelInternal(): Promise<string> {
  try {
    const response = await fetch("/api/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelCode: modelState.modelCode,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Create model failed: ${error.message}`)
    }

    const data = await response.json()
    const guid = data.guid

    modelState.guid = guid

    return guid
  } catch (error) {
    console.error("Create model error:", error)
    throw error
  }
}

export async function createModel(modelCode?: string): Promise<string> {
  resetModelState()

  if (modelCode) {
    modelState.modelCode = modelCode
  }

  return getModelGuid()
}

// Updated to accept a specific GUID parameter
export async function fetchSvgImage(guid: string, width = 500, height = 500): Promise<string> {
  try {
    // Use the provided GUID instead of getting it from state
    const response = await fetch(`/api/models/${guid}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageType: ImageType.SVG,
        width,
        height,
      }),
    })

    if (!response.ok) {
      throw new Error(`Fetch SVG failed: ${response.status}`)
    }

    const data = await response.json()
    return data.base64
  } catch (error) {
    console.error("Fetch SVG error:", error)
    throw error
  }
}

// Updated to accept a specific GUID parameter
export async function fetchGltfModel(guid: string, width = 500, height = 500): Promise<string> {
  try {
    // Use the provided GUID instead of getting it from state
    const response = await fetch(`/api/models/${guid}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageType: ImageType.GLTF,
        width,
        height,
      }),
    })

    if (!response.ok) {
      throw new Error(`Fetch GLTF failed: ${response.status}`)
    }

    const data = await response.json()
    return data.base64
  } catch (error) {
    console.error("Fetch GLTF error:", error)
    throw error
  }
}

export function resetModelState(): void {
  modelState.guid = null
  modelState.createModelPromise = null
}

export function getApiState() {
  return {
    model: {
      guid: modelState.guid,
      modelCode: modelState.modelCode,
      hasActivePromise: modelState.createModelPromise !== null,
    },
  }
}
