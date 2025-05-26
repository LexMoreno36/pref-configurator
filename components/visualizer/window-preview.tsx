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
import { ErrorDisplay } from "@/components/ui/error-display"

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
  const [errorType, setErrorType] = useState<"auth" | "network" | "server" | "config" | "unknown">("unknown")

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
    setErrorType("unknown")

    try {
      const container = containerRef.current
      const width = container?.clientWidth || 500
      const height = container?.clientHeight || 500

      // Fetch data based on view mode
      if (viewMode === "2D") {
        try {
          const svgBase64 = await fetchSvgImage(guid, width, height)
          const svgString = processSvgResponseToString(svgBase64)
          if (svgString) {
            setSvgContent(svgString)
            needsFetchRef.current["2D"] = false
          } else {
            throw new Error("Failed to decode SVG")
          }
        } catch (err) {
          // Determine error type
          const errorMessage = err instanceof Error ? err.message : String(err)
          if (errorMessage.includes("Authentication failed") || errorMessage.includes("Unauthorized")) {
            setErrorType("auth")
          } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Network error")) {
            setErrorType("network")
          } else if (errorMessage.includes("500")) {
            setErrorType("server")
          }
          throw err
        }
      } else if (viewMode === "3D") {
        try {
          const base64Data = await fetchGltfModel(guid, width, height)
          setGltfBase64(base64Data)
          needsFetchRef.current["3D"] = false
        } catch (err) {
          // Determine error type
          const errorMessage = err instanceof Error ? err.message : String(err)
          if (errorMessage.includes("Authentication failed") || errorMessage.includes("Unauthorized")) {
            setErrorType("auth")
          } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Network error")) {
            setErrorType("network")
          } else if (errorMessage.includes("500")) {
            setErrorType("server")
          }
          throw err
        }
      } else if (viewMode === "PNG") {
        // Fetch PNG images
        try {
          const response = await fetch("/api/png-images", {
            method: "POST",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ guid }),
          })

          if (!response.ok) {
            // Determine error type based on status code
            if (response.status === 401 || response.status === 403) {
              setErrorType("auth")
            } else if (response.status >= 500) {
              setErrorType("server")
            }
            throw new Error(`Failed to fetch PNG images: ${response.statusText}`)
          }

          const data = await response.json()
          const images = Array.isArray(data.images) ? data.images : []
          setPngImages(images)
          needsFetchRef.current["PNG"] = false
        } catch (err) {
          // Determine error type if not already set
          if (errorType === "unknown") {
            const errorMessage = err instanceof Error ? err.message : String(err)
            if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Network error")) {
              setErrorType("network")
            }
          }
          throw err
        }
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

  // Handle retry
  const handleRetry = () => {
    if (modelGuid) {
      setError(null)
      needsFetchRef.current[viewMode] = true
      loadData(modelGuid)
    }
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

          {/* Loading state */}
          {(isLoading || isModelLoading) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500"></div>
              <p className="text-base font-medium text-gray-700">
                {isModelLoading ? "Creating model..." : `Loading ${viewMode} view...`}
              </p>
            </div>
          )}

          {/* Error state - using our new ErrorDisplay component */}
          {error && !isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white p-6">
              <ErrorDisplay
                error={error}
                type={errorType}
                title={`Failed to load ${viewMode} view`}
                onRetry={handleRetry}
                className="max-w-md"
              />

              {/* Additional guidance for specific error types */}
              {errorType === "auth" && (
                <div className="mt-4 max-w-md text-center text-sm text-gray-600">
                  <p>This error typically occurs when the API credentials are incorrect or missing.</p>
                  <p className="mt-2">Please check your environment variables:</p>
                  <ul className="mt-1 list-disc pl-6 text-left">
                    <li>API_USERNAME</li>
                    <li>API_PASSWORD</li>
                  </ul>
                </div>
              )}
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
