"use client"

import { useRef, useState } from "react"
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface WindowPreview2DProps {
  options: Record<string, string>
  svgContent: string | null
  isLoading: boolean
  error: string | null
}

export function WindowPreview2D({ options, svgContent, isLoading, error }: WindowPreview2DProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const [currentScale, setCurrentScale] = useState(1)

  if (isLoading) {
    return <div className="h-full w-full" ref={svgContainerRef}></div>
  }

  if (error) {
    return <div className="h-full w-full" ref={svgContainerRef}></div>
  }

  return (
    <div className="h-full w-full" ref={svgContainerRef}>
      {!isLoading && !error && svgContent && (
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={5}
          limitToBounds={false}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
          doubleClick={{ mode: "reset" }}
          onTransformed={(_ref, state) => {
            setCurrentScale(state.scale)
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TooltipProvider>
                <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                        onClick={() => zoomIn(0.5)}
                      >
                        <ZoomIn className="h-4 w-4" />
                        <span className="sr-only">Zoom In</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Zoom In</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                        onClick={() => zoomOut(0.5)}
                      >
                        <ZoomOut className="h-4 w-4" />
                        <span className="sr-only">Zoom Out</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Zoom Out</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                        onClick={() => resetTransform()}
                      >
                        <Maximize2 className="h-4 w-4" />
                        <span className="sr-only">Reset View</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Reset View</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                        onClick={() => {
                          resetTransform()
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="sr-only">Refresh</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Refresh</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <div className="absolute bottom-4 left-4 z-20 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-md">
                {Math.round(currentScale * 100)}%
              </div>

              <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 transform rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md">
                <span>Pinch or scroll to zoom • Drag to pan • Double-click to reset</span>
              </div>

              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                contentStyle={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ width: "100%", height: "100%", minHeight: "400px" }}
                  dangerouslySetInnerHTML={{ __html: svgContent || "" }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
    </div>
  )
}
