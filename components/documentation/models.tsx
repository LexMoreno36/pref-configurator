import { Database } from "lucide-react"
import { EndpointCard } from "./endpoint-card"

export function Models() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Models</h2>
        <p className="mt-2 text-gray-600">
          The Models API allows you to fetch available window model codes and create model instances for configuration.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Model Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Fetch available model codes to present to the user</li>
            <li>Create a model instance with the selected model code</li>
            <li>Use the returned GUID for all subsequent operations on this model</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="GET"
            endpoint="/models/codes"
            description="Get a list of available window model codes"
            responseExample={{
              modelCodes: ["1_vent_1rail_OG", "2_vent_2rail_OG", "corner_window_90"],
            }}
            notes="These model codes represent the different window types available for configuration."
          />

          <EndpointCard
            method="POST"
            endpoint="/models"
            description="Create a new model instance"
            requestBody={{
              modelCode: "1_vent_1rail_OG",
            }}
            responseExample={{
              guid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              modelCode: "1_vent_1rail_OG",
            }}
            notes="The returned GUID is used to identify this specific model instance in all subsequent API calls. Store this GUID for the duration of the configuration session."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Model Lifecycle</h3>
        <p className="mt-2 text-gray-600">
          Each model instance has its own state and configuration. The model GUID is the key to accessing and modifying
          this state.
        </p>

        <div className="mt-4 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Database className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Implementation Note</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>In an e-commerce integration, you should:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Store the model GUID in the user's session or shopping cart</li>
                  <li>Associate the GUID with the order when the user proceeds to checkout</li>
                  <li>Include the GUID in order details for manufacturing reference</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
