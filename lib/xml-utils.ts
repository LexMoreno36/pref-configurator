import { API_CONFIG } from "@/lib/api/constants"

/**
 * Parse XML string to extract the value of the <cmd:Parameter name="result" …/>
 * Automatically unquotes a JSON-encoded XML string (the leading/trailing '"' and '\\"'s).
 * @param rawXml The raw response text (may be JSON-encoded).
 * @returns The extracted "L=2,500;L1=861.17;…" string, or null if not found.
 */
export function parseCommandResultValue(rawXml: string): string | null {
  let xml = rawXml.trim()

  // If it looks like a JSON string (starts+ends with "), unwrap it
  if (xml.startsWith('"') && xml.endsWith('"')) {
    try {
      xml = JSON.parse(xml)
    } catch {
      // fall back to manual unescape if JSON.parse fails
      xml = xml.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
    }
  }

  // Now run a regex against the real XML
  const m = xml.match(/<cmd:Parameter\s+name="result"[^>]*\svalue="([^"]*)"/)
  return m?.[1] ?? null
}

/**
 * Parse dimensions string into a dimensions object
 * @param dimensionsString e.g. "L=2,500;L1=861.17;L2=777.67;A=2,500;"
 * @returns { L: 2500, L1: 861.17, L2: 777.67, A: 2500 }
 */
export function parseDimensionsString(dimensionsString: string): Record<string, number> {
  const dims: Record<string, number> = {}

  // split, drop empty segments
  for (const part of dimensionsString.split(";")) {
    const [key, raw] = part.split("=")
    if (!key || raw == null) continue

    // strip any thousands-commas, then parseFloat
    const normalized = raw.replace(/,/g, "")
    const num = Number.parseFloat(normalized)
    if (!isNaN(num)) {
      dims[key.trim()] = num
    }
  }

  return dims
}

/**
 * Create XML command for setting a dimension value
 * @param dimensionName The full dimension name (e.g. "L2")
 * @param value The new dimension value
 * @returns XML command string
 */
export function createSetDimensionValueCommand(dimensionName: string, value: number): string {
  // Extract the letter part (name) and number part (subDimensionIndex)
  const letterMatch = dimensionName.match(/^([A-Za-z]+)/)
  const numberMatch = dimensionName.match(/(\d+)$/)

  const name = letterMatch ? letterMatch[1] : dimensionName
  const subDimensionIndex = numberMatch ? Number.parseInt(numberMatch[1], 10) : 0

  // Format the value with dot as decimal separator
  const formattedValue = value.toString().replace(".", ",")

  return `<cmd:Commands xmlns:cmd='http://www.preference.com/XMLSchemas/2006/PrefCAD.Command'>
  <cmd:Command name='Model.SetDimensionValue'>
    <cmd:Parameter name='name' type='string' value='${name}' />
    <cmd:Parameter name='subDimensionIndex' type='int' value='${subDimensionIndex}' />
    <cmd:Parameter name='value' type='real' value='${formattedValue}' />
  </cmd:Command>
</cmd:Commands>`
}

/**
 * Create XML command for getting all dimensions
 * @returns XML command string for the GetDimensions command
 */
export function createGetDimensionsCommand(): string {
  return `<cmd:Commands xmlns:cmd='http://www.preference.com/XMLSchemas/2006/PrefCAD.Command'>
  <cmd:Command name='Model.GetDimensions'>
  </cmd:Command>
</cmd:Commands>`
}

/**
 * Create XML command for setting option values
 * @param optionName The option name
 * @param optionValue The option value
 * @returns XML command string for the SetOptionsValues command
 */
export function createSetOptionValueCommand(optionName: string, optionValue: string): string {
  // Extract the actual option name from the format (e.g., "preference~OUTER_COLOR" -> "OUTER_COLOR")
  const extractedName = optionName.includes("~") ? optionName.split("~")[1] : optionName

  // Extract the actual option value without the prefix (e.g., "reynaers~49_7T39" -> "49_7T39")
  const extractedValue = optionValue.includes("~") ? optionValue.split("~")[1] : optionValue

  // Apply maker-specific prefix to both name and value (configurable per maker)
  const prefixedName = `${API_CONFIG.makerPrefix}${extractedName}`
  const prefixedValue = `${API_CONFIG.makerPrefix}${extractedValue}`

  return `
        <cmd:Commands xmlns:cmd="http://www.preference.com/XMLSchemas/2006/PrefCAD.Command">
            <cmd:Command name="Model.SetOptionValue">
                <cmd:Parameter name="name" type="string" value="${prefixedName}" />
                <cmd:Parameter name="value" type="string" value="${prefixedValue}" />
                <cmd:Parameter name="regenerate" type="bool" value="1" />
                <cmd:Parameter name="sendEvents" type="bool" value="1" />
                <cmd:Parameter name="applyAllBinded" type="bool" value="1" />
            </cmd:Command>
        </cmd:Commands>`
}
