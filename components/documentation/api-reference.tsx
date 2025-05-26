"use client"

import { Code, Copy, Check } from "lucide-react"
import { useState } from "react"
import { API_CONFIG } from "@/lib/api/constants"

export function ApiReference() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">API Reference</h2>
        <p className="mt-2 text-gray-600">
          This section provides a detailed reference of all available API endpoints, their parameters, and response
          formats.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Base URLs</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Main API</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <code className="bg-gray-100 px-1 py-0.5 rounded">{API_CONFIG.baseUrl}</code>
                    <button
                      onClick={() => copyToClipboard(API_CONFIG.baseUrl, "main")}
                      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      title="Copy URL"
                    >
                      {copied === "main" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Base URL for most API endpoints</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PrefWeb</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <code className="bg-gray-100 px-1 py-0.5 rounded">{API_CONFIG.pwbBaseUrl}</code>
                    <button
                      onClick={() => copyToClipboard(API_CONFIG.pwbBaseUrl, "prefweb")}
                      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      title="Copy URL"
                    >
                      {copied === "prefweb" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Base URL for authentication, item creation, and image generation
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">USD Service</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <code className="bg-gray-100 px-1 py-0.5 rounded">{API_CONFIG.usdServiceUrl}</code>
                    <button
                      onClick={() => copyToClipboard(API_CONFIG.usdServiceUrl, "usd")}
                      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      title="Copy URL"
                    >
                      {copied === "usd" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Base URL for photorealistic rendering service</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cloud Model Service</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <code className="bg-gray-100 px-1 py-0.5 rounded">{API_CONFIG.cloudModelServiceUrl}</code>
                    <button
                      onClick={() => copyToClipboard(API_CONFIG.cloudModelServiceUrl, "cloud")}
                      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      title="Copy URL"
                    >
                      {copied === "cloud" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Base URL for cloud model services</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Authentication</h3>
        <p className="mt-2 text-gray-600">
          Most endpoints require authentication. See the Authentication section for details.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Error Handling</h3>
        <p className="mt-2 text-gray-600">The API returns standard HTTP status codes to indicate success or failure:</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">200 OK</td>
                <td className="px-6 py-4 text-sm text-gray-500">The request was successful</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">400 Bad Request</td>
                <td className="px-6 py-4 text-sm text-gray-500">The request was invalid or cannot be served</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">401 Unauthorized</td>
                <td className="px-6 py-4 text-sm text-gray-500">Authentication failed or token is invalid</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">404 Not Found</td>
                <td className="px-6 py-4 text-sm text-gray-500">The requested resource could not be found</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">500 Server Error</td>
                <td className="px-6 py-4 text-sm text-gray-500">An error occurred on the server</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Option Types</h3>
        <p className="mt-2 text-gray-600">
          The API uses different option types to represent different kinds of configuration options:
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UI Widget
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0</td>
                <td className="px-6 py-4 text-sm text-gray-500">String option</td>
                <td className="px-6 py-4 text-sm text-gray-500">Dropdown, Radio buttons</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
                <td className="px-6 py-4 text-sm text-gray-500">Component option</td>
                <td className="px-6 py-4 text-sm text-gray-500">Dropdown with component selection</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
                <td className="px-6 py-4 text-sm text-gray-500">Color option</td>
                <td className="px-6 py-4 text-sm text-gray-500">Color picker</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">6</td>
                <td className="px-6 py-4 text-sm text-gray-500">Numeric option</td>
                <td className="px-6 py-4 text-sm text-gray-500">Number input, Slider</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Code className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">API Versioning</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The API uses versioning in the URL path (e.g., <code>/api/v1/</code>). Always check that you're using
                  the correct API version for your integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
