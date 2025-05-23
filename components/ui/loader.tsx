import type React from "react"
import { cn } from "@/lib/utils"

export interface LoaderProps extends React.HTMLAttributes<SVGElement> {}

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <svg
      className={cn("inline-block origin-center animate-spin text-muted-foreground", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
