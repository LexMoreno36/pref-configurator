import { Key } from "lucide-react"
import { EndpointCard } from "./endpoint-card"

export function Authentication() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
        <p className="mt-2 text-gray-600">
          The Window Configurator API uses OAuth 2.0 for authentication. You need to obtain an access token before
          making any API calls.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Authentication Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Request an access token using your API credentials</li>
            <li>Include the token in the Authorization header of all subsequent requests</li>
            <li>Monitor token expiration and refresh as needed</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="POST"
            endpoint="/prefweb/token"
            description="Get an OAuth token for authenticating API requests"
            requestBody={{
              grant_type: "password",
              username: "your_api_username",
              password: "your_api_password",
            }}
            responseExample={{
              access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              token_type: "Bearer",
              expires_in: 3600,
              userName: "your_username",
              ".issued": "2024-05-26T12:00:00Z",
              ".expires": "2024-05-26T13:00:00Z",
            }}
            notes="The token is valid for the number of seconds specified in the expires_in field. Store this token and use it for all subsequent API requests."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Using the Token</h3>
        <p className="mt-2 text-gray-600">Include the token in the Authorization header of all API requests:</p>

        <pre className="mt-4 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
          {`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
        </pre>

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Key className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Security Best Practices</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Store API credentials securely and never expose them in client-side code</li>
                  <li>Implement token refresh logic to handle token expiration</li>
                  <li>Use HTTPS for all API communications</li>
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
