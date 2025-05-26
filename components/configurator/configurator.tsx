"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useConfigurator } from "./configurator-context"
import { ConfiguratorSection } from "./configurator-section"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Info, Download, Copy, Check, Upload, AlertCircle, FileUp, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { WindowPreview } from "@/components/visualizer/window-preview"
import { useRouter } from "next/navigation"

export function Configurator({ modelCode, modelGuid }: { modelCode?: string | null; modelGuid: string }) {
  const { getTabs, selectedOptions, uiDefinition, updateOption } = useConfigurator()
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabs = getTabs()
    return tabs.length > 0 ? tabs[0] : ""
  })
  const [copied, setCopied] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<boolean>(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const tabs = getTabs()

  const handleAddToCart = () => {
    alert("Configuration complete! Item added to cart.")
  }

  const generateCompatibilityHash = () => {
    if (!uiDefinition) return ""

    const optionStructure = uiDefinition.Options.map((opt) => `${opt.Code}:${opt.Type}`)
      .sort()
      .join("|")
    return btoa(optionStructure).substring(0, 12)
  }

  const exportConfiguration = () => {
    const configData = {
      name: uiDefinition?.Name || "Window Configuration",
      timestamp: new Date().toISOString(),
      compatibilityHash: generateCompatibilityHash(),
      options: selectedOptions,
      modelCode: modelCode || "1_vent_1rail_OG",
      modelGuid: modelGuid,
    }

    const jsonString = JSON.stringify(configData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `window-config-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    const configData = {
      name: uiDefinition?.Name || "Window Configuration",
      timestamp: new Date().toISOString(),
      compatibilityHash: generateCompatibilityHash(),
      options: selectedOptions,
      modelCode: modelCode || "1_vent_1rail_OG",
      modelGuid: modelGuid,
    }

    navigator.clipboard
      .writeText(JSON.stringify(configData, null, 2))
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const processImportedConfig = (importedConfig: any) => {
    setImportError(null)
    setImportSuccess(false)

    try {
      const currentHash = generateCompatibilityHash()
      if (importedConfig.compatibilityHash && importedConfig.compatibilityHash !== currentHash) {
        setImportError("This configuration may not be compatible with your current options.")
        return
      }

      if (importedConfig.options) {
        Object.entries(importedConfig.options).forEach(([code, value]) => {
          updateOption(code, value as string)
        })
        setImportSuccess(true)
        setTimeout(() => setImportSuccess(false), 3000)
        setImportDialogOpen(false)
        setJsonInput("")
      } else {
        setImportError("Invalid configuration format.")
      }
    } catch (err) {
      console.error("Failed to process imported configuration:", err)
      setImportError("Failed to process the configuration. The format may be invalid.")
    }
  }

  const importConfigurationFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedConfig = JSON.parse(content)
        processImportedConfig(importedConfig)
      } catch (err) {
        console.error("Failed to parse imported configuration:", err)
        setImportError("Failed to parse the configuration file. The file may be corrupted.")
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    reader.readAsText(file)
  }

  const importConfigurationFromJson = () => {
    try {
      if (!jsonInput.trim()) {
        setImportError("Please paste a valid configuration JSON.")
        return
      }

      const importedConfig = JSON.parse(jsonInput)
      processImportedConfig(importedConfig)
    } catch (err) {
      console.error("Failed to parse pasted JSON:", err)
      setImportError("Failed to parse the JSON. Please check the format and try again.")
    }
  }

  const formatConfigForDisplay = () => {
    return Object.entries(selectedOptions).map(([code, value]) => {
      const displayCode = code.split("~")[1]
      const displayValue = value.includes("~") ? value.split("~")[1] : value
      return { code: displayCode, value: displayValue }
    })
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Format the GUID for display
  const formatGuid = (guid: string) => {
    return guid.substring(0, 8) + "..."
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center">
            <div
              className="mr-3 h-8 w-8 rounded-md bg-orange-500 p-1.5 cursor-pointer"
              onClick={() => router.push("/")}
            >
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
            <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => router.push("/")}>
              Preference <span className="font-light">Configurator</span>
            </h1>
            <div className="ml-4">
              {modelCode && (
                <div className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  Model: {modelCode}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Hidden file input for import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={importConfigurationFromFile}
              accept=".json"
              className="hidden"
            />

            {/* Import success message */}
            {importSuccess && (
              <div className="absolute left-1/2 top-16 z-50 -translate-x-1/2 transform">
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Configuration imported successfully!</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Import dialog */}
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Import Configuration</DialogTitle>
                  <DialogDescription>
                    Import a saved window configuration by uploading a file or pasting JSON.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4">
                  <div className="flex">
                    <Info className="mr-2 h-5 w-5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-blue-800">Configuration Compatibility</h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Configurations are specific to certain window options. For best results, import configurations
                        that were created with similar options to your current setup.
                      </p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="file" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file">Upload File</TabsTrigger>
                    <TabsTrigger value="paste">Paste JSON</TabsTrigger>
                  </TabsList>

                  <TabsContent value="file" className="mt-4">
                    <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6">
                      <FileUp className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-600">Drag and drop your configuration file, or</p>
                      <Button type="button" variant="outline" onClick={triggerFileInput} className="mt-2">
                        Select File
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="paste" className="mt-4">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Paste your configuration JSON here..."
                        className="min-h-[200px] font-mono text-xs"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={importConfigurationFromJson}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        Import from JSON
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {importError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{importError}</AlertDescription>
                  </Alert>
                )}

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Export dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Export Configuration</DialogTitle>
                  <DialogDescription>Export your current window configuration to save or share it.</DialogDescription>
                </DialogHeader>

                <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4">
                  <div className="flex">
                    <Info className="mr-2 h-5 w-5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-blue-800">Configuration Information</h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Your exported configuration contains all your current window options and preferences. You can
                        import this configuration later or share it with others who are designing similar windows.
                      </p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="preview" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <div className="max-h-[300px] overflow-y-auto rounded-md border p-4">
                      <h3 className="mb-2 font-medium">Configuration Summary</h3>
                      <div className="space-y-2">
                        {formatConfigForDisplay().map((item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500"></div>
                            <div>
                              <span className="font-medium">{item.code}:</span> {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="json" className="mt-4">
                    <div className="max-h-[300px] overflow-y-auto rounded-md bg-gray-900 p-4 text-xs text-gray-100">
                      <pre>
                        {JSON.stringify(
                          {
                            name: uiDefinition?.Name || "Window Configuration",
                            timestamp: new Date().toISOString(),
                            compatibilityHash: generateCompatibilityHash(),
                            options: selectedOptions,
                            modelCode: modelCode || "1_vent_1rail_OG",
                            modelGuid: modelGuid,
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
                  <Button type="button" variant="outline" onClick={copyToClipboard} className="mb-2 sm:mb-0">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                  <div className="flex space-x-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={exportConfiguration} className="bg-orange-500 hover:bg-orange-600">
                      <Download className="mr-2 h-4 w-4" />
                      Download JSON
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => router.push("/documentation")}
            >
              <Info className="mr-2 h-4 w-4" />
              Help
            </Button>
            <Button onClick={handleAddToCart} className="bg-orange-500 text-white hover:bg-orange-600">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Main content with ResizablePanelGroup */}
        <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          {/* Left panel - Configurator UI */}
          <ResizablePanel defaultSize={25} minSize={15} maxSize={33} className="bg-white shadow-md w-full">
            <ConfiguratorTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          </ResizablePanel>

          {/* Resizable handle/slider */}
          <ResizableHandle withHandle />

          {/* Right panel - Visualizer */}
          <ResizablePanel defaultSize={75}>
            <WindowPreview />
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-3 text-sm text-gray-600 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 h-5 w-5 rounded bg-orange-500 p-1">
                <svg viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 9H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21V9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span>© 2025 Preference Window Configurator. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-gray-500">Version 1.0.0</span>
              <a href="#" className="text-orange-500 transition-colors hover:text-orange-600 hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-orange-500 transition-colors hover:text-orange-600 hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-orange-500 transition-colors hover:text-orange-600 hover:underline">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

function ConfiguratorTabs({
  activeTab,
  setActiveTab,
  tabs,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  tabs: string[]
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full border-b border-gray-200 bg-gray-100">
        <div className="flex w-full px-2 py-2">
          <div className="flex flex-wrap w-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "m-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium",
                  activeTab === tab ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50",
                )}
              >
                {activeTab === tab && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-white"></span>}
                {tab}
              </button>
            ))}
            <div className="flex-grow"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto p-4">
        {tabs.map((tab) => (
          <div key={tab} className={cn("h-full w-full", activeTab === tab ? "block" : "hidden")}>
            <ConfiguratorTab tab={tab} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ConfiguratorTab({ tab }: { tab: string }) {
  const { getSections, isUIUpdating } = useConfigurator()
  const sections = getSections(tab)

  return (
    <div className="w-full space-y-6 pb-4">
      {isUIUpdating ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />
            <p className="mt-2 text-sm text-gray-600">Updating options...</p>
          </div>
        </div>
      ) : (
        sections.map((section) => <ConfiguratorSection key={section} tab={tab} section={section} />)
      )}
    </div>
  )
}
