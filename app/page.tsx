"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader } from "@/components/ui/loader"
import { ArrowRight, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import productConfig from "@/data/product-configuration.json"
import { WindowIllustration } from "@/components/window-illustration"

interface ProductGroup {
  id: string
  name: string
  default?: boolean
}

interface OpeningType {
  id: string
  name: string
  default?: boolean
  modelCode: string
}

interface System {
  id: string
  name: string
  hasModels: boolean
  default?: boolean
}

export default function HomePage() {
  const [selectedProductGroup, setSelectedProductGroup] = useState<string>("")
  const [selectedOpeningType, setSelectedOpeningType] = useState<string>("")
  const [selectedSystem, setSelectedSystem] = useState<string>("")
  const [creatingModel, setCreatingModel] = useState(false)
  const [previewModelCode, setPreviewModelCode] = useState<string | null>(null)
  const [selectedModelCode, setSelectedModelCode] = useState<string>("")
  const router = useRouter()
  const [configMethod, setConfigMethod] = useState<"guided" | "direct">("guided")
  const [modelCodes, setModelCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Load default values on component mount
  useEffect(() => {
    const defaultProductGroup = productConfig.productGroups.find((pg) => pg.default)
    const defaultOpeningType = productConfig.openingTypes.find((ot) => ot.default)
    const defaultSystem = productConfig.systems.find((s) => s.default)

    if (defaultProductGroup) setSelectedProductGroup(defaultProductGroup.id)
    if (defaultOpeningType) setSelectedOpeningType(defaultOpeningType.id)
    if (defaultSystem) setSelectedSystem(defaultSystem.id)
  }, [])

  // Update preview model code when selections change
  useEffect(() => {
    if (selectedSystem && selectedOpeningType) {
      const system = productConfig.systems.find((s) => s.id === selectedSystem)
      const openingType = productConfig.openingTypes.find((ot) => ot.id === selectedOpeningType)

      if (system?.hasModels && openingType) {
        setPreviewModelCode(openingType.modelCode)
      } else {
        setPreviewModelCode(null)
      }
    } else {
      setPreviewModelCode(null)
    }
  }, [selectedSystem, selectedOpeningType])

  useEffect(() => {
    async function fetchModelCodes() {
      try {
        setLoading(true)

        const response = await fetch("/api/models/codes")
        if (!response.ok) {
          throw new Error(`Failed to fetch model codes: ${response.statusText}`)
        }

        const data = await response.json()
        if (data.modelCodes && Array.isArray(data.modelCodes)) {
          setModelCodes(data.modelCodes)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error("Error fetching model codes:", err)

        toast({
          title: "Connection Error",
          description: "Could not fetch model codes. Using default model.",
          variant: "destructive",
          duration: 3000,
        })

        setModelCodes(["1_vent_1rail_OG", "2_vent_2rail"])
      } finally {
        setLoading(false)
      }
    }

    fetchModelCodes()
  }, [])

  const handleStartConfiguring = async () => {
    // Determine which model code to use based on the configuration method
    const modelCodeToUse = configMethod === "guided" ? previewModelCode : selectedModelCode

    if (!modelCodeToUse) return

    try {
      setCreatingModel(true)

      const response = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelCode: modelCodeToUse,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create model: ${response.statusText}`)
      }

      const data = await response.json()
      const { guid } = data

      if (!guid) {
        throw new Error("No model GUID returned from API")
      }

      router.push(`/configurator/${encodeURIComponent(guid)}`)
    } catch (err) {
      console.error("Error creating model:", err)
      toast({
        title: "Error",
        description: "Failed to create model. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
      setCreatingModel(false)
    }
  }

  const selectedSystemData = productConfig.systems.find((s) => s.id === selectedSystem)
  const canStartConfiguring = previewModelCode && selectedSystemData?.hasModels

  const formatModelName = (code: string) => {
    return code
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-200 bg-white px-8 py-5 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 h-10 w-10 rounded-lg bg-orange-500 p-2 shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="text-white">
                <path
                  d="M3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-gray-900">
              <span className="font-bold">Window</span> Configurator
            </h1>
          </div>
          <Button
            variant="outline"
            disabled
            className="flex items-center border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
          >
            <FileText className="mr-2 h-4 w-4" />
            Documentation
            <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Coming Soon</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 px-4">
          {/* Left side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <WindowIllustration />
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 max-w-md"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Window <span className="text-orange-500">Configurator</span>
              </h2>
              <p className="text-gray-600">
                Design and customize enclosures to your exact specifications. Configure your product below to begin.
              </p>
            </div>

            <Card className="border border-gray-200 shadow-md bg-white rounded-xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Product Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setConfigMethod("guided")}
                      className={`px-4 py-3 text-sm font-medium ${
                        configMethod === "guided"
                          ? "border-b-2 border-orange-500 text-orange-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Guided Selection
                    </button>
                    <button
                      onClick={() => setConfigMethod("direct")}
                      className={`px-4 py-3 text-sm font-medium ${
                        configMethod === "direct"
                          ? "border-b-2 border-orange-500 text-orange-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Direct Model Selection
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {configMethod === "guided" ? (
                    <>
                      {/* Product Group Selection */}
                      <div className="space-y-2">
                        <label htmlFor="product-group-select" className="block text-sm font-medium text-gray-700">
                          Product Group
                        </label>
                        <Select value={selectedProductGroup} onValueChange={setSelectedProductGroup}>
                          <SelectTrigger
                            id="product-group-select"
                            className="w-full border-gray-200 bg-white focus:ring-orange-500 focus:border-orange-500 h-12 rounded-lg"
                          >
                            <SelectValue placeholder="Select a product group" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-200 rounded-lg">
                            {productConfig.productGroups.map((group: ProductGroup) => (
                              <SelectItem key={group.id} value={group.id} className="focus:bg-orange-50">
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* System Selection - Moved up */}
                      <div className="space-y-2">
                        <label htmlFor="system-select" className="block text-sm font-medium text-gray-700">
                          System
                        </label>
                        <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                          <SelectTrigger
                            id="system-select"
                            className="w-full border-gray-200 bg-white focus:ring-orange-500 focus:border-orange-500 h-12 rounded-lg"
                          >
                            <SelectValue placeholder="Select a system" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-200 rounded-lg">
                            {productConfig.systems.map((system: System) => (
                              <SelectItem key={system.id} value={system.id} className="focus:bg-orange-50">
                                {system.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Opening Type Selection - Moved down */}
                      <div className="space-y-2">
                        <label htmlFor="opening-type-select" className="block text-sm font-medium text-gray-700">
                          Opening Type
                        </label>
                        <Select value={selectedOpeningType} onValueChange={setSelectedOpeningType}>
                          <SelectTrigger
                            id="opening-type-select"
                            className="w-full border-gray-200 bg-white focus:ring-orange-500 focus:border-orange-500 h-12 rounded-lg"
                          >
                            <SelectValue placeholder="Select opening type" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-200 rounded-lg">
                            {productConfig.openingTypes.map((type: OpeningType) => (
                              <SelectItem key={type.id} value={type.id} className="focus:bg-orange-50">
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Model Preview */}
                      {selectedSystem && selectedOpeningType && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Model Preview</label>
                          {selectedSystemData?.hasModels ? (
                            <Alert className="border-green-200 bg-green-50">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-800">
                                <span className="font-medium">Model to be created:</span>{" "}
                                <code className="bg-green-100 px-2 py-1 rounded text-sm">{previewModelCode}</code>
                              </AlertDescription>
                            </Alert>
                          ) : (
                            <Alert className="border-amber-200 bg-amber-50">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <AlertDescription className="text-amber-800">
                                No models available for the <strong>{selectedSystemData?.name}</strong> system.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Direct Model Selection */}
                      <div className="space-y-2">
                        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700">
                          Window Model
                        </label>
                        <Select value={selectedModelCode} onValueChange={setSelectedModelCode}>
                          <SelectTrigger
                            id="model-select"
                            className="w-full border-gray-200 bg-white focus:ring-orange-500 focus:border-orange-500 h-12 rounded-lg"
                          >
                            <SelectValue placeholder="Select a window model" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-200 rounded-lg">
                            {!loading ? (
                              modelCodes.map((code) => (
                                <SelectItem key={code} value={code} className="focus:bg-orange-50">
                                  {formatModelName(code)}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>
                                <Loader className="mr-2 h-4 w-4 text-gray-400 animate-spin" />
                                Loading models...
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Model Preview for Direct Selection */}
                      {selectedModelCode && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Model Preview</label>
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              <span className="font-medium">Model to be created:</span>{" "}
                              <code className="bg-green-100 px-2 py-1 rounded text-sm">{selectedModelCode}</code>
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </>
                  )}

                  {/* Start Configuring Button */}
                  <Button
                    onClick={handleStartConfiguring}
                    disabled={
                      (configMethod === "guided" && !canStartConfiguring) ||
                      (configMethod === "direct" && !selectedModelCode) ||
                      creatingModel
                    }
                    className="w-full h-12 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:bg-gray-300 rounded-lg shadow-sm transition-colors"
                  >
                    {creatingModel ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 text-white" />
                        Creating Model...
                      </>
                    ) : (
                      <>
                        Start Configuring
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-1">Configuration Guide</h3>
              <p className="text-sm text-blue-700">
                {configMethod === "guided"
                  ? "Select your product group, system, and opening type to generate a custom model. The preview will show the model that will be created."
                  : "Choose a model directly from the available options. This method gives you access to all available models in the system."}
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">© 2025 Window Configurator</span>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
