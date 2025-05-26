import { validateEnvironment } from "./api/constants"

export function checkEnvironment() {
  const { valid, missing } = validateEnvironment()

  if (!valid) {
    console.warn("⚠️ Missing required environment variables:")
    missing.forEach((varName) => {
      console.warn(`  - ${varName}`)
    })
    console.warn("The application may not function correctly without these variables.")

    // In development, we can show more helpful information
    if (process.env.NODE_ENV === "development") {
      console.info("💡 Tip: Create a .env.local file with these variables. See .env.local.example for reference.")
    }
  }

  return valid
}
