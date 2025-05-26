import { ImageIcon } from "lucide-react"
import { EndpointCard } from "./endpoint-card"

export function Visualizations() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Visualizations</h2>
        <p className="mt-2 text-gray-600">
          The Visualizations API allows you to generate 2D and 3D representations of configured window models.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Visualization Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Configure the window model with desired options and dimensions</li>
            <li>Request a visualization (SVG for 2D or GLTF for 3D)</li>
            <li>Display the visualization to the user</li>
            <li>Regenerate visualizations when configuration changes</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="POST"
            endpoint="/models/{guid}/images"
            description="Generate a visualization of the configured model"
            requestBody={{
              imageType: 5, // 5 for SVG, 11 for GLTF (3D)
              width: 800,
              height: 600,
            }}
            responseExample={{
              base64: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIj4...",
            }}
            notes="The response contains a base64-encoded representation of the visualization. For SVG, this is a UTF-16 encoded SVG string. For GLTF, this is a binary GLTF model."
          />

          <EndpointCard
            method="POST"
            endpoint="/png-images"
            description="Generate photorealistic PNG images of the configured model"
            requestBody={{
              guid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            }}
            responseExample={{
              images: ["http://example.com/images/view1.png", "http://example.com/images/view2.png"],
            }}
            notes="The response contains an array of URLs to photorealistic PNG images of the configured model from different angles."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Visualization Types</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  imageType Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Use Case
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2D SVG</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SVG (XML)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Technical drawings, dimensions</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3D Model</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">11</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GLTF/GLB</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Interactive 3D preview</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PNG Image</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PNG</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Static images for thumbnails</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Processing Visualizations</h3>
        <p className="mt-2 text-gray-600">The visualization data requires specific processing:</p>

        <pre className="mt-4 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
          {`// Example: Processing SVG visualization
function processSvgResponseToString(encodedSvg) {
  // Remove quotes if they exist
  let cleanBase64 = encodedSvg;
  if (cleanBase64.startsWith('"') && cleanBase64.endsWith('"')) {
    cleanBase64 = cleanBase64.slice(1, -1);
  }

  // Decode base64 to binary data
  const binaryString = atob(cleanBase64);

  // Convert binary data to Uint8Array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Decode as UTF-16LE (Little Endian)
  const decoder = new TextDecoder("utf-16le");
  const svgString = decoder.decode(bytes);

  return svgString;
}`}
        </pre>

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ImageIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Implementation Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cache visualizations to reduce API calls</li>
                  <li>Regenerate visualizations when configuration changes</li>
                  <li>For 3D models, use a WebGL library like BabylonJS or Three.js</li>
                  <li>For SVG, you can directly insert the processed SVG into the DOM</li>
                  <li>Consider generating lower-resolution thumbnails for product listings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
