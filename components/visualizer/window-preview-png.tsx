"use client"

import { useState, useRef, useEffect } from "react"
import { Maximize2, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WindowPreviewPNGProps {
  options: Record<string, string>
  pngImages: string[] | null
  isLoading: boolean
  error: string | null
}

export function WindowPreviewPNG({ options, pngImages, isLoading, error }: WindowPreviewPNGProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Add keyboard navigation and escape handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!pngImages || pngImages.length <= 1) return

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        handleImageSelect(selectedImageIndex > 0 ? selectedImageIndex - 1 : pngImages.length - 1)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        handleImageSelect(selectedImageIndex < pngImages.length - 1 ? selectedImageIndex + 1 : 0)
      } else if (event.key === "Escape" && isFullscreen) {
        event.preventDefault()
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown)
      // Prevent body scroll when fullscreen is open
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = "unset"
      }
    }
  }, [selectedImageIndex, pngImages, isFullscreen])

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500 mx-auto"></div>
          <p className="text-base font-medium text-gray-700">Loading PNG images...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500 mx-auto">
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
          <p className="text-base font-medium text-red-500">Failed to load PNG images</p>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!pngImages || pngImages.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 mx-auto">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-700">No PNG images available</p>
          <p className="mt-2 text-sm text-gray-500">Try refreshing or check your configuration</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full w-full" ref={containerRef}>
        <div className="flex h-full">
          {/* Main image display */}
          <div className="flex-1 relative flex items-center justify-center p-4 group">
            <div className="relative max-h-full max-w-full">
              <img
                src={pngImages[selectedImageIndex] || "/placeholder.svg"}
                alt={`Window view ${selectedImageIndex + 1}`}
                className="max-h-full max-w-full cursor-zoom-in rounded-lg shadow-lg object-contain"
                onClick={handleFullscreenToggle}
              />

              {/* Navigation arrows for multiple images - more subtle */}
              {pngImages.length > 1 && (
                <>
                  {/* Previous image arrow */}
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/40 rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleImageSelect(selectedImageIndex > 0 ? selectedImageIndex - 1 : pngImages.length - 1)
                    }}
                    aria-label="Previous image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Next image arrow */}
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/40 rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleImageSelect(selectedImageIndex < pngImages.length - 1 ? selectedImageIndex + 1 : 0)
                    }}
                    aria-label="Next image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Fullscreen toggle button */}
              <button
                className="absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
                onClick={handleFullscreenToggle}
                aria-label="Enter fullscreen"
              >
                <Maximize2 className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Controls for non-fullscreen mode */}
            <TooltipProvider>
              <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                      onClick={handleFullscreenToggle}
                    >
                      <Maximize2 className="h-4 w-4" />
                      <span className="sr-only">Fullscreen</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Fullscreen</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                      onClick={() => window.dispatchEvent(new CustomEvent("refreshVisualizations"))}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Refresh</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* Thumbnail sidebar */}
          {pngImages.length > 1 && (
            <div className="w-32 flex flex-col items-center justify-center gap-2 p-2 bg-gray-50 border-l border-gray-200">
              <div className="flex flex-col gap-2 max-h-full overflow-y-auto">
                {pngImages.map((image, idx) => (
                  <button
                    key={idx}
                    className={`w-24 h-24 border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                    onClick={() => handleImageSelect(idx)}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image counter */}
        {pngImages.length > 1 && (
          <div className="absolute bottom-4 left-4 z-20 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md">
            {selectedImageIndex + 1} of {pngImages.length}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Main fullscreen image container */}
          <div className="relative w-full h-full flex items-center justify-center p-8 group">
            <img
              src={pngImages[selectedImageIndex] || "/placeholder.svg"}
              alt={`Window view ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain cursor-pointer"
              onClick={() => setIsFullscreen(false)}
            />

            {/* Navigation arrows for fullscreen - more subtle */}
            {pngImages.length > 1 && (
              <>
                {/* Previous image arrow */}
                <button
                  className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 rounded-full p-4 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleImageSelect(selectedImageIndex > 0 ? selectedImageIndex - 1 : pngImages.length - 1)
                  }}
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next image arrow */}
                <button
                  className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 rounded-full p-4 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleImageSelect(selectedImageIndex < pngImages.length - 1 ? selectedImageIndex + 1 : 0)
                  }}
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Bottom UI for fullscreen */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4">
            {/* Image navigation dots */}
            {pngImages.length > 1 && (
              <div className="flex space-x-3">
                {pngImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-3 w-3 rounded-full border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-orange-500 bg-orange-500 scale-125"
                        : "border-white/60 bg-white/20 hover:border-orange-400 hover:bg-white/40"
                    }`}
                    onClick={() => handleImageSelect(idx)}
                    aria-label={`Select image ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Image counter for fullscreen */}
            {pngImages.length > 1 && (
              <div className="text-white text-sm bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                {selectedImageIndex + 1} of {pngImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
