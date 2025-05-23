"use client"

import { useState, useEffect, useRef } from "react"
import { useConfigurator } from "@/components/configurator/configurator-context"
import { WindowPreview2D } from "./window-preview-2d"
import { WindowPreview3D } from "./window-preview-3d"
import { WindowPreviewPNG } from "./window-preview-png"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube3D, SquareStack, CameraIcon } from "lucide-react"
import { fetchSvgImage, fetchGltfModel } from "@/lib/api-service"
import { processSvgResponseToString } from "@/lib/svg-utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * WindowPreview Component
 *
 * This component is responsible for rendering the window visualization based on the
 * current configuration options. It supports 2D, 3D, and PNG visualization modes.
 *
 * @returns React component that renders the window visualization
 */
export function WindowPreview() {
  const { selectedOptions, modelGuid, isModelLoading } = useConfigurator()
  const [viewMode, setViewMode] = useState<"2D" | "3D" | "PNG">("3D") // Set 3D as default
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data for each view mode
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [gltfBase64, setGltfBase64] = useState<string | null>(null)
  const [pngImages, setPngImages] = useState<string[] | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastOptionsRef = useRef<string>(JSON.stringify(selectedOptions))

  // Track if we need to fetch data for each view mode
  const needsFetchRef = useRef({
    "2D": true,
    "3D": true,
    PNG: true,
  })

  // Check if options have changed
  useEffect(() => {
    // Just update the reference to the current options
    // but don't trigger a refresh yet - that will happen via the event
    lastOptionsRef.current = JSON.stringify(selectedOptions)
  }, [selectedOptions])

  // Listen for manual refresh events (from dimension changes)
  useEffect(() => {
    const handleRefreshEvent = () => {
      setSvgContent(null)
      setGltfBase64(null)
      setPngImages(null)
      needsFetchRef.current = {
        "2D": true,
        "3D": true,
        PNG: true,
      }

      // If the current view mode needs a refresh, trigger a fetch
      if (needsFetchRef.current[viewMode] && modelGuid) {
        loadData(modelGuid)
      }
    }

    window.addEventListener("refreshVisualizations", handleRefreshEvent)

    return () => {
      window.removeEventListener("refreshVisualizations", handleRefreshEvent)
    }
  }, [viewMode, modelGuid])

  // Fetch data when view mode changes or when data needs to be refreshed
  useEffect(() => {
    if (!modelGuid || isModelLoading) return

    // Only fetch if this view mode needs a refresh
    if (!needsFetchRef.current[viewMode]) return

    loadData(modelGuid)
  }, [modelGuid, isModelLoading, viewMode, needsFetchRef.current[viewMode]])

  async function loadData(guid: string) {
    setIsLoading(true)
    setError(null)

    try {
      const container = containerRef.current
      const width = container?.clientWidth || 500
      const height = container?.clientHeight || 500

      // Fetch data based on view mode
      if (viewMode === "2D") {
        const svgBase64 = await fetchSvgImage(guid, width, height)
        const svgString = processSvgResponseToString(svgBase64)
        if (svgString) {
          setSvgContent(svgString)
          needsFetchRef.current["2D"] = false
        } else {
          throw new Error("Failed to decode SVG")
        }
      } else if (viewMode === "3D") {
        const base64Data = await fetchGltfModel(guid, width, height)
        setGltfBase64(base64Data)
        needsFetchRef.current["3D"] = false
      } else if (viewMode === "PNG") {
        // Fetch PNG images
        const response = await fetch("/api/png-images", {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guid }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch PNG images")
        }

        const data = await response.json()
        const images = Array.isArray(data.images) ? data.images : []
        setPngImages(images)
        needsFetchRef.current["PNG"] = false
      }
    } catch (err) {
      console.error(`Failed to load ${viewMode} view:`, err)
      setError(err instanceof Error ? err.message : `Failed to load ${viewMode} view`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle view mode change
  const handleViewModeChange = (mode: "2D" | "3D" | "PNG") => {
    setViewMode(mode)
  }

  return (
    <div className="relative h-full w-full" ref={containerRef}>
      <div className="h-full w-full bg-[#f5f7fa] p-4">
        <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-white shadow-md">
          {/* View mode toggle - increased z-index to 50 to ensure it's always on top */}
          <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2 transform">
            <TooltipProvider>
              <div className="flex rounded-lg border bg-white p-1 shadow-md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "2D" ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center ${
                        viewMode === "2D" ? "bg-orange-500 text-white hover:bg-orange-600" : "text-gray-600"
                      }`}
                      onClick={() => handleViewModeChange("2D")}
                    >
                      <SquareStack className="mr-1 h-4 w-4" />
                      2D
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>2D Technical Drawing</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "3D" ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center ${
                        viewMode === "3D" ? "bg-orange-500 text-white hover:bg-orange-600" : "text-gray-600"
                      }`}
                      onClick={() => handleViewModeChange("3D")}
                    >
                      <Cube3D className="mr-1 h-4 w-4" />
                      3D
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>3D Interactive Model</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "PNG" ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center ${
                        viewMode === "PNG" ? "bg-orange-500 text-white hover:bg-orange-600" : "text-gray-600"
                      }`}
                      onClick={() => handleViewModeChange("PNG")}
                    >
                      <CameraIcon className="mr-1 h-4 w-4" />
                      PR
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Photorealistic Rendering</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* Loading and error states */}
          {(isLoading || isModelLoading) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500"></div>
              <p className="text-base font-medium text-gray-700">
                {isModelLoading ? "Creating model..." : `Loading ${viewMode} view...`}
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-red-500">Failed to load window preview</p>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
            </div>
          )}

          {/* Render visualization based on viewMode */}
          <div className="relative h-full w-full">
            {viewMode === "2D" ? (
              <WindowPreview2D
                options={selectedOptions}
                svgContent={svgContent}
                isLoading={isLoading || isModelLoading}
                error={error}
              />
            ) : viewMode === "3D" ? (
              <WindowPreview3D
                modelGuid={modelGuid}
                isModelCreating={isModelLoading}
                options={selectedOptions}
                gltfBase64={gltfBase64}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <WindowPreviewPNG options={selectedOptions} pngImages={pngImages} isLoading={isLoading} error={error} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
