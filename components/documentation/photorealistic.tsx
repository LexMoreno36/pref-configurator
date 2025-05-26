import { ImageIcon } from "lucide-react"
import { EndpointCard } from "./endpoint-card"

export function Photorealistic() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Photorealistic Rendering</h2>
        <p className="mt-2 text-gray-600">
          The Photorealistic Rendering API allows you to generate high-quality, realistic images of configured window
          models.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Rendering Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Create a new rendering session</li>
            <li>Request images for a specific model GUID</li>
            <li>Receive URLs to the generated images</li>
            <li>Display the images to the user</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="POST"
            endpoint="/usd-service/v1/Session/New"
            description="Create a new rendering session"
            responseExample={{
              session_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            }}
            notes="The session ID is required for all subsequent rendering requests. Sessions have a limited lifespan and may expire after a period of inactivity."
          />

          <EndpointCard
            method="POST"
            endpoint="/usd-service/v1/Images"
            description="Generate photorealistic images of a configured model"
            requestBody={{
              models: [
                {
                  filePathsOrGuids: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                  maker: "Reynaers",
                  system: "MasterPatio",
                  generateWall: true,
                },
              ],
              quality: ["low"],
              resolution: ["2K"],
              cameras: ["Camera_Inner_01", "Camera_Outer_01"],
            }}
            responseExample={{
              captured_image_path: [
                "http://example.com/images/inner_view.png",
                "http://example.com/images/outer_view.png",
              ],
            }}
            notes="The response contains an array of URLs to the generated images. The 'cameras' parameter determines which views are generated."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Camera Views</h3>
        <p className="mt-2 text-gray-600">
          The API supports multiple camera views for rendering different perspectives of the window:
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Camera Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Camera_Inner_01</td>
                <td className="px-6 py-4 text-sm text-gray-500">Interior view of the window</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Camera_Outer_01</td>
                <td className="px-6 py-4 text-sm text-gray-500">Exterior view of the window</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Quality and Resolution</h3>
        <p className="mt-2 text-gray-600">
          The API supports different quality levels and resolutions for the rendered images:
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">quality</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">["low", "medium", "high"]</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Rendering quality (affects lighting, shadows, and detail)
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">resolution</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">["HD", "2K", "4K"]</td>
                <td className="px-6 py-4 text-sm text-gray-500">Image resolution (affects image dimensions)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ImageIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Implementation Tips</h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Start with lower quality and resolution during development to reduce rendering time</li>
                  <li>Cache rendered images when possible to avoid unnecessary rendering requests</li>
                  <li>
                    Implement a loading state while images are being rendered, as high-quality rendering can take time
                  </li>
                  <li>
                    Consider offering users a choice between quick preview (SVG/GLTF) and photorealistic rendering
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
