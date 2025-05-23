/**
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
