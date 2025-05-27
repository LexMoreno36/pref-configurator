"use client"

import { ImageIcon, PackageIcon, CodeIcon } from "lucide-react"
import { EndpointCard } from "./endpoint-card"
import { API_CONFIG } from "@/lib/api/constants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Visualizations() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Visualizations</h2>
        <p className="mt-2 text-gray-600">
          The Visualizations API allows you to generate 2D and 3D representations of configured window models.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Visualization Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Configure the window model with desired options and dimensions</li>
            <li>Request a visualization (SVG for 2D or GLTF for 3D)</li>
            <li>Display the visualization to the user</li>
            <li>Regenerate visualizations when configuration changes</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Endpoints</h3>
        <div className="mt-4 space-y-4">
          <EndpointCard
            method="POST"
            endpoint={`${API_CONFIG.baseUrl}/prefweb/api/v1/integration/sap/sales/items/{itemId}/get-image`}
            description="Generate a visualization of the configured model"
            requestBody={{
              imageType: 5, // 5 for SVG, 11 for GLTF (3D)
              width: 800,
              height: 600,
              units: 0,
              usePrefOne: true,
              visualPropertiesXML: "",
            }}
            responseExample={{
              base64: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIj4...",
            }}
            notes="The response contains a base64-encoded representation of the visualization. For SVG, this is a UTF-16 encoded SVG string. For GLTF, this is a binary GLTF model."
          />

          <EndpointCard
            method="POST"
            endpoint={`${API_CONFIG.usdServiceUrl}/usd-service/v1/Session/New`}
            description="Create a new USD service session for photorealistic rendering"
            requestBody={{
              system: API_CONFIG.system,
              itemId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            }}
            responseExample={{
              sessionId: "session-12345",
              status: "ready",
            }}
            notes="Create a session before requesting photorealistic PNG images. The session ID is used in subsequent requests."
          />

          <EndpointCard
            method="GET"
            endpoint={`${API_CONFIG.usdServiceUrl}/usd-service/v1/Images?sessionId={sessionId}`}
            description="Generate photorealistic PNG images of the configured model"
            responseExample={{
              images: [
                {
                  url: "http://example.com/images/view1.png",
                  angle: "front",
                },
                {
                  url: "http://example.com/images/view2.png",
                  angle: "perspective",
                },
              ],
            }}
            notes="The response contains an array of URLs to photorealistic PNG images of the configured model from different angles."
          />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Visualization Types</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  imageType Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Use Case
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2D SVG</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SVG (XML)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Technical drawings, dimensions</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3D Model</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">11</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GLTF/GLB</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Interactive 3D preview</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PNG Image</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PNG</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Static images for thumbnails</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Processing Visualizations</h3>
        <p className="mt-2 text-gray-600">
          The visualization data requires specific processing depending on the format. Our API returns data in a unique
          format that requires special handling:
        </p>

        <Tabs defaultValue="svg" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="svg">SVG Decoding</TabsTrigger>
            <TabsTrigger value="gltf">GLTF Decoding</TabsTrigger>
          </TabsList>

          <TabsContent value="svg" className="mt-4">
            <p className="mb-2 text-sm text-gray-600">SVG responses are UTF-16LE encoded and need special handling:</p>
            <pre className="rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
              {`/**
 * Processes a base64 encoded SVG string with UTF-16 encoding
 * @param encodedSvg The base64 encoded SVG string (may be surrounded by quotes)
 * @returns The SVG as a string
 */
export function processSvgResponseToString(encodedSvg: string): string {
  try {
    // Remove quotes if they exist
    let cleanBase64 = encodedSvg
    if (cleanBase64.startsWith('"') && cleanBase64.endsWith('"')) {
      cleanBase64 = cleanBase64.slice(1, -1)
    }

    // Decode base64 to binary data
    const binaryString = atob(cleanBase64)

    // Convert binary data to Uint8Array
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Decode as UTF-16LE (Little Endian)
    const decoder = new TextDecoder("utf-16le")
    const svgString = decoder.decode(bytes)

    return svgString
  } catch (error) {
    console.error("Error processing SVG to string:", error)
    return ""
  }
}

/**
 * Creates an SVG element from a string
 * @param svgString The SVG as a string
 * @returns The SVG element that can be added to the DOM
 */
export function createSvgElement(svgString: string): SVGSVGElement | null {
  try {
    // Parse the XML to return a DOM/SVG element
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml")

    // Check for parsing errors
    const parserError = svgDoc.querySelector("parsererror")
    if (parserError) {
      console.error("SVG parsing error:", parserError)
      return null
    }

    return svgDoc.documentElement as SVGSVGElement
  } catch (error) {
    console.error("Error creating SVG element:", error)
    return null
  }
}

// Usage example
async function displaySvg(modelGuid) {
  try {
    // Fetch the SVG data
    const svgBase64 = await fetchSvgImage(modelGuid, width, height)
    
    // Process the SVG string
    const svgString = processSvgResponseToString(svgBase64)
    
    if (svgString) {
      // Option 1: Set as innerHTML (simple but less flexible)
      document.getElementById('svg-container').innerHTML = svgString
      
      // Option 2: Create and append SVG element (more flexible)
      const svgElement = createSvgElement(svgString)
      if (svgElement) {
        const container = document.getElementById('svg-container')
        container.innerHTML = ''
        container.appendChild(svgElement)
      }
    }
  } catch (error) {
    console.error("Failed to display SVG:", error)
  }
}`}
            </pre>
          </TabsContent>

          <TabsContent value="gltf" className="mt-4">
            <p className="mb-2 text-sm text-gray-600">
              GLTF responses from our API require a double-decode process and special handling:
            </p>
            <pre className="rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
              {`/**
 * Creates a URL from a base64-encoded GLTF/GLB model
 * @param base64String The base64-encoded model data
 * @returns Promise with the URL and a dispose function
 */
export function createModelUrlFromBase64(base64String: string) {
  return new Promise<{
    url: string
    dispose: () => void
  }>(async (resolve, reject) => {
    try {
      // Step 1: Clean the base64 string (remove quotes if present)
      let cleanBase64 = base64String
      if (cleanBase64.startsWith('"') && cleanBase64.endsWith('"')) {
        cleanBase64 = cleanBase64.slice(1, -1)
      }

      // Step 2: Handle data URLs if present
      if (cleanBase64.includes("base64,")) {
        cleanBase64 = cleanBase64.split("base64,")[1]
      }

      // Step 3: First decode - our API returns a base64 string that contains another base64 string
      const firstDecode = atob(cleanBase64)

      // Step 4: Clean the inner base64 string
      let innerB64 = firstDecode.trim()
      if (
        (innerB64.startsWith('"') && innerB64.endsWith('"')) ||
        (innerB64.startsWith("'") && innerB64.endsWith("'"))
      ) {
        innerB64 = JSON.parse(innerB64)
      }
      innerB64 = innerB64.replace(/\\s+/g, "")

      // Step 5: Second decode - decode the inner base64 string to get the actual binary data
      const secondDecode = atob(innerB64)

      // Step 6: Detect if it's JSON (GLTF) or binary (GLB)
      let isJson = false
      try {
        JSON.parse(secondDecode)
        isJson = true
      } catch (e) {
        // Not valid JSON, likely binary GLB format
      }

      // Step 7: Convert to Uint8Array for Blob creation
      const bytes = new Uint8Array(secondDecode.length)
      for (let i = 0; i < secondDecode.length; i++) {
        bytes[i] = secondDecode.charCodeAt(i)
      }

      // Step 8: Detect GLB format by checking magic bytes
      const isGlb = bytes.length > 4 && bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46

      // Step 9: Set the correct MIME type
      let mimeType
      if (isGlb) {
        mimeType = "model/gltf-binary"
      } else if (isJson) {
        mimeType = "model/gltf+json"
      } else {
        mimeType = "model/gltf-binary" // Default to binary
      }

      // Step 10: Create a Blob and URL
      const blob = new Blob([bytes], { type: mimeType })
      const url = URL.createObjectURL(blob)

      // Step 11: Return the URL and a dispose function
      const dispose = () => {
        URL.revokeObjectURL(url)
      }

      resolve({ url, dispose })
    } catch (error) {
      console.error("Error creating model URL:", error)
      reject(new Error(\`Error converting base64 to URL: \${error instanceof Error ? error.message : String(error)}\`))
    }
  })
}

// Usage with PrefViewer
async function loadModelWithPrefViewer(modelGuid) {
  try {
    // Fetch the GLTF data from the API
    const base64Data = await fetchGltfModel(modelGuid)
    
    // Process the GLTF data to get a URL
    const { url, dispose } = await createModelUrlFromBase64(base64Data)
    
    // Get or create the pref-viewer element
    const container = document.getElementById('model-container')
    let viewer = container.querySelector('pref-viewer')
    if (!viewer) {
      viewer = document.createElement('pref-viewer')
      viewer.style.width = '100%'
      viewer.style.height = '100%'
      container.appendChild(viewer)
    }
    
    // Set the model URL
    viewer.setAttribute('model', url)
    
    // Clean up the URL when the component is removed or updated
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'model' && 
            viewer.getAttribute('model') !== url) {
          dispose()
          observer.disconnect()
        }
      })
    })
    
    observer.observe(viewer, { attributes: true })
    
  } catch (error) {
    console.error("Failed to load 3D model:", error)
  }
}`}
            </pre>
          </TabsContent>
        </Tabs>

        <h3 className="mt-6 text-lg font-semibold text-gray-800" id="pref-viewer">
          <PackageIcon className="inline-block mr-2 h-5 w-5" />
          Using the PrefViewer Component
        </h3>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-md font-semibold text-gray-800">Installation</h4>
            <p className="mt-2 text-gray-600">
              For displaying 3D models, use our official PrefViewer component. It's a custom element that provides an
              easy-to-use interface for 3D visualization:
            </p>
            <pre className="mt-2 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
              {`npm install @preference-sl/pref-viewer@2.0.0`}
            </pre>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-md font-semibold text-gray-800">Basic Usage</h4>
            <p className="mt-2 text-gray-600">
              After installation, you can use the component as a custom HTML element:
            </p>
            <pre className="mt-2 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
              {`<!-- Import the component -->
<script type="module">
  import '@preference-sl/pref-viewer';
</script>

<!-- Use the component with a direct URL -->
<pref-viewer model="path/to/model.gltf" style="width: 500px; height: 400px;"></pref-viewer>`}
            </pre>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-md font-semibold text-gray-800">Integration with API</h4>
            <p className="mt-2 text-gray-600">
              To use PrefViewer with our API's GLTF responses, you need to process the base64 data and set the model
              attribute:
            </p>
            <pre className="mt-2 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
              {`// Import the component and processing utility
import '@preference-sl/pref-viewer';
import { createModelUrlFromBase64 } from './utils';

// Example function to load a model from the API
async function loadModelWithPrefViewer(modelGuid) {
  try {
    // 1. Get the container element
    const container = document.getElementById('model-container');
    
    // 2. Create the pref-viewer element if it doesn't exist
    let viewer = container.querySelector('pref-viewer');
    if (!viewer) {
      viewer = document.createElement('pref-viewer');
      viewer.style.width = '100%';
      viewer.style.height = '100%';
      container.appendChild(viewer);
    }
    
    // 3. Fetch the GLTF data from the API
    const base64Data = await fetchGltfModel(modelGuid);
    
    // 4. Process the data to get a URL
    const { url, dispose } = await createModelUrlFromBase64(base64Data);
    
    // 5. Set the model attribute to load the 3D model
    viewer.setAttribute('model', url);
    
    // 6. Clean up the URL when the component is removed or updated
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'model' && 
            viewer.getAttribute('model') !== url) {
          dispose();
          observer.disconnect();
        }
      });
    });
    
    observer.observe(viewer, { attributes: true });
    
    // Also clean up if the viewer is removed
    const parentObserver = new MutationObserver((mutations) => {
      if (!document.contains(viewer)) {
        dispose();
        parentObserver.disconnect();
      }
    });
    
    parentObserver.observe(document.body, { childList: true, subtree: true });
    
  } catch (error) {
    console.error('Error loading model with PrefViewer:', error);
  }
}`}
            </pre>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-md font-semibold text-gray-800">React Integration</h4>
            <p className="mt-2 text-gray-600">For React applications, you can create a wrapper component:</p>
            <pre className="mt-2 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
              {`// PrefViewerComponent.jsx
import { useEffect, useRef } from 'react';
import '@preference-sl/pref-viewer';
import { createModelUrlFromBase64 } from '../utils/model-utils';

export default function PrefViewerComponent({ base64Data, width = '100%', height = '400px' }) {
  const containerRef = useRef(null);
  const urlRef = useRef(null);
  const disposeRef = useRef(null);

  useEffect(() => {
    // Clean up previous URL if it exists
    if (disposeRef.current) {
      disposeRef.current();
      disposeRef.current = null;
      urlRef.current = null;
    }

    if (!base64Data || !containerRef.current) return;

    // Process the base64 data
    createModelUrlFromBase64(base64Data)
      .then(({ url, dispose }) => {
        // Store references for cleanup
        urlRef.current = url;
        disposeRef.current = dispose;

        // Create or update the viewer
        let viewer = containerRef.current.querySelector('pref-viewer');
        if (!viewer) {
          viewer = document.createElement('pref-viewer');
          viewer.style.width = '100%';
          viewer.style.height = '100%';
          containerRef.current.appendChild(viewer);
        }

        // Set the model URL
        viewer.setAttribute('model', url);
      })
      .catch(error => {
        console.error('Error processing model data:', error);
      });

    // Cleanup function
    return () => {
      if (disposeRef.current) {
        disposeRef.current();
        disposeRef.current = null;
        urlRef.current = null;
      }
    };
  }, [base64Data]);

  return (
    <div ref={containerRef} style={{ width, height }}></div>
  );
}

// Usage
function ModelViewer({ modelGuid }) {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!modelGuid) return;
    
    setLoading(true);
    fetchGltfModel(modelGuid)
      .then(data => {
        setModelData(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setModelData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [modelGuid]);

  if (loading) return <div>Loading model...</div>;
  if (error) return <div>Error loading model: {error}</div>;
  if (!modelData) return <div>No model data available</div>;

  return <PrefViewerComponent base64Data={modelData} height="500px" />;
}`}
            </pre>
          </div>
        </div>

        <div className="mt-6 rounded-md bg-amber-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ImageIcon className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Important Notes</h3>
              <div className="mt-2 text-sm text-amber-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Double Decoding:</strong> Our API returns base64 data that contains another layer of base64
                    encoding for GLTF models
                  </li>
                  <li>
                    <strong>UTF-16LE:</strong> SVG data is encoded in UTF-16 Little Endian format, not standard UTF-8
                  </li>
                  <li>
                    <strong>Memory Management:</strong> Always call the dispose function when done with the model URL to
                    prevent memory leaks
                  </li>
                  <li>
                    <strong>Error Handling:</strong> Implement robust error handling as shown in the examples
                  </li>
                  <li>
                    <strong>Format Detection:</strong> The code automatically detects if the GLTF is in JSON or binary
                    GLB format
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CodeIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Implementation Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Use PrefViewer:</strong> Use our{" "}
                    <a href="#pref-viewer" className="underline">
                      @preference-sl/pref-viewer
                    </a>{" "}
                    component for displaying 3D models
                  </li>
                  <li>Cache visualizations to reduce API calls</li>
                  <li>Regenerate visualizations when configuration changes</li>
                  <li>For SVG, you can directly insert the processed SVG into the DOM</li>
                  <li>Consider generating lower-resolution thumbnails for product listings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
