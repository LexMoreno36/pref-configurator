import { ExternalLink, Database, Settings, Layers, ImageIcon } from "lucide-react"
import { API_CONFIG } from "@/lib/api/constants"

export function Overview() {
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
                  {API_CONFIG.baseUrl}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
