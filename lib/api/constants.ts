// API configuration with hardcoded values
export const API_CONFIG = {
  baseUrl: "https://pfreydemo.prefnet.net/qa-reynaers",
  pwbBaseUrl: "https://pfreydemo.prefnet.net/qa-reynaers/prefweb",
  omniverse: "https://pfreydemo.prefnet.net",
  username: "api@preferencesl.com",
  password: "api$1234",
  // API parameters
  maker: "reynaers", // Changed from "preference" to "reynaers"
  uiDefinitionName: "uidefinition",
  optionListName: "sceneoptions",
}

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
