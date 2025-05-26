import { RefreshCw } from "lucide-react"

export function Integration() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Integration Flow</h2>
        <p className="mt-2 text-gray-600">
          This section outlines the complete flow for integrating the Window Configurator into your e-commerce platform.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Complete Integration Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-4 text-gray-700">
            <li>
              <strong className="text-gray-900">Fetch Available Models</strong>
              <p className="mt-1 text-sm">Get a list of available window model codes to present to the user</p>
              <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">GET /api/models/codes</pre>
            </li>

            <li>
              <strong className="text-gray-900">Create Model Instance</strong>
              <p className="mt-1 text-sm">Create a model instance with the selected model code</p>
              <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">
                {`POST /api/models
                {
                  "modelCode\": \"1_vent_1rail_OG"
                }`}
              </pre>
              <p className="mt-1 text-sm text-gray-600">Store the returned GUID for all subsequent operations</p>
            </li>

            <li>
              <strong className="text-gray-900">Fetch Configuration Options</strong>
              <p className="mt-1 text-sm">Get the configuration options for the model</p>
              <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">
                GET /api/configurator/{"{guid}"}
              </pre>
              <p className="mt-1 text-sm text-gray-600">Organize options by tab and section in your UI</p>
            </li>

            <li>
              <strong className="text-gray-900">Fetch Initial Dimensions</strong>
              <p className="mt-1 text-sm">Get the current dimensions for the model</p>
              <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">
                GET /api/models/{"{guid}"}/dimensions
              </pre>
            </li>

            <li>
              <strong className="text-gray-900">Generate Initial Visualization</strong>
              <p className="mt-1 text-sm">Generate a visualization of the model</p>
              <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">
                {`POST /api/models/${"{guid}"}/images
                {
                  "imageType": 5,  // use 11 for 3D
                  "width": 800,
                  "height": 600
                }`}
              </pre>
            </li>

            <li>
              <strong className="text-gray-900">User Configuration Loop</strong>
              <p className="mt-1 text-sm">As the user makes changes:</p>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Update Configuration Options</strong>
                  <pre className="mt-1 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">
                    {`POST /api/models/${"{guid}"}/options
                    {
                      "name": "preference~OUTER_COLOR",
                      "value": "preference~7016"
                    }`}
                  </pre>
                </li>

                <li>
                  <strong>Update Dimensions (if changed)</strong>
                  <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">
                    {`POST /api/models/${"{guid}"}/dimensions
                    {
                      "name": "L",
                      "value": 2800
                    }`}
                  </pre>
                </li>

                <li>
                  <strong>Regenerate Visualization</strong>
                  <pre className="mt-1 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">
                    {`POST /api/models/${"{guid}"}/images
                    {
                      "imageType": 5,  // or 11 for 3D
                      "width": 800,
                      "height": 600
                    }`}
                  </pre>
                </li>
              </ul>
            </li>

            <li>
              <strong className="text-gray-900">Save Configuration</strong>
              <p className="mt-1 text-sm">When the user is satisfied with their configuration:</p>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-sm">
                <li>Store the model GUID and configuration details in your e-commerce system</li>
                <li>Associate the configuration with the user's order</li>
                <li>Include configuration details in order confirmation</li>
              </ul>
            </li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">E-commerce Integration Points</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-commerce Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Integration Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Implementation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Product Listing</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Display available window models</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Use model codes from <code>/api/models/codes</code> to create product listings
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Product Detail</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Embed configurator</td>
                <td className="px-6 py-4 text-sm text-gray-500">Create model instance and embed configurator UI</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Shopping Cart</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Store configuration</td>
                <td className="px-6 py-4 text-sm text-gray-500">Store model GUID and configuration summary</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Checkout</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Include configuration details</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Include model GUID and configuration in order details
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Order Confirmation</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Display configuration summary</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Generate final visualization and configuration summary
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Best Practices</h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Implement proper error handling for all API calls</li>
                  <li>Cache configuration options and visualizations where appropriate</li>
                  <li>Provide clear feedback to users during configuration</li>
                  <li>Save configuration progress periodically</li>
                  <li>Include configuration details in order processing systems</li>
                  <li>Consider implementing a configuration sharing feature</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
