import { Layers } from "lucide-react"
import { EndpointCard } from "./endpoint-card"

export function Dimensions() {
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
            <li>Fetch the current dimensions for a model</li>
            <li>Present dimension controls to the user</li>
            <li>When the user changes a dimension, update it</li>
            <li>Refresh visualizations to reflect the new dimensions</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="GET"
            endpoint="/models/{guid}/dimensions"
            description="Get the dimensions for a specific model"
            responseExample={{
              dimensions: {
                L: 2500,
                L1: 861.17,
                L2: 777.67,
                A: 2500,
                A1: 1250,
                A2: 1250,
              },
            }}
            notes="Dimensions are returned as key-value pairs. Single-letter dimensions (L, A) are typically total dimensions, while numbered dimensions (L1, L2) are sub-dimensions."
          />

          <EndpointCard
            method="POST"
            endpoint="/models/{guid}/dimensions"
            description="Update a dimension value"
            requestBody={{
              name: "L",
              value: 2800,
            }}
            responseExample={{
              success: true,
              dimensions: {
                L: 2800,
                L1: 965.51,
                L2: 871.99,
                A: 2500,
                A1: 1250,
                A2: 1250,
              },
            }}
            notes="When updating a dimension, the response includes all dimensions. Some sub-dimensions may be automatically adjusted."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Dimension Structure</h3>
        <p className="mt-2 text-gray-600">Window dimensions follow a hierarchical structure:</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimension Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Dimension</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Single letter (L, A, H)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Overall dimensions of the window</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sub-dimension</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Letter + number (L1, L2, A1)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Component dimensions within the total
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Layers className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Implementation Notes</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>When implementing dimension controls:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Group dimensions by their letter prefix (L, A, H)</li>
                  <li>Allow editing of total dimensions (L, A, H)</li>
                  <li>Display sub-dimensions (L1, L2) as read-only or with limited editing</li>
                  <li>Validate dimension values against min/max constraints</li>
                  <li>Refresh visualizations after dimension changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
