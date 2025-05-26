import { Settings } from "lucide-react"
import { EndpointCard } from "./endpoint-card"

export function Configuration() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
        <p className="mt-2 text-gray-600">
          The Configuration API allows you to fetch and update configuration options for a window model.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Configuration Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Fetch the initial configuration options for a model</li>
            <li>Present options to the user organized by tabs and sections</li>
            <li>When the user changes an option, update the configuration</li>
            <li>The update may affect other options (dependencies)</li>
            <li>Refresh the UI with the updated configuration</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="GET"
            endpoint="/configurator/{modelId}"
            description="Get the configuration options for a specific model"
            responseExample={{
              Name: "window_configuration",
              Options: [
                {
                  Order: 1,
                  Tab: "Appearance",
                  Section: "Colors",
                  Widget: "ColorPicker",
                  Maker: "preference",
                  Code: "preference~OUTER_COLOR",
                  Type: "Color",
                  Description: "",
                  ValueString: "preference~9010",
                  ValueNumeric: 0,
                  Hidden: false,
                  Values: [{ ValueString: "preference~9010" }, { ValueString: "preference~7016" }],
                },
              ],
            }}
            notes="The response contains all available configuration options organized by tabs and sections. Each option includes its current value and possible values."
          />

          <EndpointCard
            method="POST"
            endpoint="/models/{guid}/options"
            description="Update a configuration option"
            requestBody={{
              name: "preference~OUTER_COLOR",
              value: "preference~7016",
            }}
            responseExample={{
              success: true,
              message: "Option preference~OUTER_COLOR updated to preference~7016",
            }}
            notes="When updating an option, the response indicates success. You should then refresh the configuration to see any dependent changes."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Option Structure</h3>
        <p className="mt-2 text-gray-600">Configuration options have the following structure:</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tab</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">The tab where this option appears</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Section</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">The section within the tab</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Widget</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  The UI widget type (Checkbox, Dropdown, ColorPicker, etc.)
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Code</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Unique identifier for the option</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ValueString</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Current selected value</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Values</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Array of possible values</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Frontend Responsibilities</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your frontend application should:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Organize options by Tab and Section</li>
                  <li>Render the appropriate widget based on the Widget type</li>
                  <li>Track the current selected values</li>
                  <li>Update the UI when options change due to dependencies</li>
                  <li>Handle special widget types like ColorPicker with appropriate UI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
