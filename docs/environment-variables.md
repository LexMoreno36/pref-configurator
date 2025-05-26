# Environment Variables Guide

This document explains how to set up and use environment variables for the Window Configurator application.

## Required Environment Variables

The following environment variables are required for the application to function properly:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Base URL for the API | `https://api.example.com` |
| `NEXT_PUBLIC_API_USERNAME` | Username for API authentication | `api@example.com` |
| `NEXT_PUBLIC_API_PASSWORD` | Password for API authentication | `your_secure_password` |
| `NEXT_PUBLIC_DEFAULT_MAKER` | Default manufacturer identifier | `example` |
| `NEXT_PUBLIC_MAKER_PREFIX` | Prefix for option names and values | `EX_` |
| `NEXT_PUBLIC_DEFAULT_SYSTEM` | Default system identifier | `ExampleSystem` |
| `NEXT_PUBLIC_UI_DEFINITION_NAME` | UI definition name | `uidefinition` |
| `NEXT_PUBLIC_OPTION_LIST_NAME` | Option list name | `sceneoptions` |

## Optional Environment Variables

These variables are optional and will use sensible defaults if not provided:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_MAKER_CAPITALIZED` | Capitalized manufacturer name | Capitalized version of `NEXT_PUBLIC_DEFAULT_MAKER` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Whether to use mock data | `false` |

## Local Development

For local development, follow these steps:

1. Copy the `.env.local.example` file to a new file named `.env.local`:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Edit the `.env.local` file and fill in all the required values.

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Client-Specific Configuration

When setting up the application for different clients, you'll need to update the environment variables accordingly:

### Example: Client A

\`\`\`
NEXT_PUBLIC_BASE_URL=https://clienta-api.example.com
NEXT_PUBLIC_DEFAULT_MAKER=clienta
NEXT_PUBLIC_MAKER_PREFIX=CA_
NEXT_PUBLIC_DEFAULT_SYSTEM=ClientASystem
\`\`\`

### Example: Client B

\`\`\`
NEXT_PUBLIC_BASE_URL=https://clientb-api.example.com
NEXT_PUBLIC_DEFAULT_MAKER=clientb
NEXT_PUBLIC_MAKER_PREFIX=CB_
NEXT_PUBLIC_DEFAULT_SYSTEM=ClientBSystem
\`\`\`

## Production Deployment

For production deployment, set these environment variables in your hosting platform (e.g., Vercel, Netlify, etc.).

### Vercel

In Vercel, you can set environment variables in the project settings:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable and its value
4. Deploy your application

## Troubleshooting

If you see warnings about missing environment variables when starting the application, check that all required variables are set in your `.env.local` file or in your hosting platform's environment settings.

The application will log specific warnings about which variables are missing.
