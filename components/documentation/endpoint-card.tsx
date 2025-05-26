"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

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
  requestBody = null,
  responseExample = null,
  notes = null,
}: EndpointCardProps) {
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
