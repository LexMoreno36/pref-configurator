#Requires -RunAsAdministrator

<#
.SYNOPSIS
    Script para desplegar una aplicación Next.js (Node.js) en un servidor Windows.
    Gestiona la instalación de prerrequisitos (Git, Node.js, PM2), la obtención del código fuente,
    la construcción de la aplicación y el inicio con PM2, incluyendo el autoarranque.
    Intenta usar Winget y, si no está disponible, recurre a Chocolatey (instalándolo si es necesario).

.DESCRIPTION
    Este script automatiza los siguientes pasos:
    1. Verifica privilegios de administrador.
    2. Define variables de configuración (directorio del proyecto, URL del repositorio) con valores por defecto.
    3. Determina el gestor de paquetes a usar (Winget o Chocolatey).
    4. Instala Chocolatey si es necesario y el usuario lo aprueba.
    5. Instala Git y Node.js (LTS) usando el gestor de paquetes disponible, y configura sus PATH.
    6. Instala PM2 globalmente usando npm.
    7. Clona el repositorio o actualiza el código existente.
    8. Ejecuta 'npm install --legacy-peer-deps' y 'npm run build'.
    9. Verifica la existencia de archivos .env o .env.production.
    10. Inicia/reinicia la aplicación con PM2 usando 'ecosystem.config.js'.
    11. Configura PM2 para iniciarse al arrancar el sistema y guarda el estado actual.

.PARAMETER ProjectDir
    Directorio raíz donde se clonará o actualizará la aplicación.
    Por defecto: "C:\cloud-ecommerce"

.PARAMETER RepoUrl
    URL del repositorio Git.
    Por defecto: "https://bitbucket.org/preferencesl/cloud-ecommerce.git"

.EXAMPLE
    .\Deploy-NextApp.ps1
    (Usa los valores por defecto para ProjectDir y RepoUrl)

.EXAMPLE
    .\Deploy-NextApp.ps1 -ProjectDir "C:\otro-proyecto" -RepoUrl "https://github.com/usuario/otro-repo.git"
    (Usa valores personalizados)

.NOTES
    Autor: Asistente de Programación
    Fecha: 27 de mayo de 2025
    Requiere: Conexión a internet para descargar instaladores y clonar el repositorio.
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $false)]
    [string]$ProjectDir = "C:\cloud-ecommerce",

    [Parameter(Mandatory = $false)]
    [string]$RepoUrl = "https://bitbucket.org/preferencesl/cloud-ecommerce.git"
)

# --- Funciones Auxiliares ---

function Test-CommandExists {
    param ([string]$CommandName)
    return [bool](Get-Command $CommandName -ErrorAction SilentlyContinue)
}

function Add-ToSystemPath {
    param (
        [string]$DirectoryPath
    )
    try {
        $currentSystemPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
        if (-not ($currentSystemPath -split ';' -contains $DirectoryPath)) {
            Write-Host "Añadiendo '$DirectoryPath' al PATH del sistema..."
            $newSystemPath = "$currentSystemPath;$DirectoryPath"
            [System.Environment]::SetEnvironmentVariable("Path", $newSystemPath, "Machine")
            # Actualizar para la sesión actual
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            Write-Host "'$DirectoryPath' añadido al PATH del sistema. Es posible que necesites reiniciar la terminal o el sistema para que los cambios surtan efecto globalmente."
        } else {
            Write-Host "'$DirectoryPath' ya está en el PATH del sistema."
        }
        # Asegurar que el PATH de la sesión actual esté lo más completo posible
        if (-not ($env:Path -split ';' -contains $DirectoryPath)) {
            $env:Path = "$($env:Path);$DirectoryPath"
        }
    } catch {
        Write-Error "Error al añadir '$DirectoryPath' al PATH del sistema: $($_.Exception.Message)"
    }
}

