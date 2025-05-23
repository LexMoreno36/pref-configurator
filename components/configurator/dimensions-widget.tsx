"use client"

import { useState, useEffect, type KeyboardEvent } from "react"
import { useConfigurator } from "./configurator-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type DimensionGroup = {
  total: string
  totalValue: number
  subDimensions: { name: string; value: number }[]
}

export function DimensionsWidget() {
  const { dimensions, isDimensionsLoading, updateDimension, modelGuid, refreshDimensions } = useConfigurator()
  const [dimensionGroups, setDimensionGroups] = useState<DimensionGroup[]>([])
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  // Process dimensions into groups whenever dimensions change
  useEffect(() => {
    if (!dimensions || Object.keys(dimensions).length === 0) return

    // Create edit values for all dimensions
    const newEditValues: Record<string, string> = {}
    Object.entries(dimensions).forEach(([key, value]) => {
      newEditValues[key] = value.toString()
    })
    setEditValues(newEditValues)

    // Group dimensions
    const groups: Record<string, DimensionGroup> = {}

    // First pass: identify totals (single-character keys)
    Object.entries(dimensions).forEach(([key, value]) => {
      if (key.length === 1) {
        groups[key] = {
          total: key,
          totalValue: value,
          subDimensions: [],
        }
      }
    })

    // Second pass: add sub-dimensions to their respective groups
    Object.entries(dimensions).forEach(([key, value]) => {
      if (key.length > 1) {
        const totalKey = key.charAt(0)
        if (groups[totalKey]) {
          groups[totalKey].subDimensions.push({
            name: key,
            value: value,
          })
        }
      }
    })

    // Sort sub-dimensions by name
    Object.values(groups).forEach((group) => {
      group.subDimensions.sort((a, b) => {
        const aNum = Number.parseInt(a.name.slice(1), 10)
        const bNum = Number.parseInt(b.name.slice(1), 10)
        return aNum - bNum
      })
    })

    // Convert to array for rendering
    setDimensionGroups(Object.values(groups))
  }, [dimensions])

  // Load dimensions on component mount if they're not already loaded
  useEffect(() => {
    if (Object.keys(dimensions).length === 0 && !isDimensionsLoading && modelGuid) {
      refreshDimensions()
    }
  }, [dimensions, isDimensionsLoading, modelGuid, refreshDimensions])

  const handleInputChange = (key: string, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleBlur = async (key: string) => {
    const value = Number.parseFloat(editValues[key])

    if (isNaN(value)) {
      // Reset to original value if input is not a number
      setEditValues((prev) => ({
        ...prev,
        [key]: dimensions[key].toString(),
      }))
      return
    }

    if (value === dimensions[key]) {
      // No change, skip update
      return
    }

    setIsUpdating((prev) => ({
      ...prev,
      [key]: true,
    }))

    try {
      // Pass the full dimension name (e.g., "L2") and value
      // The API and utility function will handle extracting the parts
      const success = await updateDimension(key, value)

      if (success) {
        // No need to update editValues, as dimensions state will change
        // which will trigger the useEffect to update editValues

        // Refresh the visualizations
        window.dispatchEvent(new CustomEvent("refreshVisualizations"))
      } else {
        throw new Error("Failed to update dimension")
      }
    } catch (error) {
      console.error("Error updating dimension:", error)
      toast({
        title: "Error",
        description: "Failed to update dimension. Please try again.",
        variant: "destructive",
        duration: 3000,
      })

      // Reset to original value
      setEditValues((prev) => ({
        ...prev,
        [key]: dimensions[key].toString(),
      }))
    } finally {
      setIsUpdating((prev) => ({
        ...prev,
        [key]: false,
      }))
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, key: string) => {
    if (e.key === "Enter") {
      e.currentTarget.blur() // Trigger the onBlur event
      handleBlur(key)
    }
  }

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  if (isDimensionsLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="mr-2 h-5 w-5 text-orange-500" />
        <span className="text-sm text-gray-600">Loading dimensions...</span>
      </div>
    )
  }

  if (dimensionGroups.length === 0) {
    return <div className="p-4 text-center text-sm text-gray-500">No dimensions available for this model.</div>
  }

  return (
    <div className="space-y-3">
      {dimensionGroups.map((group) => {
        const isExpanded = expandedGroups[group.total] || false
        const hasSubDimensions = group.subDimensions.length > 0

        return (
          <Card key={group.total} className="overflow-hidden border-gray-200">
            <CardContent className="p-0">
              {/* Main dimension row */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center">
                  {hasSubDimensions ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2 h-6 w-6 p-0"
                      onClick={() => toggleGroup(group.total)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  ) : (
                    <div className="mr-2 h-6 w-6"></div> // Placeholder for alignment
                  )}
                  <Label className="font-medium text-gray-700">{group.total}</Label>
                </div>

                <div className="flex items-center">
                  <div className="relative flex items-center">
                    <Input
                      value={editValues[group.total] || ""}
                      onChange={(e) => handleInputChange(group.total, e.target.value)}
                      onBlur={() => handleBlur(group.total)}
                      onKeyDown={(e) => handleKeyDown(e, group.total)}
                      className={`w-20 h-9 text-right ${isUpdating[group.total] ? "bg-gray-100" : ""}`}
                      disabled={isUpdating[group.total]}
                    />
                    {isUpdating[group.total] && (
                      <div className="absolute right-2 flex items-center">
                        <Loader className="h-3 w-3 text-orange-500" />
                      </div>
                    )}
                    <span className="ml-1 text-xs text-gray-500">mm</span>
                  </div>
                </div>
              </div>

              {/* Sub-dimensions */}
              {isExpanded && group.subDimensions.length > 0 && (
                <div className="bg-gray-50 p-2">
                  <div className="space-y-2">
                    {group.subDimensions.map((subDim) => (
                      <div key={subDim.name} className="flex items-center justify-between px-3 py-1">
                        <Label htmlFor={`dimension-${subDim.name}`} className="text-xs font-medium text-gray-600 ml-6">
                          {subDim.name}
                        </Label>
                        <div className="flex items-center">
                          <Input
                            id={`dimension-${subDim.name}`}
                            value={editValues[subDim.name] || ""}
                            onChange={(e) => handleInputChange(subDim.name, e.target.value)}
                            onBlur={() => handleBlur(subDim.name)}
                            onKeyDown={(e) => handleKeyDown(e, subDim.name)}
                            className={`w-20 h-8 text-right text-sm bg-gray-50`}
                            disabled={true}
                          />
                          <span className="ml-2 text-xs text-gray-400">(read-only)</span>
                          {isUpdating[subDim.name] && (
                            <div className="absolute right-8 flex items-center">
                              <Loader className="h-3 w-3 text-orange-500" />
                            </div>
                          )}
                          <span className="ml-1 text-xs text-gray-500">mm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
