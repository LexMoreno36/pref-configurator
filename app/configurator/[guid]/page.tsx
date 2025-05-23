"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Configurator } from "@/components/configurator/configurator"
import { ConfiguratorProvider } from "@/components/configurator/configurator-context"
import { Loader } from "@/components/ui/loader"
import { mockData } from "@/lib/mock-data"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ConfiguratorPage({ params }: { params: Promise<{ guid: string }> }) {
  const [uiDefinition, setUiDefinition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)
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

        const response = await fetch(`/api/configurator/${guid}`)

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

        // Show a temporary toast notification
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
  }, [guid])

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
      <ConfiguratorProvider initialData={uiDefinition} modelGuid={guid} modelCode={modelCode || undefined}>
        <Configurator modelCode={modelCode} modelGuid={guid} />
      </ConfiguratorProvider>
    </div>
  )
}
