import { Settings, AlertTriangle } from "lucide-react"
import { EndpointCard } from "./endpoint-card"
import { API_CONFIG } from "@/lib/api/constants"

export function Configuration() {
  // Create a well-formatted XML command for the example
  const xmlCommand = `<Commands>
  <cmd:Command name='Model.SetOptionValue' xmlns:cmd='http://www.preference.com/XMLSchemas/2006/PrefCAD.Command'>
    <cmd:Parameter name='name' type='string' value='${API_CONFIG.makerPrefix}INNER_COLOR' />
    <cmd:Parameter name='value' type='string' value='${API_CONFIG.makerPrefix}45_9T10' />
    <cmd:Parameter name='regenerate' type='bool' value='0' />
    <cmd:Parameter name='sendEvents' type='bool' value='1' />
    <cmd:Parameter name='applyAllBinded' type='bool' value='1' />
  </cmd:Command>
</Commands>`

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
        <p className="mt-2 text-gray-600">
          The Configuration API allows you to fetch and update configuration options for a window model.
        </p>

        {/* Maker-specific prefix notification */}
        <div className="mt-4 rounded-md bg-amber-50 p-4 border border-amber-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Important: Maker-Specific Prefixes</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  When executing commands to update options, you must prefix both option names and values with the
                  maker-specific prefix:
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>
                    For <strong>Reynaers</strong>, the prefix is{" "}
                    <code className="bg-amber-100 px-1 rounded">{API_CONFIG.makerPrefix}</code> (e.g.,{" "}
                    <code className="bg-amber-100 px-1 rounded">{API_CONFIG.makerPrefix}INNER_COLOR</code>)
                  </li>
                  <li>Different makers will have different prefixes</li>
                  <li>
                    The prefix is defined in your configuration as{" "}
                    <code className="bg-amber-100 px-1 rounded">makerPrefix</code>
                  </li>
                  <li>Always apply the prefix to both the option name and value in your commands</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

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
            endpoint={`${API_CONFIG.baseUrl}/Cloud.ModelService/api/v1/Options/model?modelId={modelId}`}
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
            endpoint={`${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/{itemId}/ExecuteCommand`}
            description="Update a configuration option"
            requestBody={{
              command: xmlCommand,
            }}
            responseExample={{
              success: true,
              message: "Option updated successfully",
            }}
            notes={`When updating an option, remember to prefix both the option name and value with the maker-specific prefix (${API_CONFIG.makerPrefix} for Reynaers). The response indicates success. You should then refresh the configuration to see any dependent changes.`}
          />

          <EndpointCard
            method="POST"
            endpoint={`${API_CONFIG.baseUrl}/KB.UIConfigurator.Service/api/v1/makers/${API_CONFIG.maker}/process-options/${API_CONFIG.uiDefinitionName}`}
            description="Process options to get UI definition"
            requestBody={{
              options: [
                {
                  Code: `${API_CONFIG.makerPrefix}INNER_COLOR`,
                  ValueString: `${API_CONFIG.makerPrefix}45_9T10`,
                  Type: "Color",
                },
              ],
            }}
            responseExample={{
              tabs: [
                {
                  name: "Appearance",
                  sections: [
                    {
                      name: "Colors",
                      options: [
                        {
                          code: `${API_CONFIG.makerPrefix}INNER_COLOR`,
                          widget: "ColorPicker",
                          values: ["9010", "7016", "45_9T10"],
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
            notes={`This endpoint processes the raw options and returns a UI-friendly structure with tabs, sections, and widgets for the ${API_CONFIG.makerCapitalized} maker. Remember to use the maker-specific prefix (${API_CONFIG.makerPrefix}) for option codes and values.`}
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

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Maker-Specific Configuration</h3>
        <p className="mt-2 text-gray-600">
          Different window manufacturers (makers) have different prefixes and configurations. Here's how to handle them:
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prefix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Example
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Reynaers</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RY_</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RY_INNER_COLOR</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Other Maker</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">XX_</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">XX_INNER_COLOR</td>
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
                  <li>
                    <strong>Apply the correct maker-specific prefix</strong> when sending option updates
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
