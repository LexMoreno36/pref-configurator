"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Code,
  ImageIcon,
  Layers,
  RefreshCw,
  Database,
  Settings,
  ChevronRight,
  Key,
  Monitor,
  BookOpen,
} from "lucide-react"
import { Overview } from "@/components/documentation/overview"
import { Models } from "@/components/documentation/models"
import { Configuration } from "@/components/documentation/configuration"
import { Dimensions } from "@/components/documentation/dimensions"
import { Visualizations } from "@/components/documentation/visualizations"
import { Integration } from "@/components/documentation/integration"
import { Authentication } from "@/components/documentation/authentication"
import { ApiReference } from "@/components/documentation/api-reference"
import { Photorealistic } from "@/components/documentation/photorealistic"
import { PostmanCollection } from "@/components/documentation/postman-collection"
import { PostmanGuide } from "@/components/documentation/postman-guide"

export default function DocumentationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState<string>("overview")

  useEffect(() => {
    const section = searchParams?.get("section")
    if (section) {
      setActiveSection(section)
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center">
            <div
              className="mr-3 h-10 w-10 rounded-lg bg-orange-500 p-2 shadow-md cursor-pointer"
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
            <h1 className="text-xl font-medium text-gray-900 cursor-pointer" onClick={() => router.push("/")}>
              <span className="font-bold">Window</span> Configurator
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="flex items-center border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => router.push("/")}
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              Back to Configurator
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-800">Documentation</h2>
              </div>
              <nav className="p-2">
                <NavItem
                  icon={<FileText className="h-4 w-4" />}
                  title="Overview"
                  active={activeSection === "overview"}
                  onClick={() => setActiveSection("overview")}
                />
                <NavItem
                  icon={<Key className="h-4 w-4" />}
                  title="Authentication"
                  active={activeSection === "authentication"}
                  onClick={() => setActiveSection("authentication")}
                />
                <NavItem
                  icon={<Database className="h-4 w-4" />}
                  title="Models"
                  active={activeSection === "models"}
                  onClick={() => setActiveSection("models")}
                />
                <NavItem
                  icon={<Settings className="h-4 w-4" />}
                  title="Configuration"
                  active={activeSection === "configuration"}
                  onClick={() => setActiveSection("configuration")}
                />
                <NavItem
                  icon={<Layers className="h-4 w-4" />}
                  title="Dimensions"
                  active={activeSection === "dimensions"}
                  onClick={() => setActiveSection("dimensions")}
                />
                <NavItem
                  icon={<ImageIcon className="h-4 w-4" />}
                  title="Visualizations"
                  active={activeSection === "visualizations"}
                  onClick={() => setActiveSection("visualizations")}
                />
                <NavItem
                  icon={<Monitor className="h-4 w-4" />}
                  title="Photorealistic"
                  active={activeSection === "photorealistic"}
                  onClick={() => setActiveSection("photorealistic")}
                />
                <NavItem
                  icon={<RefreshCw className="h-4 w-4" />}
                  title="Integration Flow"
                  active={activeSection === "integration"}
                  onClick={() => setActiveSection("integration")}
                />
                <NavItem
                  icon={<Code className="h-4 w-4" />}
                  title="API Reference"
                  active={activeSection === "api-reference"}
                  onClick={() => setActiveSection("api-reference")}
                />
                <NavItem
                  icon={<BookOpen className="h-4 w-4" />}
                  title="Postman Collection"
                  active={activeSection === "postman-collection"}
                  onClick={() => setActiveSection("postman-collection")}
                />
                <NavItem
                  icon={<BookOpen className="h-4 w-4" />}
                  title="Postman Guide"
                  active={activeSection === "postman-guide"}
                  onClick={() => setActiveSection("postman-guide")}
                />
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeSection === "overview" && <Overview />}
            {activeSection === "authentication" && <Authentication />}
            {activeSection === "models" && <Models />}
            {activeSection === "configuration" && <Configuration />}
            {activeSection === "dimensions" && <Dimensions />}
            {activeSection === "visualizations" && <Visualizations />}
            {activeSection === "photorealistic" && <Photorealistic />}
            {activeSection === "integration" && <Integration />}
            {activeSection === "api-reference" && <ApiReference />}
            {activeSection === "postman-collection" && <PostmanCollection />}
            {activeSection === "postman-guide" && <PostmanGuide />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">© 2025 Window Configurator - API Documentation</span>
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

function NavItem({
  icon,
  title,
  active,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
        active ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className={`mr-2 ${active ? "text-orange-500" : "text-gray-500"}`}>{icon}</span>
      {title}
    </button>
  )
}
