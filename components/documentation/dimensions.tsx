import { Ruler } from "lucide-react"
import { EndpointCard } from "./endpoint-card"
import { API_CONFIG } from "@/lib/api/constants"

export function Dimensions() {
  // Create a well-formatted XML command for the example
  const xmlCommand = `<Commands>
  <cmd:Command name='Model.SetDimension' xmlns:cmd='http://www.preference.com/XMLSchemas/2006/PrefCAD.Command'>
    <cmd:Parameter name='name' type='string' value='WIDTH' />
    <cmd:Parameter name='value' type='double' value='1200' />
    <cmd:Parameter name='regenerate' type='bool' value='1' />
  </cmd:Command>
</Commands>`

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Dimensions</h2>
        <p className="mt-2 text-gray-600">
          The Dimensions API allows you to fetch and update the dimensions of a window model.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Dimensions Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Fetch the available dimensions for a model</li>
            <li>Present dimension controls to the user</li>
            <li>When the user changes a dimension, update the model</li>
            <li>Regenerate the model to reflect the new dimensions</li>
            <li>Update visualizations to show the resized model</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="POST"
            endpoint={`${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/{itemId}/ExecuteCommand`}
            description="Get dimensions for a model"
            requestBody={{
              command:
                "<Commands><cmd:Command name='Model.GetDimensions' xmlns:cmd='http://www.preference.com/XMLSchemas/2006/PrefCAD.Command'></cmd:Command></Commands>",
            }}
            responseExample={{
              result:
                "<Dimensions><Dimension Name='WIDTH' Value='1000' Min='600' Max='2000' Step='1' Unit='mm' /><Dimension Name='HEIGHT' Value='1200' Min='800' Max='2400' Step='1' Unit='mm' /></Dimensions>",
            }}
            notes="The response contains an XML string with all available dimensions, their current values, and constraints (min, max, step)."
          />

          <EndpointCard
            method="POST"
            endpoint={`${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/{itemId}/ExecuteCommand`}
            description="Update a dimension"
            requestBody={{
              command: xmlCommand,
            }}
            responseExample={{
              success: true,
              message: "Dimension updated successfully",
            }}
            notes="When updating a dimension, set regenerate=1 to recalculate the model with the new dimensions. This is necessary before generating new visualizations."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Dimension Structure</h3>
        <p className="mt-2 text-gray-600">Dimensions have the following structure:</p>

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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Name</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Dimension identifier (e.g., WIDTH, HEIGHT)
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Value</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Current dimension value</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Minimum allowed value</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Max</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maximum allowed value</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Step</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Increment step (for UI controls)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Unit</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Measurement unit (e.g., mm, cm)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Ruler className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Implementation Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create UI controls that respect the min, max, and step values</li>
                  <li>Display dimensions in the specified unit</li>
                  <li>Consider adding validation to prevent users from entering invalid dimensions</li>
                  <li>After updating dimensions, regenerate visualizations to show the updated model</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
