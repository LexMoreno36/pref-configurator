import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Models } from "@/components/documentation/models"
import { Configuration } from "@/components/documentation/configuration"
import { Dimensions } from "@/components/documentation/dimensions"
import { Visualizations } from "@/components/documentation/visualizations"
import { Integration } from "@/components/documentation/integration"
import { Authentication } from "@/components/documentation/authentication"
import { ApiReference } from "@/components/documentation/api-reference"
import { Photorealistic } from "@/components/documentation/photorealistic"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Window Configurator API Documentation</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="photorealistic">Photorealistic</TabsTrigger>
          <TabsTrigger value="reference">API Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Integration />
        </TabsContent>

        <TabsContent value="auth">
          <Authentication />
        </TabsContent>

        <TabsContent value="models">
          <Models />
        </TabsContent>

        <TabsContent value="config">
          <Configuration />
        </TabsContent>

        <TabsContent value="dimensions">
          <Dimensions />
        </TabsContent>

        <TabsContent value="visualizations">
          <Visualizations />
        </TabsContent>

        <TabsContent value="photorealistic">
          <Photorealistic />
        </TabsContent>

        <TabsContent value="reference">
          <ApiReference />
        </TabsContent>
      </Tabs>
    </div>
  )
}
