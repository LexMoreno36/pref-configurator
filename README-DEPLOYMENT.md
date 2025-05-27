# Preference Configurator - Deployment Guide

This guide explains how to deploy the Preference Configurator application on a Windows server using the automated PowerShell deployment script.

## Overview

The deployment process is fully automated through a PowerShell script that handles:
- Installing all prerequisites (Git, Node.js, PM2)
- Cloning/updating the repository
- Building the application
- Setting up process management with PM2
- Configuring auto-startup

## Prerequisites

- **Windows Server** (Windows 10/11 or Windows Server 2016+)
- **Administrator privileges** (required for installing software and configuring services)
- **Internet connection** (for downloading installers and cloning repository)

## Quick Start

1. **Download the deployment script** to your server
2. **Open PowerShell as Administrator**
3. **Navigate** to the directory containing the script
4. **Execute the script**:

```powershell
.\Deploy-NextApp.ps1
```

That's it! The script will handle everything automatically.

## What the Script Does

### 1. Prerequisites Installation
The script automatically detects and installs required software:

- **Package Manager Detection**: Tries to use Winget first, falls back to Chocolatey
- **Git**: For repository management
- **Node.js LTS**: JavaScript runtime
- **PM2**: Process manager for Node.js applications
- **PM2 Windows Startup**: For auto-startup configuration

### 2. Repository Management
- **First deployment**: Clones the repository to `C:\cloud-ecommerce`
- **Updates**: Fetches latest changes and performs hard reset to remote branch
- **Branch handling**: Automatically works with the current branch

### 3. Application Build
- **Dependencies**: Runs `npm install --legacy-peer-deps`
- **Build**: Executes `npm run build` to create production build
- **Validation**: Checks for required configuration files

### 4. Process Management
- **PM2 Configuration**: Uses `ecosystem.config.js` for process settings
- **Production Mode**: Starts application in production environment
- **Auto-startup**: Configures PM2 to start automatically on system boot
- **Process Persistence**: Saves current process list for recovery

## Configuration Files

### ecosystem.config.js
This file configures how PM2 manages the application:

```javascript
module.exports = {
  apps: [{
    name: "pref-configurator",
    script: "C:/cloud-ecommerce/node_modules/next/dist/bin/next",
    args: "start",
    cwd: "C:/cloud-ecommerce/",
    interpreter: "node",
    env_production: {
      NODE_ENV: "production",
      PORT: 3636
    }
  }]
}
```

### Environment Variables
The application requires environment variables for configuration. Create either:
- `.env.production` (recommended for production)
- `.env` (fallback)

Required variables include:
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_API_USERNAME`
- `NEXT_PUBLIC_API_PASSWORD`
- `NEXT_PUBLIC_USD_SERVICE_BASE_URL`
- And others as specified in `.env.local.example`

## Customization

### Custom Installation Directory
```powershell
.\Deploy-NextApp.ps1 -ProjectDir "C:\my-custom-path"
```

### Custom Repository URL
```powershell
.\Deploy-NextApp.ps1 -RepoUrl "https://github.com/myuser/myrepo.git"
```

### Both Custom Parameters
```powershell
.\Deploy-NextApp.ps1 -ProjectDir "C:\my-app" -RepoUrl "https://github.com/myuser/myrepo.git"
```

## Post-Deployment Management

### Check Application Status
```powershell
pm2 list
```

### View Application Logs
```powershell
pm2 logs pref-configurator
```

### Monitor Application
```powershell
pm2 monit
```

### Restart Application
```powershell
pm2 restart pref-configurator
```

### Stop Application
```powershell
pm2 stop pref-configurator
```

## Updates

To update the application to the latest version, simply run the deployment script again:

```powershell
.\Deploy-NextApp.ps1
```

The script will:
1. Pull the latest changes from the repository
2. Install any new dependencies
3. Rebuild the application
4. Restart the PM2 process

## Troubleshooting

### Script Execution Policy
If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Package Manager Issues
- **Winget not found**: The script will automatically try to install Chocolatey
- **Chocolatey installation fails**: Install manually from [chocolatey.org](https://chocolatey.org/install)

### PM2 Command Not Found
If PM2 is not recognized after installation:
1. Close and reopen PowerShell as Administrator
2. Or restart the system
3. Check that npm global path is in your PATH environment variable

### Application Not Starting
1. Check PM2 logs: `pm2 logs pref-configurator`
2. Verify environment variables are set correctly
3. Ensure port 3636 is not in use by another application
4. Check that all required dependencies are installed

### Auto-startup Not Working
1. Verify PM2 startup is installed: `pm2-startup install`
2. Save current process list: `pm2 save`
3. Restart the system to test

## Network Configuration

The application runs on **port 3636** by default. Ensure:
- Port 3636 is open in Windows Firewall
- Any reverse proxy (IIS, nginx) is configured to forward to localhost:3636
- Network security groups allow traffic on this port

## Security Considerations

- The script requires Administrator privileges for system-wide installations
- Environment variables may contain sensitive information - secure the `.env` files appropriately
- Consider running the application behind a reverse proxy for additional security
- Regularly update Node.js and dependencies for security patches

## Support

For deployment issues:
1. Check the PowerShell execution logs
2. Verify all prerequisites are properly installed
3. Ensure environment variables are correctly configured
4. Review PM2 logs for application-specific errors

The deployment script provides detailed logging throughout the process to help identify any issues.
