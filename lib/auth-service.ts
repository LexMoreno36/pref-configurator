/**
 * Client-side authentication service
 * This service handles token retrieval and caching without exposing credentials
 */

// In-memory token cache
const tokenCache: {
  accessToken: string | null
  expiresAt: number | null
} = {
  accessToken: null,
  expiresAt: null,
}

/**
 * Get an authentication token from the server
 * This function calls our server-side API route which handles the actual authentication
 */
export async function getAuthToken(): Promise<string> {
  // Return cached token if it's still valid (with 30 second buffer)
  if (tokenCache.accessToken && tokenCache.expiresAt && Date.now() < tokenCache.expiresAt - 30000) {
    return tokenCache.accessToken
  }

  try {
    // Call our server-side auth endpoint
    const response = await fetch("/api/auth")

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get auth token: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    // Cache the token
    tokenCache.accessToken = data.accessToken
    tokenCache.expiresAt = Date.now() + data.expiresIn * 1000

    return data.accessToken
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}

/**
 * Create an Authorization header with the token
 */
export async function getAuthHeader(): Promise<HeadersInit> {
  const token = await getAuthToken()
  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Clear the token cache (useful for logout or testing)
 */
export function clearTokenCache(): void {
  tokenCache.accessToken = null
  tokenCache.expiresAt = null
}

/**
 * Make an authenticated fetch request
 * This is a wrapper around fetch that automatically adds the auth header
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeader = await getAuthHeader()

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...authHeader,
    },
  })
}
