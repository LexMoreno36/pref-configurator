"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Configurator } from "@/components/configurator/configurator"
import { ConfiguratorProvider } from "@/components/configurator/configurator-context"
import { Loader } from "@/components/ui/loader"
import { mockData } from "@/lib/mock-data"
import { toast } from "@/components/ui/use-toast"

export default function ConfiguratorPage() {
  const [uiDefinition, setUiDefinition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)
  const [modelCode, setModelCode] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get the selected model code from localStorage
    const storedModelCode = localStorage.getItem("selectedModelCode")
    if (storedModelCode) {
      setModelCode(storedModelCode)
    } else {
      // Default model code if none is selected
      setModelCode("1_vent_1rail_OG")
    }
  }, [])

  useEffect(() => {
    if (!modelCode) return

    const fetchConfigurationOptions = async () => {
      try {
        setLoading(true)

        // If we have a model code but no GUID, we should create a model first
        // For now, we'll just use the default endpoint
        const response = await fetch("/api/configurator")

        if (!response.ok) {
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

        // Show a temporary toast notification instead of an error message
        toast({
          title: "Using demo data",
          description: "Could not connect to the API. Using demo data instead.",
          duration: 3000,
        })

        setUiDefinition(mockData)
        setUsingMockData(true)
      } finally {
        setLoading(false)
      }
    }

    fetchConfigurationOptions()
  }, [modelCode])

  useEffect(() => {
    // Redirect to the home page if no model code is selected
    if (!modelCode) {
      router.push("/")
    }
  }, [modelCode, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 text-orange-500" />
        <span className="ml-2 text-lg">Loading configurator...</span>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden">
      <ConfiguratorProvider initialData={uiDefinition} modelCode={modelCode || undefined}>
        <Configurator modelCode={modelCode} />
      </ConfiguratorProvider>
    </div>
  )
}
