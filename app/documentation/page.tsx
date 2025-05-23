"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Code, ImageIcon, Layers, Package, RefreshCw, Database, Settings } from "lucide-react"

export default function DocumentationPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<string>("overview")

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-xl font-bold text-gray-900">API Documentation</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <nav className="space-y-1">
                  <NavItem
                    icon={<Package className="h-4 w-4" />}
                    title="Overview"
                    active={activeSection === "overview"}
                    onClick={() => setActiveSection("overview")}
                  />
                  {/*<NavItem
                    icon={<Key className="h-4 w-4" />}
                    title="Authentication"
                    active={activeSection === "authentication"}
                    onClick={() => setActiveSection("authentication")}
                  />*/}
                  <NavItem
                    icon={<Database className="h-4 w-4" />}
                    title="Models"
                    active={activeSection === "models"}
                    onClick={() => setActiveSection("models")}
                  />
                  <NavItem
                    icon={<Settings className="h-4 w-4" />}
                    title="Configuration"
                    active={activeSection === "configuration"}
                    onClick={() => setActiveSection("configuration")}
                  />
                  <NavItem
                    icon={<Layers className="h-4 w-4" />}
                    title="Dimensions"
                    active={activeSection === "dimensions"}
                    onClick={() => setActiveSection("dimensions")}
                  />
                  <NavItem
                    icon={<ImageIcon className="h-4 w-4" />}
                    title="Visualizations"
                    active={activeSection === "visualizations"}
                    onClick={() => setActiveSection("visualizations")}
                  />
                  <NavItem
                    icon={<RefreshCw className="h-4 w-4" />}
                    title="Integration Flow"
                    active={activeSection === "integration"}
                    onClick={() => setActiveSection("integration")}
                  />
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-8">
              {activeSection === "overview" && <OverviewSection />}
              {/*activeSection === "authentication" && <AuthenticationSection />*/}
              {activeSection === "models" && <ModelsSection />}
              {activeSection === "configuration" && <ConfigurationSection />}
              {activeSection === "dimensions" && <DimensionsSection />}
              {activeSection === "visualizations" && <VisualizationsSection />}
              {activeSection === "integration" && <IntegrationSection />}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">© 2025 Window Configurator API Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavItem({
  icon,
  title,
  active,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
        active ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className={`mr-2 ${active ? "text-orange-500" : "text-gray-500"}`}>{icon}</span>
      {title}
    </button>
  )
}