function Add-ToUserPath {
    param (
        [string]$DirectoryPath
    )
    try {
        $currentUserPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
        if (-not ($currentUserPath -split ';' -contains $DirectoryPath)) {
            Write-Host "Añadiendo '$DirectoryPath' al PATH del usuario..."
            $newUserPath = "$currentUserPath;$DirectoryPath"
            [System.Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
             # Actualizar para la sesión actual
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            Write-Host "'$DirectoryPath' añadido al PATH del usuario. Es posible que necesites reiniciar la terminal o el sistema para que los cambios surtan efecto globalmente."
        } else {
            Write-Host "'$DirectoryPath' ya está en el PATH del usuario."
        }
        # Asegurar que el PATH de la sesión actual esté lo más completo posible
        if (-not ($env:Path -split ';' -contains $DirectoryPath)) {
            $env:Path = "$($env:Path);$DirectoryPath"
        }
    } catch {
        Write-Error "Error al añadir '$DirectoryPath' al PATH del usuario: $($_.Exception.Message)"
    }
}

function Update-EnvironmentVariables {
    Write-Host "Actualizando variables de entorno para la sesión actual..."
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    # Para Chocolatey, su comando refreshenv es útil si estuviera disponible inmediatamente
    # if (Test-CommandExists "refreshenv") { refreshenv }
}


# --- Inicio del Script ---
Write-Host "🚀 Iniciando el script de despliegue..."
Write-Host "Directorio del Proyecto: $ProjectDir"
Write-Host "URL del Repositorio: $RepoUrl"

$ParentDir = Split-Path $ProjectDir -Parent
if ($ParentDir -and (-not (Test-Path $ParentDir -PathType Container))) {
    Write-Host "Creando directorio base '$ParentDir'..."
    New-Item -ItemType Directory -Path $ParentDir -Force | Out-Null
}

# --- 1. Determinación e Instalación del Gestor de Paquetes y Prerrequisitos ---
Write-Host "`n--- Sección: Instalación de Prerrequisitos ---"

$packageManager = $null # Será 'winget' o 'choco'

# Prioridad 1: Winget
if (Test-CommandExists "winget") {
    Write-Host "✅ Winget encontrado. Se usará Winget para instalar Git y Node.js."
    $packageManager = "winget"
} else {
    Write-Warning "Winget no encontrado."
    # Prioridad 2: Chocolatey
    if (Test-CommandExists "choco") {
        Write-Host "✅ Chocolatey encontrado. Se usará Chocolatey para instalar Git y Node.js."
        $packageManager = "choco"
        Update-EnvironmentVariables # Asegurar que el path de choco esté activo en la sesión
    } else {
        Write-Warning "Chocolatey no encontrado."
        $installChocoChoice = Read-Host "¿Deseas intentar instalar Chocolatey ahora? (S/N)"
        if ($installChocoChoice -match "^[SsSísSí]$") {
            Write-Host "Intentando instalar Chocolatey..."
            try {
                Set-ExecutionPolicy Bypass -Scope Process -Force;
                [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; # TLS 1.2+
                Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
                Write-Host "Chocolatey debería estar instalándose. Esto puede tomar unos momentos."
                Write-Host "Después de la instalación, el script intentará actualizar el PATH de la sesión."
                Update-EnvironmentVariables
                
                # Verificar si choco está disponible después de la instalación y actualización del PATH
                if (Test-CommandExists "choco") {
                    Write-Host "✅ Chocolatey instalado y detectado en la sesión actual."
                    $packageManager = "choco"
                } else {
                    Write-Warning "Chocolatey parece haberse instalado, pero el comando 'choco' aún no se detecta en el PATH de esta sesión."
                    Write-Warning "Por favor, CIERRA esta consola de PowerShell y VUELVE A ABRIRLA COMO ADMINISTRADOR, luego ejecuta el script de nuevo."
                    Write-Warning "Si el problema persiste, verifica la instalación de Chocolatey manualmente y asegúrate de que 'C:\ProgramData\chocolatey\bin' esté en tu PATH del sistema."
                    exit 1
                }
            } catch {
                Write-Error "Falló la instalación de Chocolatey: $($_.Exception.Message)"
                Write-Error "Por favor, instala Winget o Chocolatey manualmente y vuelve a intentarlo."
                exit 1
            }
        } else {
            Write-Error "Ni Winget ni Chocolatey están disponibles, y no se instalará Chocolatey."
            Write-Error "El script no puede continuar sin un gestor de paquetes para instalar Git y Node.js."
            exit 1
        }
    }
}

# Git
$gitDefaultPath = "C:\Program Files\Git\cmd" 
if (-not (Test-CommandExists "git")) {
    Write-Host "Git no encontrado. Intentando instalar Git usando $packageManager..."
    $gitInstalled = $false
    if ($packageManager -eq "winget") {
        try {
            winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements --source winget
            Add-ToSystemPath -DirectoryPath $gitDefaultPath
            $gitInstalled = $true
        } catch { Write-Error "Error instalando Git con Winget: $($_.Exception.Message)" }
    } elseif ($packageManager -eq "choco") {
        try {
            choco install git.install -y --no-progress
            # Chocolatey suele añadir su propio directorio bin al PATH, que contiene shims para git.
            # No es necesario añadir C:\Program Files\Git\cmd explícitamente si se instala con Choco,
            # pero sí asegurar que el PATH de Choco (C:\ProgramData\chocolatey\bin) esté activo.
            Update-EnvironmentVariables # Re-asegurar paths
            if(Test-CommandExists "git") {$gitInstalled = $true}
        } catch { Write-Error "Error instalando Git con Chocolatey: $($_.Exception.Message)" }
    }

    if ($gitInstalled) {
        Write-Host "Git instalado correctamente."
        if (-not (Test-CommandExists "git")) { # Doble chequeo post-instalación
             Write-Warning "Git se instaló, pero el comando no está disponible inmediatamente. Puede ser necesario reiniciar la consola."
        }
    } else {
        Write-Error "La instalación de Git falló. Por favor, instálalo manualmente y asegúrate de que esté en el PATH."
        exit 1
    }
} else {
    Write-Host "✅ Git ya está instalado."
    # Si Git está pero su path no, y no fue instalado por choco (que usa shims)
    if ((-not ($env:Path -split ';' -contains $gitDefaultPath)) -and (Test-Path "$gitDefaultPath\git.exe") -and ($packageManager -ne "choco" -or -not (Get-Command git).Path -match "chocolatey")) {
         Add-ToSystemPath -DirectoryPath $gitDefaultPath
    }
}

# Node.js y npm
$nodeJsDefaultPath = "C:\Program Files\nodejs"
if (-not (Test-CommandExists "node") -or -not (Test-CommandExists "npm")) {
    Write-Host "Node.js (npm) no encontrado. Intentando instalar Node.js LTS usando $packageManager..."
    $nodeInstalled = $false
    if ($packageManager -eq "winget") {
        try {
            winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements --source winget
            Add-ToSystemPath -DirectoryPath $nodeJsDefaultPath
            $nodeInstalled = $true
        } catch { Write-Error "Error instalando Node.js con Winget: $($_.Exception.Message)" }
    } elseif ($packageManager -eq "choco") {
        try {
            choco install nodejs-lts -y --no-progress
            Update-EnvironmentVariables # Re-asegurar paths
            if(Test-CommandExists "node") {$nodeInstalled = $true}
        } catch { Write-Error "Error instalando Node.js con Chocolatey: $($_.Exception.Message)" }
    }
    
    if ($nodeInstalled) {
        Write-Host "Node.js LTS instalado correctamente."
         if (-not (Test-CommandExists "node")) { # Doble chequeo post-instalación
             Write-Warning "Node.js se instaló, pero el comando no está disponible inmediatamente. Puede ser necesario reiniciar la consola."
        }
    } else {
        Write-Error "La instalación de Node.js LTS falló. Por favor, instálalo manualmente y asegúrate de que esté en el PATH."
        exit 1
    }
} else {
    Write-Host "✅ Node.js y npm ya están instalados."
     if ((-not ($env:Path -split ';' -contains $nodeJsDefaultPath)) -and (Test-Path "$nodeJsDefaultPath\node.exe") -and ($packageManager -ne "choco" -or -not (Get-Command node).Path -match "chocolatey")) {
         Add-ToSystemPath -DirectoryPath $nodeJsDefaultPath
    }
}

# PM2 (siempre con npm)
if (-not (Test-CommandExists "pm2")) {
    Write-Host "PM2 no encontrado. Intentando instalar PM2 globalmente con npm..."
    if (-not (Test-CommandExists "npm")) {
        Write-Error "NPM no está disponible. No se puede instalar PM2. Verifica la instalación de Node.js."
        exit 1
    }
    try {
        npm install -g pm2 --force
        Write-Host "PM2 instalado globalmente."
        $npmPrefix = (npm config get prefix).Trim()
        if ($npmPrefix -and (Test-Path $npmPrefix) -and -not ($env:Path -split ';' -contains $npmPrefix)) {
            Add-ToUserPath -DirectoryPath $npmPrefix # Los módulos globales de NPM suelen ir al PATH del usuario
            Update-EnvironmentVariables
        }
        if (-not (Test-CommandExists "pm2") -and $npmPrefix -and (Test-Path (Join-Path $npmPrefix "pm2.cmd"))) {
             $env:Path = "$($env:Path);$npmPrefix"
             Write-Host "PATH de la sesión actualizado para incluir PM2."
        }
    } catch {
        Write-Error "Error instalando PM2: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "✅ PM2 ya está instalado."
    # Asegurar que el path de PM2 (npm global) esté en el $env:Path
    $npmPrefix = (npm config get prefix).Trim()
    if ($npmPrefix -and (Test-Path (Join-Path $npmPrefix "pm2.cmd")) -and -not ($env:Path -split ';' -contains $npmPrefix)) {
        Add-ToUserPath -DirectoryPath $npmPrefix
        Update-EnvironmentVariables
    }
}

# Establecer PM2_HOME si no está definido
if (-not $env:PM2_HOME) {
    Write-Host "Estableciendo variable de entorno PM2_HOME a 'C:\pm2'..."
    setx /M PM2_HOME "C:\pm2" | Out-Null
    $env:PM2_HOME = "C:\pm2"
}
# Asegurar que exista el directorio PM2_HOME
if (-not (Test-Path -Path $env:PM2_HOME -PathType Container)) {
    Write-Host "Creando directorio PM2_HOME en '$env:PM2_HOME'..."
    try {
        New-Item -ItemType Directory -Path $env:PM2_HOME -Force | Out-Null
        Write-Host "✅ Directorio '$env:PM2_HOME' creado correctamente."
    } catch {
        Write-Error "❌ No se pudo crear '$env:PM2_HOME': $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "✅ El directorio PM2_HOME '$env:PM2_HOME' ya existe."
}

# Re-verificación final de PM2
if (-not (Test-CommandExists "pm2")) {
    Write-Warning "PM2 se instaló/verificó, pero el comando 'pm2' aún no está disponible en esta sesión."
    Write-Warning "Esto puede deberse a que el PATH necesita actualizarse. Intenta cerrar y reabrir PowerShell como Administrador, o reiniciar el sistema."
    $npmGlobalPathSuggestion = Invoke-Expression "npm config get prefix"
    Write-Warning "La ruta de instalación global de npm (donde debería estar PM2) parece ser: $npmGlobalPathSuggestion"
}


# --- 2. Gestión del Código Fuente ---
Write-Host "`n--- Sección: Gestión del Código Fuente ---"
# ... (El resto del script desde aquí es igual al anterior) ...

if (-not (Test-Path $ProjectDir -PathType Container)) {
    Write-Host "El directorio del proyecto '$ProjectDir' no existe. Clonando el repositorio..."
    try {
        git clone $RepoUrl $ProjectDir
        Write-Host "Repositorio clonado exitosamente."
    } catch {
        Write-Error "Error clonando el repositorio: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "El directorio del proyecto '$ProjectDir' ya existe. Actualizando el repositorio..."
    try {
        Set-Location $ProjectDir
        git fetch --all
        $currentBranch = git rev-parse --abbrev-ref HEAD
        $remoteBranch = "origin/$currentBranch"
        Write-Host "Intentando hacer reset a '$remoteBranch'..."
        git reset --hard $remoteBranch 
        git pull 
        Write-Host "Repositorio actualizado exitosamente."
    } catch {
        Write-Error "Error actualizando el repositorio: $($_.Exception.Message)"
        exit 1
    }
}

Set-Location $ProjectDir

# --- 3. Construcción de la Aplicación ---
Write-Host "`n--- Sección: Construcción de la Aplicación ---"

Write-Host "Instalando dependencias con 'npm install --legacy-peer-deps'..."
try {
    npm install --legacy-peer-deps
    Write-Host "Dependencias instaladas correctamente."
} catch {
    Write-Error "Error instalando dependencias npm: $($_.Exception.Message)"
    exit 1
}

Write-Host "Construyendo la aplicación con 'npm run build'..."
try {
    npm run build
    Write-Host "Aplicación construida correctamente."
} catch {
    Write-Error "Error construyendo la aplicación con npm: $($_.Exception.Message)"
    exit 1
}

# --- 4. Verificación del Entorno ---
Write-Host "`n--- Sección: Verificación del Entorno ---"
$envFileProd = Join-Path $ProjectDir ".env.production"
$envFileDev = Join-Path $ProjectDir ".env"

if (Test-Path $envFileProd) {
    Write-Host "✅ Archivo '$envFileProd' encontrado."
} elseif (Test-Path $envFileDev) {
    Write-Host "✅ Archivo '$envFileDev' encontrado."
    Write-Warning "Se encontró '.env' pero no '.env.production'. Asegúrate de que la configuración sea la adecuada para producción."
} else {
    Write-Warning "⚠️ No se encontró el archivo '.env.production' ni '.env' en '$ProjectDir'."
    Write-Warning "La aplicación podría no funcionar correctamente sin un archivo de configuración de entorno."
}

$ecosystemFile = Join-Path $ProjectDir "ecosystem.config.js"
if (-not (Test-Path $ecosystemFile)) {
    Write-Error "No se encontró el archivo 'ecosystem.config.js' en '$ProjectDir'. Este archivo es necesario para PM2."
    exit 1
} else {
     Write-Host "✅ Archivo 'ecosystem.config.js' encontrado."
}

# --- 5. Gestión del Proceso con PM2 ---
Write-Host "`n--- Sección: Gestión del Proceso con PM2 ---"

Write-Host "Iniciando/Reiniciando la aplicación con PM2 usando '$ecosystemFile' en entorno de producción..."
try {
    pm2 startOrRestart $ecosystemFile --env production
    Write-Host "Aplicación iniciada/reiniciada con PM2."
} catch {
    Write-Error "Error al iniciar/reiniciar la aplicación con PM2: $($_.Exception.Message)"
    exit 1
}

Write-Host "Configurando PM2 para que se inicie automáticamente con el sistema..."
try {
    # Instalar el helper de autoarranque si no existe
    if (-not (Get-Command pm2-startup -ErrorAction SilentlyContinue)) {
        Write-Host "Instalando 'pm2-windows-startup'..."
        npm install -g pm2-windows-startup
    } else {
        Write-Host "✅ 'pm2-windows-startup' ya está instalado."
    }

    # Registrar PM2 para autoarranque en cada inicio de sesión/arranque
    Write-Host "Registrando PM2 para autoarranque..."
    pm2-startup install

    Write-Host "✅ PM2 configurado para autoarranque."
} catch {
    Write-Error "Error configurando el inicio automático de PM2: $($_.Exception.Message)"
}

Write-Host "Guardando la lista actual de procesos de PM2..."
try {
    pm2 save
    Write-Host "Lista de procesos de PM2 guardada."
} catch {
    Write-Error "Error guardando la lista de procesos de PM2: $($_.Exception.Message)"
}

# --- Fin del Script ---
Write-Host "`n🎉 Script de despliegue completado."
Write-Host "Tu aplicación debería estar corriendo y configurada para iniciarse automáticamente."
Write-Host "Puedes verificar el estado con 'pm2 list' o 'pm2 monit'."

if (Get-Variable PUSHDLOCATION_STACK -Scope Global -ErrorAction SilentlyContinue) {
    Pop-Location
}