// Get base URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com/api"

// API configuration with dynamic base URL
export const API_CONFIG = {
  baseUrl: `${API_BASE_URL}`,
  pwbBaseUrl: `${API_BASE_URL}/prefweb`,
  omniverse: `${API_BASE_URL}`,
  usdServiceUrl: `${API_BASE_URL}:8012`,
  cloudModelServiceUrl: `${API_BASE_URL}/Cloud.ModelService`,
  username: process.env.NEXT_PUBLIC_API_USERNAME || "api@preferencesl.com",
  password: process.env.NEXT_PUBLIC_API_PASSWORD || "api$1234",
  // API parameters
  maker: "reynaers",
  makerCapitalized: "Reynaers", // For cases where capitalized version is needed
  makerPrefix: "RY_", // Prefix for option names and values (maker-specific)
  uiDefinitionName: "uidefinition",
  optionListName: "sceneoptions",
  // System parameters
  system: "MasterPatio", // For USD service
}

// API Endpoints - centralized endpoint definitions
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    token: () => `${API_CONFIG.pwbBaseUrl}/token`,
  },

  // Models
  models: {
    create: () => `${API_CONFIG.pwbBaseUrl}/api/v1/items`,
    codes: () => `${API_CONFIG.pwbBaseUrl}/api/v1/items/codes`,
    images: (guid: string) => `${API_CONFIG.pwbBaseUrl}/api/v1/integration/sap/sales/items/${guid}/get-image`,
    dimensions: (guid: string) => `${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/${guid}/ExecuteCommand`,
    options: (guid: string) => `${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/${guid}/ExecuteCommand`,
    cloudOptions: (modelId: string) => `${API_CONFIG.cloudModelServiceUrl}/api/v1/Options/model?modelId=${modelId}`,
  },

  // Configurator
  configurator: {
    optionList: () =>
      `${API_CONFIG.baseUrl}/KB.api.Service/v1/optionLists/${API_CONFIG.maker}/${API_CONFIG.optionListName}`,
    updateOptionList: () => `${API_CONFIG.baseUrl}/KB.api.Service/v1/optionLists/${API_CONFIG.maker}`,
    processOptions: () =>
      `${API_CONFIG.baseUrl}/KB.UIConfigurator.Service/api/v1/makers/${API_CONFIG.maker}/process-options/${API_CONFIG.uiDefinitionName}`,
  },

  // USD Service (PNG Images)
  usdService: {
    newSession: () => `${API_CONFIG.usdServiceUrl}/usd-service/v1/Session/New`,
    images: (sessionId: string) => `${API_CONFIG.usdServiceUrl}/usd-service/v1/Images?sessionId=${sessionId}`,
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
  if (!params || Object.keys(params).length === 0) {
    return baseUrl
  }

  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  return url.toString()
}