function EndpointCard({
  method,
  endpoint,
  description,
  requestBody = null,
  responseExample = null,
  notes = null,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE"
  endpoint: string
  description: string
  requestBody?: any
  responseExample?: any
  notes?: string
}) {
  const [expanded, setExpanded] = useState(false)

  const methodColors = {
    GET: "bg-blue-100 text-blue-800",
    POST: "bg-green-100 text-green-800",
    PUT: "bg-yellow-100 text-yellow-800",
    DELETE: "bg-red-100 text-red-800",
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-start p-4">
        <div className={`rounded px-2.5 py-1 text-xs font-bold ${methodColors[method]}`}>{method}</div>
        <div className="ml-3 flex-1">
          <div className="font-mono text-sm">{endpoint}</div>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="text-xs">
          {expanded ? "Hide Details" : "Show Details"}
        </Button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          {requestBody && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-semibold text-gray-500">REQUEST BODY</h4>
              <pre className="rounded bg-gray-900 p-3 text-xs text-white overflow-auto max-h-60">
                {JSON.stringify(requestBody, null, 2)}
              </pre>
            </div>
          )}

          {responseExample && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-semibold text-gray-500">RESPONSE</h4>
              <pre className="rounded bg-gray-900 p-3 text-xs text-white overflow-auto max-h-60">
                {JSON.stringify(responseExample, null, 2)}
              </pre>
            </div>
          )}

          {notes && (
            <div>
              <h4 className="mb-2 text-xs font-semibold text-gray-500">NOTES</h4>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Window Configurator API</h2>
        <p className="mt-2 text-gray-600">
          This documentation provides a comprehensive guide for creating your own Web Configurator using Preference's
          APIs. The API enables you to create, configure, and visualize your models for seamless integration into your
          sales process.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">API Structure</h3>
        <p className="mt-2 text-gray-600">
          The Window Configurator API is organized around the following key resources:
        </p>

        <ul className="mt-4 space-y-3">
          {/*<li className="flex">
            <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Key className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-medium text-gray-900">Authentication</span>
              <p className="text-sm text-gray-600">Secure access to the API using token-based authentication</p>
            </div>
          </li>*/}
          <li className="flex">
            <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Database className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-medium text-gray-900">Models</span>
              <p className="text-sm text-gray-600">Create and manage window models</p>
            </div>
          </li>
          <li className="flex">
            <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Settings className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-medium text-gray-900">Configuration</span>
              <p className="text-sm text-gray-600">Customize model properties and options</p>
            </div>
          </li>
          <li className="flex">
            <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-medium text-gray-900">Dimensions</span>
              <p className="text-sm text-gray-600">Manage window dimensions</p>
            </div>
          </li>
          <li className="flex">
            <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <ImageIcon className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-medium text-gray-900">Visualizations</span>
              <p className="text-sm text-gray-600">Generate 2D and 3D visualizations of configured windows</p>
            </div>
          </li>
        </ul>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Getting Started</h3>
        <p className="mt-2 text-gray-600">To integrate Preference's API tools into your platform, follow this guide:</p>

        <ol className="mt-4 list-decimal pl-5 space-y-2 text-gray-600">
          <li>Authenticate with the API to obtain an access token</li>
          <li>Fetch available window model codes</li>
          <li>Create a model instance with your selected model code</li>
          <li>Fetch configuration options for the model</li>
          <li>Update configuration options based on user selections</li>
          <li>Manage dimensions if needed</li>
          <li>Generate visualizations of the configured window</li>
          <li>Save the configuration for order processing</li>
        </ol>

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExternalLink className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Base URL</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>All API endpoints are relative to the base URL:</p>
                <code className="mt-1 block rounded bg-blue-100 px-2 py-1 font-mono text-blue-800">
                  https://your-domain.com/api
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthenticationSection() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
        <p className="mt-2 text-gray-600">
          The Window Configurator API uses token-based authentication. You need to obtain an access token before making
          any API calls.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Authentication Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Request an access token using your API credentials</li>
            <li>Include the access token in the Authorization header of all subsequent requests</li>
            <li>The token expires after a certain period (typically 1 hour)</li>
            <li>Request a new token when the current one expires</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="GET"
            endpoint="/auth"
            description="Get an access token for API authentication"
            responseExample={{
              accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              expiresIn: 3600,
            }}
            notes="The token is valid for the number of seconds specified in expiresIn. Store this token and use it for all subsequent API requests."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Using the Token</h3>
        <p className="mt-2 text-gray-600">Include the access token in the Authorization header of all API requests:</p>

        <pre className="mt-4 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
          {`// Example API request with authentication
fetch('/api/models/codes', {
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
        </pre>

        <div className="mt-6 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Code className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Implementation Note</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  In this demo application, the authentication is handled automatically by the backend proxy. Your
                  implementation should manage token expiration and refresh logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModelsSection() {
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

function ConfigurationSection() {
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
            endpoint="/configurator"
            description="Get the configuration options for a model"
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
            method="PUT"
            endpoint="/configurator/update"
            description="Update configuration options"
            requestBody={{
              name: "window_configuration",
              options: [
                {
                  maker: "preference",
                  code: "preference~OUTER_COLOR",
                  type: "Color",
                  description: "",
                  valueString: "preference~7016",
                  valueNumeric: 0,
                  hidden: false,
                  values: [{ valueString: "preference~9010" }, { valueString: "preference~7016" }],
                },
              ],
            }}
            responseExample={{
              Name: "window_configuration",
              Options: [
                // Updated options with dependencies resolved
              ],
            }}
            notes="When updating an option, the response includes the complete updated configuration. Some options may have changed due to dependencies."
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

function DimensionsSection() {
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

function VisualizationsSection() {
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
  for (let i = 0; <binaryString className="length"></binaryString>; i++) {
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

function IntegrationSection() {
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
              <strong className="text-gray-900">Authentication</strong>
              <p className="mt-1 text-sm">Get an access token using your API credentials</p>
              <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">GET /api/auth</pre>
            </li>

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
              <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">GET /api/configurator</pre>
              <p className="mt-1 text-sm text-gray-600">Organize options by tab and section in your UI</p>
            </li>

            <li>
              <strong className="text-gray-900">Fetch Initial Dimensions</strong>
              <p className="mt-1 text-sm">Get the current dimensions for the model</p>
              <pre className="mt-2 rounded bg-gray-800 p-2 text-xs text-white overflow-auto">
                GET /api/models/{"guid"}/dimensions
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
                    {`PUT /api/configurator/update
                  {
                    "name": "window_configuration",
                    "options": [...]
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
