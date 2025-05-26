"use client"
import { AlertCircle, Wifi, Lock, RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type ErrorType = "auth" | "network" | "server" | "config" | "unknown"

interface ErrorDisplayProps {
  error: string | null
  type?: ErrorType
  title?: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ error, type = "unknown", title, onRetry, className = "" }: ErrorDisplayProps) {
  if (!error) return null

  const getIcon = () => {
    switch (type) {
      case "auth":
        return <Lock className="h-5 w-5" />
      case "network":
        return <Wifi className="h-5 w-5" />
      case "config":
        return <Settings className="h-5 w-5" />
      case "server":
      case "unknown":
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getTitle = () => {
    if (title) return title

    switch (type) {
      case "auth":
        return "Authentication Error"
      case "network":
        return "Connection Error"
      case "config":
        return "Configuration Error"
      case "server":
        return "Server Error"
      case "unknown":
      default:
        return "Error"
    }
  }

  const getActionText = () => {
    switch (type) {
      case "auth":
        return "Please check your API credentials in the environment variables."
      case "network":
        return "Please check your internet connection and try again."
      case "config":
        return "Please check your configuration settings."
      case "server":
        return "The server encountered an error. Please try again later."
      case "unknown":
      default:
        return "Something went wrong. Please try again."
    }
  }

  return (
    <Alert variant="destructive" className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center">
        {getIcon()}
        <AlertTitle className="ml-2">{getTitle()}</AlertTitle>
      </div>
      <AlertDescription className="mt-2 text-center">
        <p className="mb-2">{getActionText()}</p>
        <p className="text-xs text-gray-500">{error}</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-2 flex items-center" onClick={onRetry}>
            <RefreshCw className="mr-1 h-3 w-3" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
