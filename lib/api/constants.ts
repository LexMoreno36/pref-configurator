// Helper function to capitalize the first letter of a string
const capitalize = (str: string): string => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Get maker and create capitalized version if not provided
const defaultMaker = process.env.NEXT_PUBLIC_DEFAULT_MAKER || ""
const makerCapitalized = process.env.NEXT_PUBLIC_MAKER_CAPITALIZED || capitalize(defaultMaker)

// Check if code is running on the server
const isServer = typeof window === "undefined"

// API configuration with environment variables
export const API_CONFIG = {
  // Base URLs - no defaults, must be provided via env vars
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
  get pwbBaseUrl() {
    return this.baseUrl ? `${this.baseUrl}/prefweb` : ""
  },
  get omniverse() {
    return this.baseUrl || ""
  },
  get usdServiceUrl() {
    return this.baseUrl ? `${this.baseUrl}:8012` : ""
  },
  get cloudModelServiceUrl() {
    return this.baseUrl ? `${this.baseUrl}/Cloud.ModelService` : ""
  },

  // Authentication - server-side only, no NEXT_PUBLIC prefix
  // These will only be available in server components, API routes, etc.
  get username() {
    // Only access these variables on the server
    if (isServer) {
      return process.env.API_USERNAME || ""
    }
    // Return empty string on client to prevent errors
    return ""
  },
  get password() {
    // Only access these variables on the server
    if (isServer) {
      return process.env.API_PASSWORD || ""
    }
    // Return empty string on client to prevent errors
    return ""
  },

  // Maker configuration - customer specific
  maker: defaultMaker,
  makerCapitalized: makerCapitalized,
  makerPrefix: process.env.NEXT_PUBLIC_MAKER_PREFIX || "",

  // UI configuration - customer specific
  uiDefinitionName: process.env.NEXT_PUBLIC_UI_DEFINITION_NAME || "",
  optionListName: process.env.NEXT_PUBLIC_OPTION_LIST_NAME || "",

  // System parameters - customer specific
  system: process.env.NEXT_PUBLIC_DEFAULT_SYSTEM || "",

  // Feature flags
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",
}

// API Endpoints - centralized endpoint definitions
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    token: () => (API_CONFIG.pwbBaseUrl ? `${API_CONFIG.pwbBaseUrl}/token` : ""),
  },

  // Models
  models: {
    create: () => (API_CONFIG.pwbBaseUrl ? `${API_CONFIG.pwbBaseUrl}/api/v1/items` : ""),
    codes: () => (API_CONFIG.pwbBaseUrl ? `${API_CONFIG.pwbBaseUrl}/api/v1/items/codes` : ""),
    images: (guid: string) =>
      API_CONFIG.pwbBaseUrl ? `${API_CONFIG.pwbBaseUrl}/api/v1/integration/sap/sales/items/${guid}/get-image` : "",
    dimensions: (guid: string) =>
      API_CONFIG.baseUrl ? `${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/${guid}/ExecuteCommand` : "",
    options: (guid: string) =>
      API_CONFIG.baseUrl ? `${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/${guid}/ExecuteCommand` : "",
    cloudOptions: (modelId: string) =>
      API_CONFIG.cloudModelServiceUrl
        ? `${API_CONFIG.cloudModelServiceUrl}/api/v1/Options/model?modelId=${modelId}`
        : "",
  },

  // Configurator
  configurator: {
    optionList: () => {
      if (!API_CONFIG.baseUrl || !API_CONFIG.maker || !API_CONFIG.optionListName) return ""
      return `${API_CONFIG.baseUrl}/KB.api.Service/v1/optionLists/${API_CONFIG.maker}/${API_CONFIG.optionListName}`
    },
    updateOptionList: () => {
      if (!API_CONFIG.baseUrl || !API_CONFIG.maker) return ""
      return `${API_CONFIG.baseUrl}/KB.api.Service/v1/optionLists/${API_CONFIG.maker}`
    },
    processOptions: () => {
      if (!API_CONFIG.baseUrl || !API_CONFIG.maker || !API_CONFIG.uiDefinitionName) return ""
      return `${API_CONFIG.baseUrl}/KB.UIConfigurator.Service/api/v1/makers/${API_CONFIG.maker}/process-options/${API_CONFIG.uiDefinitionName}`
    },
  },

  // USD Service (PNG Images)
  usdService: {
    newSession: () => (API_CONFIG.usdServiceUrl ? `${API_CONFIG.usdServiceUrl}/usd-service/v1/Session/New` : ""),
    images: (sessionId: string) =>
      API_CONFIG.usdServiceUrl ? `${API_CONFIG.usdServiceUrl}/usd-service/v1/Images?sessionId=${sessionId}` : "",
  },
} as const

// Image types for the API
export enum ImageType {
  PNG = 3,
  SVG = 5,
  GLTF = 11,
}

// CORS headers for API responses
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Helper function to build URLs with query parameters
export function buildUrl(baseUrl: string, params?: Record<string, string | number>): string {
  if (!baseUrl || !params || Object.keys(params).length === 0) {
    return baseUrl
  }

  try {
    const url = new URL(baseUrl)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
    return url.toString()
  } catch (error) {
    console.error(`Invalid URL: ${baseUrl}`, error)
    return baseUrl
  }
}

// Validate required environment variables
export function validateEnvironment(): {
  valid: boolean
  missing: string[]
  clientMissing: string[]
  serverMissing: string[]
} {
  // Variables required on both client and server
  const clientRequiredVars = [
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_DEFAULT_MAKER",
    "NEXT_PUBLIC_MAKER_PREFIX",
    "NEXT_PUBLIC_DEFAULT_SYSTEM",
    "NEXT_PUBLIC_UI_DEFINITION_NAME",
    "NEXT_PUBLIC_OPTION_LIST_NAME",
  ]

  // Variables required only on the server
  const serverRequiredVars = ["API_USERNAME", "API_PASSWORD"]

  // Check client variables
  const clientMissing = clientRequiredVars.filter((varName) => !process.env[varName])

  // Check server variables only when running on the server
  const serverMissing = isServer ? serverRequiredVars.filter((varName) => !process.env[varName]) : []

  // Combine all missing variables
  const missing = [...clientMissing, ...serverMissing]

  return {
    valid: missing.length === 0,
    missing,
    clientMissing,
    serverMissing,
  }
}

// Helper to check if we have valid authentication credentials
// Only call this on the server!
export function hasValidAuthCredentials(): boolean {
  if (!isServer) {
    console.warn("Auth credentials check attempted on client side")
    return false
  }

  return Boolean(process.env.API_USERNAME && process.env.API_PASSWORD)
}
