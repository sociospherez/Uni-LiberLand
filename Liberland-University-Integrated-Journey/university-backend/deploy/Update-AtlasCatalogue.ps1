#Requires -Version 5.1
#Requires -RunAsAdministrator
[CmdletBinding()]
param(
    [string] $SiteName = 'UOLedu',
    [string] $InstallRoot = 'C:\Apps\LiberlandAtlas',
    [PSCredential] $ServiceCredential
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Import-Module WebAdministration

$commit = '8b9e4e157213b640e1331ae690033c587a2bdb33'
$base = "https://raw.githubusercontent.com/sociospherez/Uni-LiberLand/$commit/Liberland-University-Integrated-Journey/university-backend"
$releases = (Resolve-Path -LiteralPath (Join-Path $InstallRoot 'releases')).Path
$site = Get-Item -LiteralPath "IIS:\Sites\$SiteName"
$gateway = (Resolve-Path -LiteralPath ([Environment]::ExpandEnvironmentVariables([string] $site.physicalPath))).Path
$active = Split-Path $gateway -Parent
if ((Split-Path $gateway -Leaf) -ne 'iis' -or (Split-Path $active -Parent) -ne $releases) {
    throw 'The active site is not a managed Atlas release.'
}
$metadata = Get-Content -LiteralPath (Join-Path $active 'deployment.json') -Raw | ConvertFrom-Json
if ($metadata.siteName -ne $SiteName -or $metadata.release -ne (Split-Path $active -Leaf)) {
    throw 'The active release metadata does not match the IIS site.'
}

$files = @(
    'public/account-learning.js', 'public/certificates.js', 'public/checkout.html',
    'public/checkout.js', 'public/enrolment-journey.js', 'public/index.html',
    'public/payment-return.js', 'public/payments-ui.js', 'public/portal.js',
    'public/professional-certificates.js', 'public/script.js',
    'server/app.js', 'server/payments.js'
)
$tools = @('deploy/Publish-Iis.ps1', 'deploy/read-settings.mjs')
$id = (Get-Date -Format 'yyyyMMdd-HHmmss') + '-catalogue-' + [guid]::NewGuid().ToString('N').Substring(0, 8)
$download = Join-Path $env:TEMP ('Atlas-' + $id)
$staged = Join-Path $releases $id
$utf8 = New-Object Text.UTF8Encoding($false)
$previousProgress = $ProgressPreference
try {
    $ProgressPreference = 'SilentlyContinue'
    foreach ($file in ($files + $tools + @('package-lock.json'))) {
        Write-Host "Downloading $file"
        $target = Join-Path $download $file
        New-Item -ItemType Directory -Path (Split-Path $target -Parent) -Force | Out-Null
        Invoke-WebRequest -UseBasicParsing -Uri "$base/$file" -OutFile $target -TimeoutSec 45
    }
} finally { $ProgressPreference = $previousProgress }

$activeLock = (Get-Content -LiteralPath (Join-Path $active 'package-lock.json') -Raw) -replace '\r\n', "\n"
$expectedLock = (Get-Content -LiteralPath (Join-Path $download 'package-lock.json') -Raw) -replace '\r\n', "\n"
if ($activeLock -ne $expectedLock) { throw 'The active release uses different dependencies. Use a full staged deployment.' }
if (-not (Test-Path -LiteralPath (Join-Path $active 'node_modules\stripe\package.json') -PathType Leaf)) {
    throw 'Stripe dependencies are missing in the active release.'
}

Write-Host "Staging catalogue release $id"
New-Item -ItemType Directory -Path $staged | Out-Null
foreach ($entry in @('server', 'public', 'iis', 'node_modules', 'package.json', 'package-lock.json')) {
    Copy-Item -LiteralPath (Join-Path $active $entry) -Destination $staged -Recurse
}
foreach ($file in $files) {
    Copy-Item -LiteralPath (Join-Path $download $file) -Destination (Join-Path $staged $file) -Force
}
$metadata.release = $id
[IO.File]::WriteAllText((Join-Path $staged 'deployment.json'), ($metadata | ConvertTo-Json -Depth 6), $utf8)
[IO.File]::WriteAllText((Join-Path $staged 'public\atlas-release.json'), (@{release=$id} | ConvertTo-Json), $utf8)
Push-Location $staged
try {
    & node.exe --check server/app.js
    if ($LASTEXITCODE -ne 0) { throw 'The staged server failed the syntax check.' }
    & node.exe --input-type=module -e "import './public/professional-certificates.js'; if (globalThis.professionalCertificates.length !== 29) process.exit(1);"
    if ($LASTEXITCODE -ne 0) { throw 'The staged catalogue does not contain 29 certificates.' }
} finally { Pop-Location }

if (-not $ServiceCredential) {
    $ServiceCredential = Get-Credential -UserName "$env:COMPUTERNAME\AtlasCampusSvc" -Message 'Existing Atlas service account'
}
if (-not $ServiceCredential) { throw 'No credentials supplied. The staged release has not been activated.' }
$site = Get-Item -LiteralPath "IIS:\Sites\$SiteName"
if ((Resolve-Path -LiteralPath ([Environment]::ExpandEnvironmentVariables([string] $site.physicalPath))).Path -ne $gateway) {
    throw 'The active release changed while staging. Run the updater again against the current release.'
}
& (Join-Path $download 'deploy\Publish-Iis.ps1') -Mode Activate -SiteName $SiteName -InstallRoot $InstallRoot -ReleasePath $staged -PublicOrigin $metadata.publicOrigin -Port $metadata.port -ServiceCredential $ServiceCredential
$courses = Invoke-RestMethod -Uri "$($metadata.publicOrigin)/api/courses" -TimeoutSec 15
if ($courses.Count -ne 29 -or @($courses | Where-Object { -not $_.tuition_pence }).Count -ne 0) {
    throw 'Activation ran, but the public catalogue did not return 29 priced certificates.'
}
Write-Host 'Catalogue update activated. The public site returned 29 priced certificates.'
