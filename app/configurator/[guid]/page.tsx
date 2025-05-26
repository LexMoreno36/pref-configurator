"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Configurator } from "@/components/configurator/configurator"
import { ConfiguratorProvider } from "@/components/configurator/configurator-context"
import { Loader } from "@/components/ui/loader"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ErrorDisplay } from "@/components/ui/error-display"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function ConfiguratorPage({ params }: { params: Promise<{ guid: string }> }) {
  const [uiDefinition, setUiDefinition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"auth" | "network" | "server" | "config" | "unknown">("unknown")
  const [modelCode, setModelCode] = useState<string | null>(null)
  const router = useRouter()
  const { guid } = React.use(params)

  // Validate the GUID format
  useEffect(() => {
    // Simple GUID validation - can be made more robust
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!guidRegex.test(guid)) {
      toast({
        title: "Invalid Model ID",
        description: "The model identifier is not valid. Redirecting to home page.",
        variant: "destructive",
        duration: 3000,
      })
      router.push("/")
    }
  }, [guid, router])

  useEffect(() => {
    // Get the model code from localStorage if available
    const storedModelCode = localStorage.getItem("selectedModelCode")
    if (storedModelCode) {
      setModelCode(storedModelCode)
    }
  }, [])

  useEffect(() => {
    if (!guid) return

    const fetchConfigurationOptions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/configurator/${guid}`)

        if (!response.ok) {
          // Determine error type based on status code
          if (response.status === 401 || response.status === 403) {
            setErrorType("auth")
          } else if (response.status >= 500) {
            setErrorType("server")
          }

          const errorText = await response.text()
          throw new Error(`Failed to fetch configuration options: ${response.statusText} - ${errorText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(`API error: ${data.error} - ${data.message || ""}`)
        }

        setUiDefinition(data)
      } catch (err) {
        console.error("Error fetching configuration options:", err)

        // Determine error type if not already set
        if (errorType === "unknown") {
          const errorMessage = err instanceof Error ? err.message : String(err)
          if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Network error")) {
            setErrorType("network")
          }
        }

        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchConfigurationOptions()
  }, [guid, errorType])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setErrorType("unknown")

    // Re-fetch the configuration options
    setTimeout(() => {
      const fetchConfigurationOptions = async () => {
        try {
          const response = await fetch(`/api/configurator/${guid}`)

          if (!response.ok) {
            // Determine error type based on status code
            if (response.status === 401 || response.status === 403) {
              setErrorType("auth")
            } else if (response.status >= 500) {
              setErrorType("server")
            }

            const errorText = await response.text()
            throw new Error(`Failed to fetch configuration options: ${response.statusText} - ${errorText}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(`API error: ${data.error} - ${data.message || ""}`)
          }

          setUiDefinition(data)
          setError(null)
        } catch (err) {
          console.error("Error fetching configuration options:", err)

          // Determine error type if not already set
          if (errorType === "unknown") {
            const errorMessage = err instanceof Error ? err.message : String(err)
            if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Network error")) {
              setErrorType("network")
            }
          }

          setError(err instanceof Error ? err.message : String(err))
        } finally {
          setLoading(false)
        }
      }

      fetchConfigurationOptions()
    }, 100)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 text-orange-500" />
        <span className="ml-2 text-lg">Loading configurator...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <ErrorDisplay error={error} type={errorType} title="Failed to load configurator" onRetry={handleRetry} />

          <div className="mt-6 flex justify-center">
            <Link href="/">
              <Button variant="outline" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Additional guidance for specific error types */}
          {errorType === "auth" && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <h3 className="mb-2 font-medium">Troubleshooting Authentication Issues</h3>
              <p>This error typically occurs when the API credentials are incorrect or missing.</p>
              <p className="mt-2">Please check your environment variables:</p>
              <ul className="mt-1 list-disc pl-6">
                <li>API_USERNAME</li>
                <li>API_PASSWORD</li>
              </ul>
              <p className="mt-2">Make sure these are set correctly in your environment.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden">
      <ConfiguratorProvider initialData={uiDefinition} modelGuid={guid} modelCode={modelCode || undefined}>
        <Configurator modelCode={modelCode} modelGuid={guid} />
      </ConfiguratorProvider>
    </div>
  )
}
