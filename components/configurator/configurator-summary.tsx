"use client"

import { useConfigurator } from "./configurator-context"
import { Badge } from "@/components/ui/badge"

export function ConfiguratorSummary() {
  const { selectedOptions } = useConfigurator()

  // Group options by tab
  const groupedOptions: Record<string, string[]> = {}

  Object.entries(selectedOptions).forEach(([code, value]) => {
    const displayCode = code.split("~")[1]
    const displayValue = value.includes("~") ? value.split("~")[1] : value

    // Extract tab from code (this is a simplification - in a real app you'd use the actual tab)
    const optionKey = `${displayCode}: ${displayValue}`

    // Group by first word of the code as a simple way to categorize
    const category = displayCode.split(" ")[0]

    if (!groupedOptions[category]) {
      groupedOptions[category] = []
    }

    groupedOptions[category].push(optionKey)
  })

  return (
    <div className="space-y-6">
      {/* Selected options by category */}
      {Object.entries(groupedOptions).map(([category, options]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">{category}</h3>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option} className="flex items-center text-sm">
                <div className="mr-2 h-2 w-2 rounded-full bg-orange-500"></div>
                <span className="text-gray-600">{option}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick summary badges */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">Quick Summary</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedOptions)
            .slice(0, 6)
            .map(([code, value]) => {
              const displayCode = code.split("~")[1]
              const displayValue = value.includes("~") ? value.split("~")[1] : value

              return (
                <Badge
                  key={code}
                  variant="outline"
                  className="border-orange-200 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700"
                >
                  {displayCode.split(" ")[0]}: {displayValue}
                </Badge>
              )
            })}
          {Object.keys(selectedOptions).length > 6 && (
            <Badge variant="outline" className="bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
              +{Object.keys(selectedOptions).length - 6} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
