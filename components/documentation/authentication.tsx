import { Lock } from "lucide-react"
import { EndpointCard } from "./endpoint-card"
import { API_CONFIG } from "@/lib/api/constants"

export function Authentication() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
        <p className="mt-2 text-gray-600">
          The Authentication API allows you to obtain access tokens for making authenticated requests to the API.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Authentication Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Request an access token using your API credentials</li>
            <li>Include the access token in the Authorization header of subsequent API requests</li>
            <li>Refresh the token when it expires</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="POST"
            endpoint={`${API_CONFIG.baseUrl}/prefweb/token`}
            description="Get an access token"
            requestBody={{
              grant_type: "password",
              username: API_CONFIG.username,
              password: API_CONFIG.password,
            }}
            responseExample={{
              access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              token_type: "Bearer",
              expires_in: 3600,
              refresh_token: "def50200641f3e1...",
            }}
            notes="The access token is valid for the specified number of seconds (expires_in). You should refresh the token before it expires."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Using the Access Token</h3>
        <p className="mt-2 text-gray-600">Include the access token in the Authorization header of all API requests:</p>

        <pre className="mt-4 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
          {`// Example: Including the access token in a fetch request
fetch('${API_CONFIG.baseUrl}/prefweb/api/v1/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  body: JSON.stringify({
    ModelCode: '1_vent_1rail_OG',
    IsPersistable: true
  })
})`}
        </pre>

        <div className="mt-6 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Lock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Security Best Practices</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Store API credentials securely and never expose them in client-side code</li>
                  <li>Implement token refresh logic to maintain uninterrupted access</li>
                  <li>Use HTTPS for all API requests to ensure data is encrypted in transit</li>
                  <li>Implement proper error handling for authentication failures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
