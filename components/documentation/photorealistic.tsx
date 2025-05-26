import { ImageIcon } from "lucide-react"
import { EndpointCard } from "./endpoint-card"
import { API_CONFIG } from "@/lib/api/constants"

export function Photorealistic() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Photorealistic Rendering</h2>
        <p className="mt-2 text-gray-600">
          The Photorealistic Rendering API allows you to generate high-quality, photorealistic images of configured
          window models.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Rendering Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Configure the window model with desired options and dimensions</li>
            <li>Create a USD service session for the configured model</li>
            <li>Request photorealistic images from different angles</li>
            <li>Display the images to the user</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="POST"
            endpoint={`${API_CONFIG.usdServiceUrl}/usd-service/v1/Session/New`}
            description="Create a new USD service session"
            requestBody={{
              system: API_CONFIG.system,
              itemId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            }}
            responseExample={{
              sessionId: "session-12345",
              status: "ready",
            }}
            notes="Create a session before requesting photorealistic images. The session ID is used in subsequent requests."
          />

          <EndpointCard
            method="GET"
            endpoint={`${API_CONFIG.usdServiceUrl}/usd-service/v1/Images?sessionId={sessionId}`}
            description="Generate photorealistic images"
            responseExample={{
              images: [
                {
                  url: "http://example.com/images/view1.png",
                  angle: "front",
                },
                {
                  url: "http://example.com/images/view2.png",
                  angle: "perspective",
                },
              ],
            }}
            notes="The response contains URLs to photorealistic PNG images from different angles."
          />

          <EndpointCard
            method="DELETE"
            endpoint={`${API_CONFIG.usdServiceUrl}/usd-service/v1/Session/{sessionId}`}
            description="Delete a USD service session"
            responseExample={{
              success: true,
              message: "Session deleted successfully",
            }}
            notes="Delete the session when you're done to free up server resources."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Image Quality Options</h3>
        <p className="mt-2 text-gray-600">
          You can control the quality and size of the generated images by adding query parameters:
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">width</td>
                <td className="px-6 py-4 text-sm text-gray-500">Image width in pixels</td>
                <td className="px-6 py-4 text-sm text-gray-500">1024</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">height</td>
                <td className="px-6 py-4 text-sm text-gray-500">Image height in pixels</td>
                <td className="px-6 py-4 text-sm text-gray-500">768</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">quality</td>
                <td className="px-6 py-4 text-sm text-gray-500">Rendering quality (low, medium, high)</td>
                <td className="px-6 py-4 text-sm text-gray-500">medium</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">background</td>
                <td className="px-6 py-4 text-sm text-gray-500">Background type (transparent, white, environment)</td>
                <td className="px-6 py-4 text-sm text-gray-500">environment</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ImageIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Implementation Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cache rendered images to reduce API calls and improve performance</li>
                  <li>Use lower quality settings for thumbnails and higher quality for detailed product views</li>
                  <li>
                    Consider using a transparent background if you need to composite the images with other elements
                  </li>
                  <li>
                    Always delete sessions when you're done to free up server resources and avoid hitting session limits
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
