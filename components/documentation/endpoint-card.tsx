"use client"

import { useState } from "react"
import { Code, ChevronDown, ChevronUp, Copy, Check } from "lucide-react"

interface EndpointCardProps {
  method: "GET" | "POST" | "PUT" | "DELETE"
  endpoint: string
  description: string
  requestBody?: any
  responseExample?: any
  notes?: string
}

export function EndpointCard({
  method,
  endpoint,
  description,
  requestBody,
  responseExample,
  notes,
}: EndpointCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const methodColors = {
    GET: "bg-blue-100 text-blue-800",
    POST: "bg-green-100 text-green-800",
    PUT: "bg-yellow-100 text-yellow-800",
    DELETE: "bg-red-100 text-red-800",
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  // Format XML string with proper indentation and line breaks
  const formatXML = (xml: string) => {
    let formatted = ""
    let indent = ""

    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) {
        // If this is a closing tag, decrease indent
        indent = indent.substring(2)
      }

      formatted += indent + "<" + node + ">\n"

      if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith("?")) {
        // If this is an opening tag (and not a self-closing tag), increase indent
        indent += "  "
      }
    })

    return formatted.substring(1, formatted.length - 2)
  }

  // Format request body for display
  const formatRequestBody = (body: any) => {
    if (typeof body === "object" && body.command && typeof body.command === "string" && body.command.startsWith("<")) {
      // This is XML content in a command property
      const formattedXML = formatXML(body.command)
      return {
        ...body,
        command: formattedXML,
      }
    }
    return body
  }

  const formattedRequestBody = requestBody ? formatRequestBody(requestBody) : null

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-white p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-grow">
            <span className={`px-2 py-1 rounded text-xs font-medium ${methodColors[method]}`}>{method}</span>
            <div className="min-w-0 flex-grow">
              <h4 className="text-sm font-medium text-gray-900">{description}</h4>
              <div className="mt-1 flex items-center">
                <Code className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                <div className="flex items-center w-full">
                  <code className="text-xs font-mono bg-gray-100 rounded px-1 py-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-30px)]">
                    {endpoint}
                  </code>
                  <button
                    onClick={() => copyToClipboard(endpoint, "url")}
                    className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    title="Copy URL"
                  >
                    {copied === "url" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none flex-shrink-0 ml-2"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {notes && <p className="mt-2 text-xs text-gray-600">{notes}</p>}

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {requestBody && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-medium text-gray-700">Request Body</h5>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(requestBody, null, 2), "request")}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    title="Copy Request Body"
                  >
                    {copied === "request" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <pre className="text-xs bg-gray-900 text-white p-3 rounded overflow-x-auto max-h-60 whitespace-pre-wrap break-words">
                    {JSON.stringify(formattedRequestBody, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {responseExample && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-medium text-gray-700">Response Example</h5>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(responseExample, null, 2), "response")}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    title="Copy Response Example"
                  >
                    {copied === "response" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <pre className="text-xs bg-gray-900 text-white p-3 rounded overflow-x-auto max-h-60 whitespace-pre-wrap break-words">
                    {JSON.stringify(responseExample, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
