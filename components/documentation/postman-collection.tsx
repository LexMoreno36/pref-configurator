"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function PostmanCollection() {
  const handleDownloadCollection = () => {
    const fileUrl = "/ReynaersDemo.postman_collection.json"
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = "ReynaersDemo.postman_collection.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadEnvironment = () => {
    const fileUrl = "/WindowConfigurator.postman_environment.json"
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = "WindowConfigurator.postman_environment.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Postman Collection</CardTitle>
          <CardDescription>
            Download our Postman collection to quickly test and explore the Window Configurator API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This Postman collection includes all the necessary requests to interact with the Window Configurator API,
              including authentication, item creation, option handling, image rendering, and photorealistic rendering.
            </p>

            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-medium">Collection includes:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Authentication endpoints</li>
                <li>Item creation and management</li>
                <li>Configuration options handling</li>
                <li>Image generation</li>
                <li>Photorealistic rendering</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
              <Button onClick={handleDownloadCollection} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Collection
              </Button>
              <Button onClick={handleDownloadEnvironment} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Environment
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/documentation?section=postman-guide">
                <Button variant="outline">View Detailed Usage Guide</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
