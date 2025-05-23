"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"

export type OptionValue = {
  ValueString: string
  ValueNumeric?: number
}

export type ConfigOption = {
  Order: number
  Tab: string
  Section: string
  Widget: string
  Maker: string
  Code: string
  Type: string
  Description: string
  ValueString: string
  ValueNumeric: number
  Hidden: boolean
  Values: OptionValue[]
}

export type UIDefinition = {
  Name: string
  Options: ConfigOption[]
}

export type Dimensions = Record<string, number>

type ConfiguratorContextType = {
  uiDefinition: UIDefinition | null
  selectedOptions: Record<string, string>
  dimensions: Dimensions
  updateOption: (code: string, value: string) => void
  updateDimension: (name: string, value: number) => Promise<boolean>
  getTabOptions: (tab: string) => ConfigOption[]
  getTabs: () => string[]
  getSections: (tab: string) => string[]
  getSectionOptions: (tab: string, section: string) => ConfigOption[]
  modelGuid: string | null
  isModelLoading: boolean
  modelError: string | null
  isUIUpdating: boolean
  isDimensionsLoading: boolean
  refreshDimensions: () => Promise<void>
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined)

export function ConfiguratorProvider({
  children,
  initialData,
  modelGuid,
  modelCode,
}: {
  children: ReactNode
  initialData: UIDefinition | null
  modelGuid: string
  modelCode?: string
}) {
  const [uiDefinition, setUiDefinition] = useState<UIDefinition | null>(() => {
    if (initialData) {
      return {
        ...initialData,
        Options: [
          ...initialData.Options,
          {
            Order: 1000, // High order to place it at the end
            Tab: "Dimensions",
            Section: "Window Dimensions", // Changed from "Dimensions" to "Window Dimensions"
            Widget: "DimensionsWidget", // Custom widget type
            Maker: "virtual",
            Code: "virtual~dimensions",
            Type: "Dimensions",
            Description: "Window dimensions",
            ValueString: "dimensions",
            ValueNumeric: 0,
            Hidden: false,
            Values: [],
          },
        ],
      }
    }
    return initialData
  })
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false)
  const [modelError, setModelError] = useState<string | null>(null)
  const [isUIUpdating, setIsUIUpdating] = useState<boolean>(false)
  const [usingMockData, setUsingMockData] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState<Dimensions>({})
  const [isDimensionsLoading, setIsDimensionsLoading] = useState<boolean>(false)
  const updateInProgressRef = useRef<boolean>(false)
  const pendingUpdateRef = useRef<boolean>(false)

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    if (initialData?.Options) {
      initialData.Options.forEach((option) => {
        defaults[option.Code] = option.ValueString
      })
    }
    return defaults
  })

  useEffect(() => {
    if (initialData && initialData.Name && initialData.Name.includes("_MOCK")) {
      setUsingMockData(true)
    }
  }, [initialData])

  // Fetch dimensions when model GUID is available
  useEffect(() => {
    if (!modelGuid) return

    refreshDimensions()
  }, [modelGuid])

  const refreshDimensions = async () => {
    if (!modelGuid) return

    setIsDimensionsLoading(true)
    try {
      const response = await fetch(`/api/models/${modelGuid}/dimensions`)

      if (!response.ok) {
        throw new Error(`Failed to fetch dimensions: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.dimensions) {
        setDimensions(data.dimensions)
      }
    } catch (error) {
      console.error("Error fetching dimensions:", error)
      // Don't set mock dimensions, just leave as empty object
      setDimensions({})
    } finally {
      setIsDimensionsLoading(false)
    }
  }

  const updateDimension = async (name: string, value: number): Promise<boolean> => {
    if (!modelGuid) return false

    try {
      const response = await fetch(`/api/models/${modelGuid}/dimensions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          value,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update dimension: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.dimensions) {
        setDimensions(data.dimensions)
      }

      // Trigger visualization refresh after successful dimension update
      window.dispatchEvent(new CustomEvent("refreshVisualizations"))

      return true
    } catch (error) {
      console.error("Error updating dimension:", error)
      return false
    }
  }

  const updateUIDefinition = useCallback(async () => {
    // If an update is already in progress, mark that we need another update
    if (updateInProgressRef.current) {
      pendingUpdateRef.current = true
      return
    }

    if (!uiDefinition) {
      console.warn("Cannot update UI definition: No UI definition available")
      return
    }

    if (usingMockData) {
      return
    }

    setIsUIUpdating(true)
    updateInProgressRef.current = true

    try {
      // Instead of preparing a payload and making a PUT request to /api/configurator/update,
      // we'll use the new endpoint that fetches directly from the model
      if (!modelGuid) {
        console.warn("Cannot update UI definition: No model GUID available")
        return
      }

      // Make the API call to get the updated UI definition using the modelId endpoint
      const response = await fetch(`/api/configurator/${modelGuid}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error (${response.status}): ${errorText}`)
        throw new Error(`Failed to update UI definition: ${response.statusText} - ${errorText}`)
      }

      // Step 3: Process the response and update the UI
      const updatedDefinition = await response.json()

      // Always add the dimensions tab to the definition
      if (updatedDefinition && updatedDefinition.Options) {
        // We'll create a virtual tab for dimensions that's not sent to the server
        setUiDefinition({
          ...updatedDefinition,
          Options: [
            ...updatedDefinition.Options.filter((opt) => opt.Tab !== "Dimensions" || opt.Code !== "virtual~dimensions"),
            {
              Order: 1000, // High order to place it at the end
              Tab: "Dimensions",
              Section: "Window Dimensions", // Changed from "Dimensions" to "Window Dimensions"
              Widget: "DimensionsWidget", // Custom widget type
              Maker: "virtual",
              Code: "virtual~dimensions",
              Type: "Dimensions",
              Description: "Window dimensions",
              ValueString: "dimensions",
              ValueNumeric: 0,
              Hidden: false,
              Values: [],
            },
          ],
        })
      } else {
        setUiDefinition(updatedDefinition)
      }

      // Step 4: Update selected options with any new defaults
      setSelectedOptions((prev) => {
        const newDefaults: Record<string, string> = { ...prev }

        updatedDefinition.Options.forEach((option) => {
          if (!prev[option.Code]) {
            newDefaults[option.Code] = option.ValueString
          }
        })

        return newDefaults
      })
    } catch (error) {
      console.error("Failed to update UI definition:", error)
      setUsingMockData(true)
    } finally {
      setIsUIUpdating(false)
      updateInProgressRef.current = false

      // If another update was requested while this one was in progress, trigger it now
      if (pendingUpdateRef.current) {
        pendingUpdateRef.current = false
        setTimeout(() => updateUIDefinition(), 0)
      }
    }
  }, [uiDefinition, selectedOptions, usingMockData, modelGuid])

  // This function is called when a user changes an option
  const updateOption = useCallback(
    async (code: string, value: string) => {
      // Update the selected options state
      setSelectedOptions((prev) => {
        const newOptions = {
          ...prev,
          [code]: value,
        }

        // Execute the SetOptionsValues command first, then update UI definition
        setTimeout(async () => {
          try {
            // Step 1: Execute the SetOptionsValues command to update the model in the database
            if (modelGuid && !usingMockData) {
              const response = await fetch(`/api/models/${modelGuid}/options`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: code,
                  value: value,
                }),
              })

              if (!response.ok) {
                console.error(`Failed to execute SetOptionsValues command: ${response.statusText}`)
                // Continue with UI update even if command fails
              } else {
                console.log(`Successfully executed SetOptionsValues command for ${code} = ${value}`)

                // Step 2: Refresh visualizations ONLY after successful command execution
                window.dispatchEvent(new CustomEvent("refreshVisualizations"))
              }
            } else if (usingMockData) {
              // For mock data, still trigger the refresh
              window.dispatchEvent(new CustomEvent("refreshVisualizations"))
            }

            // Step 3: Update the UI definition after the command has been executed
            await updateUIDefinition()
          } catch (error) {
            console.error("Error in updateOption:", error)
            // Still try to update UI definition even if command fails
            await updateUIDefinition()
          }
        }, 0)

        return newOptions
      })
    },
    [updateUIDefinition, modelGuid, usingMockData],
  )

  const getTabs = (): string[] => {
    if (!uiDefinition?.Options) return []

    const tabs = new Set<string>()
    uiDefinition.Options.forEach((option) => {
      if (!option.Hidden) {
        tabs.add(option.Tab)
      }
    })

    return Array.from(tabs)
  }

  const getTabOptions = (tab: string): ConfigOption[] => {
    if (!uiDefinition?.Options) return []

    return uiDefinition.Options.filter((option) => option.Tab === tab && !option.Hidden).sort(
      (a, b) => a.Order - b.Order,
    )
  }

  const getSections = (tab: string): string[] => {
    if (!uiDefinition?.Options) return []

    const sections = new Set<string>()
    uiDefinition.Options.forEach((option) => {
      if (option.Tab === tab && !option.Hidden) {
        sections.add(option.Section)
      }
    })

    return Array.from(sections)
  }

  const getSectionOptions = (tab: string, section: string): ConfigOption[] => {
    if (!uiDefinition?.Options) return []

    return uiDefinition.Options.filter(
      (option) => option.Tab === tab && option.Section === section && !option.Hidden,
    ).sort((a, b) => a.Order - b.Order)
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        uiDefinition,
        selectedOptions,
        dimensions,
        updateOption,
        updateDimension,
        getTabOptions,
        getTabs,
        getSections,
        getSectionOptions,
        modelGuid,
        isModelLoading,
        modelError,
        isUIUpdating,
        isDimensionsLoading,
        refreshDimensions,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  )
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext)
  if (context === undefined) {
    throw new Error("useConfigurator must be used within a ConfiguratorProvider")
  }
  return context
}
