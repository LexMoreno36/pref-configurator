import { Code } from "lucide-react"
import { API_CONFIG } from "@/lib/api/constants"

export function Integration() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Integration Guide</h2>
        <p className="mt-2 text-gray-600">
          This guide provides step-by-step instructions for integrating the Window Configurator API into your
          application.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Complete Integration Flow</h3>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Authenticate with the API to get an access token</li>
            <li>Fetch available model codes to present to the user</li>
            <li>Create a model instance with the selected model code</li>
            <li>Fetch configuration options for the model</li>
            <li>Present configuration options to the user</li>
            <li>Update configuration options based on user selections</li>
            <li>Fetch and update dimensions if needed</li>
            <li>Generate visualizations of the configured model</li>
            <li>Save the configuration for order processing</li>
          </ol>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Example Integration</h3>
        <p className="mt-2 text-gray-600">
          Here's a complete example of integrating the Window Configurator API into a web application:
        </p>

        <pre className="mt-4 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
          {`// Step 1: Authenticate with the API
async function authenticate() {
  const response = await fetch('${API_CONFIG.baseUrl}/prefweb/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: '${API_CONFIG.username}',
      password: '${API_CONFIG.password}'
    })
  });
  
  const data = await response.json();
  return data.access_token;
}

// Step 2: Fetch available model codes
async function fetchModelCodes(token) {
  const response = await fetch('${API_CONFIG.baseUrl}/prefweb/api/v1/items/codes', {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  
  const data = await response.json();
  return data.modelCodes;
}

// Step 3: Create a model instance
async function createModel(token, modelCode) {
  const response = await fetch('${API_CONFIG.baseUrl}/prefweb/api/v1/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      ModelCode: modelCode,
      IsPersistable: true
    })
  });
  
  const data = await response.json();
  return data.itemId;
}

// Step 4: Fetch configuration options
async function fetchOptions(token, modelId) {
  const response = await fetch(\`${API_CONFIG.baseUrl}/Cloud.ModelService/api/v1/Options/model?modelId=\${modelId}\`, {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  
  const data = await response.json();
  return data.Options;
}

// Step 5: Update a configuration option
async function updateOption(token, itemId, optionName, optionValue) {
  const command = \`<Commands>
    <cmd:Command name='Model.SetOptionValue' xmlns:cmd='http://www.preference.com/XMLSchemas/2006/PrefCAD.Command'>
      <cmd:Parameter name='name' type='string' value='\${optionName}' />
      <cmd:Parameter name='value' type='string' value='\${optionValue}' />
      <cmd:Parameter name='regenerate' type='bool' value='0' />
      <cmd:Parameter name='sendEvents' type='bool' value='1' />
      <cmd:Parameter name='applyAllBinded' type='bool' value='1' />
    </cmd:Command>
  </Commands>\`;

  const response = await fetch(\`${API_CONFIG.baseUrl}/erp.hydrawebapi.service/v1/prefItems/\${itemId}/ExecuteCommand\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      command: command
    })
  });
  
  const data = await response.json();
  return data;
}

// Step 6: Generate a visualization
async function generateVisualization(token, itemId, imageType = 5) {
  const response = await fetch(\`${API_CONFIG.baseUrl}/prefweb/api/v1/integration/sap/sales/items/\${itemId}/get-image\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      imageType: imageType,
      width: 800,
      height: 600,
      units: 0,
      usePrefOne: true
    })
  });
  
  const data = await response.json();
  return data.base64;
}

// Main integration function
async function integrateWindowConfigurator() {
  try {
    // Step 1: Authenticate
    const token = await authenticate();
    
    // Step 2: Fetch model codes
    const modelCodes = await fetchModelCodes(token);
    console.log('Available models:', modelCodes);
    
    // Step 3: Create a model instance
    const modelId = await createModel(token, modelCodes[0]);
    console.log('Created model with ID:', modelId);
    
    // Step 4: Fetch configuration options
    const options = await fetchOptions(token, modelId);
    console.log('Configuration options:', options);
    
    // Step 5: Update a configuration option (example)
    const updateResult = await updateOption(token, modelId, '${API_CONFIG.makerPrefix}INNER_COLOR', '${API_CONFIG.makerPrefix}45_9T10');
    console.log('Update result:', updateResult);
    
    // Step 6: Generate a visualization
    const visualization = await generateVisualization(token, modelId);
    console.log('Generated visualization');
    
    // Process the visualization (example for SVG)
    const svgString = processSvgResponseToString(visualization);
    document.getElementById('visualization').innerHTML = svgString;
    
  } catch (error) {
    console.error('Integration error:', error);
  }
}

// Helper function to process SVG visualization
function processSvgResponseToString(encodedSvg) {
  // Remove quotes if they exist
  let cleanBase64 = encodedSvg;
  if (cleanBase64.startsWith('"') && cleanBase64.endsWith('"')) {
    cleanBase64 = cleanBase64.slice(1, -1);
  }

  // Decode base64 to binary data
  const binaryString = atob(cleanBase64);

  // Convert binary data to Uint8Array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Decode as UTF-16LE (Little Endian)
  const decoder = new TextDecoder("utf-16le");
  const svgString = decoder.decode(bytes);

  return svgString;
}

// Call the integration function
integrateWindowConfigurator();`}
        </pre>

        <h3 className="mt-6 text-lg font-semibold text-gray-800">Error Handling</h3>
        <p className="mt-2 text-gray-600">Implement proper error handling to ensure a smooth user experience:</p>

        <pre className="mt-4 rounded bg-gray-900 p-3 text-sm text-white overflow-auto">
          {`// Example error handling
async function fetchWithErrorHandling(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json().catch(() => ({}));
      throw new Error(\`API error: \${response.status} \${response.statusText}\${errorData.message ? ' - ' + errorData.message : ''}\`);
    }
    
    return await response.json();
  } catch (error) {
    // Handle network errors
    console.error('API request failed:', error);
    
    // Implement retry logic for network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      // This is likely a network error, consider retrying
      return await retryFetch(url, options);
    }
    
    // Re-throw the error for the caller to handle
    throw error;
  }
}

// Retry logic
async function retryFetch(url, options, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Wait before retrying
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
      
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      lastError = error;
    }
  }
  
  throw new Error(\`Failed after \${maxRetries} attempts: \${lastError.message}\`);
}`}
        </pre>

        <div className="mt-6 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Code className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Integration Best Practices</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Implement token refresh logic to handle token expiration</li>
                  <li>Cache configuration options and visualizations to improve performance</li>
                  <li>Implement proper error handling and retry logic for API requests</li>
                  <li>Use a state management solution to track the configuration state</li>
                  <li>Consider implementing a backend proxy to secure your API credentials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
