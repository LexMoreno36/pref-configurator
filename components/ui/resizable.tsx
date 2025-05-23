"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

interface ResizablePanelProps extends React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Panel> {
  collapsible?: boolean
  collapsedSize?: number
  minSize?: number
  maxSize?: number
  onCollapse?: () => void
  onExpand?: () => void
  style?: React.CSSProperties
}

const ResizablePanel = React.forwardRef<React.ElementRef<typeof ResizablePrimitive.Panel>, ResizablePanelProps>(
  (
    {
      className,
      children,
      collapsible,
      collapsedSize = 0,
      minSize = 0,
      maxSize = 100,
      onCollapse,
      onExpand,
      style,
      ...props
    },
    ref,
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const handleCollapse = () => {
      if (!collapsible) return
      setIsCollapsed(true)
      onCollapse?.()
    }

    const handleExpand = () => {
      if (!collapsible) return
      setIsCollapsed(false)
      onExpand?.()
    }

    return (
      <ResizablePrimitive.Panel
        ref={ref}
        className={cn("relative flex h-full", className)}
        collapsible={collapsible}
        collapsedSize={collapsedSize}
        minSize={minSize}
        maxSize={maxSize}
        onCollapse={handleCollapse}
        onExpand={handleExpand}
        style={style}
        {...props}
      >
        {children}
      </ResizablePrimitive.Panel>
    )
  },
)
ResizablePanel.displayName = "ResizablePanel"

interface ResizableHandleProps extends React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelResizeHandle> {
  withHandle?: boolean
}

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelResizeHandle>,
  ResizableHandleProps
>(({ className, withHandle = false, ...props }, ref) => (
  <ResizablePrimitive.PanelResizeHandle
    ref={ref}
    className={cn(
      "relative flex w-1.5 items-center justify-center bg-gray-200 transition-colors hover:bg-gray-300",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-8 w-3 items-center justify-center rounded-sm border bg-white hover:bg-gray-100">
        <GripVertical className="h-3 w-3 text-gray-500" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
