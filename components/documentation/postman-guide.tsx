"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, ChevronDown, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function PostmanGuide() {
  const [copied, setCopied] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    setup: true,
    environment: false,
    authentication: false,
    items: false,
    options: false,
    photorealistic: false,
    troubleshooting: false,
  })

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleDownloadCollection = () => {
    const fileUrl = "/ReynaersDemo.postman_collection.json"
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = "ReynaersDemo.postman_collection.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadEnvironment = () => {
    const fileUrl = "/WindowConfigurator.postman_environment.json"
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = "WindowConfigurator.postman_environment.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Postman Collection Guide</h2>
          <p className="text-gray-600 mt-1">
            A practical guide to using the Window Configurator API Postman collection
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleDownloadCollection} className="flex items-center gap-2 whitespace-nowrap">
            <Download className="h-4 w-4" />
            Download Collection
          </Button>
          <Button
            onClick={handleDownloadEnvironment}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="h-4 w-4" />
            Download Environment
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Setup Section */}
        <Collapsible open={openSections.setup} onOpenChange={() => toggleSection("setup")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                1
              </span>
              <h3 className="text-lg font-medium">Setting Up the Collection</h3>
            </div>
            {openSections.setup ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Importing the Collection</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Download the Postman collection using the <span className="font-medium">Download Collection</span>{" "}
                    button above.
                  </li>
                  <li>
                    Open Postman and click on the <span className="font-medium">Import</span> button in the top left.
                  </li>
                  <li>
                    Select <span className="font-medium">File</span> and choose the downloaded{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                      ReynaersDemo.postman_collection.json
                    </code>{" "}
                    file.
                  </li>
                  <li>
                    Click <span className="font-medium">Import</span> to add the collection to your workspace.
                  </li>
                </ol>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Environment Section */}
        <Collapsible open={openSections.environment} onOpenChange={() => toggleSection("environment")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                2
              </span>
              <h3 className="text-lg font-medium">Setting Up the Environment</h3>
            </div>
            {openSections.environment ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Importing the Environment</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Download the Postman environment template using the{" "}
                    <span className="font-medium">Download Environment</span> button above.
                  </li>
                  <li>
                    In Postman, click on the <span className="font-medium">Import</span> button in the top left.
                  </li>
                  <li>
                    Select <span className="font-medium">File</span> and choose the downloaded{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                      WindowConfigurator.postman_environment.json
                    </code>{" "}
                    file.
                  </li>
                  <li>
                    Click <span className="font-medium">Import</span> to add the environment to your workspace.
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">Configuring the Environment</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    In Postman, click on the <span className="font-medium">Environments</span> tab in the left sidebar.
                  </li>
                  <li>
                    Find and click on the <span className="font-medium">Window Configurator API</span> environment.
                  </li>
                  <li>
                    Update the following variables with your actual values:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">api_username</code>: Your API username
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">api_password</code>: Your API password
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">base_url</code>: The base URL for your
                        API (if different from the default)
                      </li>
                    </ul>
                  </li>
                  <li>
                    Click <span className="font-medium">Save</span> to save your changes.
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">Activating the Environment</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>In the top right corner of Postman, click on the environment dropdown.</li>
                  <li>
                    Select <span className="font-medium">Window Configurator API</span> from the list.
                  </li>
                  <li>The environment is now active and will be used for all requests in the collection.</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                <h4 className="text-blue-800 font-medium mb-2">Environment Variables</h4>
                <p className="text-sm text-blue-700">The environment includes the following variables:</p>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Variable
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Default Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">base_url</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Base URL for the API</td>
                        <td className="px-6 py-4 text-sm text-gray-500">https://reydemo.prefnet.net/qa-reynaers</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">api_username</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Your API username</td>
                        <td className="px-6 py-4 text-sm text-gray-500">example@preference.com</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">api_password</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Your API password</td>
                        <td className="px-6 py-4 text-sm text-gray-500">your_secure_password</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">maker</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Manufacturer identifier</td>
                        <td className="px-6 py-4 text-sm text-gray-500">reynaers</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">system</td>
                        <td className="px-6 py-4 text-sm text-gray-500">System identifier</td>
                        <td className="px-6 py-4 text-sm text-gray-500">masterpatio</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ui_definition</td>
                        <td className="px-6 py-4 text-sm text-gray-500">UI definition identifier</td>
                        <td className="px-6 py-4 text-sm text-gray-500">uidefinition</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-blue-700 mt-4">
                  The following variables will be automatically set by the collection scripts during execution:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-blue-700">
                  <li>
                    <code className="bg-blue-100 px-1 py-0.5 rounded text-sm">current_access_token</code> - Set after
                    successful authentication
                  </li>
                  <li>
                    <code className="bg-blue-100 px-1 py-0.5 rounded text-sm">item_id</code> - Set after creating an
                    item
                  </li>
                  <li>
                    <code className="bg-blue-100 px-1 py-0.5 rounded text-sm">pr_session_id</code> - Set after creating
                    a photorealistic rendering session
                  </li>
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Authentication Section */}
        <Collapsible open={openSections.authentication} onOpenChange={() => toggleSection("authentication")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                3
              </span>
              <h3 className="text-lg font-medium">Authentication</h3>
            </div>
            {openSections.authentication ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Authentication Process</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Open the <span className="font-medium">Authentication</span> folder in the collection.
                  </li>
                  <li>
                    Select the <span className="font-medium">Token</span> request.
                  </li>
                  <li>
                    Ensure your environment is selected and that you've set the{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">api_username</code> and{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">api_password</code> variables.
                  </li>
                  <li>
                    Click <span className="font-medium">Send</span> to execute the request.
                  </li>
                  <li>
                    Upon successful authentication, the response will contain an access token that is automatically
                    stored in the <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">current_access_token</code>{" "}
                    environment variable.
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2">Authentication Response Example</h4>
                <div className="relative">
                  <div className="overflow-x-auto">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm">
                      {`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "userName": "example@preference.com",
  ".issued": "2023-05-26T14:00:46Z",
  ".expires": "2023-05-26T15:00:46Z"
}`}
                    </pre>
                  </div>
                  <button
                    className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                    onClick={() =>
                      handleCopy(
                        `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "userName": "example@preference.com",
  ".issued": "2023-05-26T14:00:46Z",
  ".expires": "2023-05-26T15:00:46Z"
}`,
                        "auth-response",
                      )
                    }
                  >
                    {copied === "auth-response" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Items Section */}
        <Collapsible open={openSections.items} onOpenChange={() => toggleSection("items")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                4
              </span>
              <h3 className="text-lg font-medium">Working with Items</h3>
            </div>
            {openSections.items ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Creating an Item</h4>
                <p>
                  The <span className="font-medium">CreateItem</span> request creates a new window configuration:
                </p>

                <div className="relative mt-2">
                  <div className="overflow-x-auto">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm">
                      {`{
  "ModelCode": "1_vent_1rail_OG",
  "IsPersistable": true
}`}
                    </pre>
                  </div>
                  <button
                    className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                    onClick={() =>
                      handleCopy(
                        `{
  "ModelCode": "1_vent_1rail_OG",
  "IsPersistable": true
}`,
                        "create-item-body",
                      )
                    }
                  >
                    {copied === "create-item-body" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Executing Commands</h4>
                <p>
                  The <span className="font-medium">ExecuteItemCommands</span> request modifies an item's configuration:
                </p>

                <div className="relative mt-2">
                  <div className="overflow-x-auto max-w-full">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap break-all">
                      {`"<Commands><cmd:Command name='Model.SetOptionValue' xmlns:cmd='http://www.preference.com/XMLSchemas/2006/PrefCAD.Command'><cmd:Parameter name='name' type='string' value='RY_INNER_COLOR' /><cmd:Parameter name='value' type='string' value='RY_45_9T10' /><cmd:Parameter name='regenerate' type='bool' value='0' /><cmd:Parameter name='sendEvents' type='bool' value='1' /><cmd:Parameter name='applyAllBinded' type='bool' value='1' /></cmd:Command></Commands>"`}
                    </pre>
                  </div>
                  <button
                    className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                    onClick={() =>
                      handleCopy(
                        `"<Commands><cmd:Command name='Model.SetOptionValue' xmlns:cmd='http://www.preference.com/XMLSchemas/2006/PrefCAD.Command'><cmd:Parameter name='name' type='string' value='RY_INNER_COLOR' /><cmd:Parameter name='value' type='string' value='RY_45_9T10' /><cmd:Parameter name='regenerate' type='bool' value='0' /><cmd:Parameter name='sendEvents' type='bool' value='1' /><cmd:Parameter name='applyAllBinded' type='bool' value='1' /></cmd:Command></Commands>"`,
                        "execute-command-body",
                      )
                    }
                  >
                    {copied === "execute-command-body" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Getting an Image</h4>
                <p>
                  The <span className="font-medium">GetImage</span> request retrieves a visualization of the item:
                </p>

                <div className="relative mt-2">
                  <div className="overflow-x-auto">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm">
                      {`{
  "imageType": 5,
  "width": 500,
  "height": 500,
  "units": 0,
  "usePrefOne": true,
  "visualPropertiesXML": ""
}`}
                    </pre>
                  </div>
                  <button
                    className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                    onClick={() =>
                      handleCopy(
                        `{
  "imageType": 5,
  "width": 500,
  "height": 500,
  "units": 0,
  "usePrefOne": true,
  "visualPropertiesXML": ""
}`,
                        "get-image-body",
                      )
                    }
                  >
                    {copied === "get-image-body" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Photorealistic Rendering Section */}
        <Collapsible open={openSections.photorealistic} onOpenChange={() => toggleSection("photorealistic")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                5
              </span>
              <h3 className="text-lg font-medium">Photorealistic Rendering</h3>
            </div>
            {openSections.photorealistic ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Creating a Session</h4>
                <p>
                  Use the <span className="font-medium">GetSessionId</span> request to create a rendering session:
                </p>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2 overflow-x-auto">
                  <p className="text-sm">
                    <span className="font-medium">URL:</span>{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                      http://reydemo.prefnet.net:8012/usd-service/v1/session/new
                    </code>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Method:</span> POST
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Generating Images</h4>
                <p>
                  Use the <span className="font-medium">GetOmniverseImages</span> request with this payload:
                </p>

                <div className="relative mt-2">
                  <div className="overflow-x-auto">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm">
                      {`{
  "models": [
    {
      "filePathsOrGuids": "{{item_id}}",
      "maker": "{{maker}}",
      "system": "{{system}}",
      "generateWall": true
    }
  ],
  "quality": [
    "low"
  ],
  "resolution": [
    "HD"
  ],
  "cameras": [
    "Camera_Inner_01", "Camera_Outer_01"
  ]
}`}
                    </pre>
                  </div>
                  <button
                    className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                    onClick={() =>
                      handleCopy(
                        `{
  "models": [
    {
      "filePathsOrGuids": "{{item_id}}",
      "maker": "{{maker}}",
      "system": "{{system}}",
      "generateWall": true
    }
  ],
  "quality": [
    "low"
  ],
  "resolution": [
    "HD"
  ],
  "cameras": [
    "Camera_Inner_01", "Camera_Outer_01"
  ]
}`,
                        "omniverse-images-body",
                      )
                    }
                  >
                    {copied === "omniverse-images-body" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-4">
                  <h5 className="font-medium mb-2">Key Parameters:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">models</code>: Array of models to render
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">quality</code>: Rendering quality (low,
                      medium, high)
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">resolution</code>: Image resolution (HD,
                      FHD, 4K)
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">cameras</code>: Camera angles to render
                      from
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Troubleshooting Section */}
        <Collapsible open={openSections.troubleshooting} onOpenChange={() => toggleSection("troubleshooting")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                6
              </span>
              <h3 className="text-lg font-medium">Troubleshooting</h3>
            </div>
            {openSections.troubleshooting ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Common Issues and Solutions</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium">401 Unauthorized</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      If you receive a 401 Unauthorized error, your access token may have expired. Run the Token request
                      again to obtain a new token.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium">404 Not Found</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Check that the <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">base_url</code> is
                      correct and that the endpoint path is valid.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium">400 Bad Request</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Verify that the request body is correctly formatted and contains all required fields.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Debugging Tips</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use the Postman Console (View &gt; Show Postman Console) to see detailed request and response
                    information.
                  </li>
                  <li>Check the environment variables by clicking on the eye icon next to the environment selector.</li>
                  <li>Examine the response body and headers for error messages.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Getting Help</h4>
                <p>
                  If you continue to experience issues, please contact our support team at{" "}
                  <a href="mailto:support@windowconfigurator.com" className="text-orange-600 hover:underline">
                    support@windowconfigurator.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
