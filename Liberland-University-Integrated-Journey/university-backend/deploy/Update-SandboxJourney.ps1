#Requires -Version 5.1
#Requires -RunAsAdministrator
<# Download a pinned source snapshot and use the existing staged IIS deployment.
   This does not copy or replace private settings, accounts, enrolments or Stripe keys.
   Activation uses the existing database/key backup and rollback protections.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [ValidatePattern('^[0-9a-f]{40}$')] [string] $SourceCommit,
    [string] $SiteName = 'UOLedu',
    [string] $InstallRoot = 'C:\Apps\LiberlandAtlas',
    [PSCredential] $ServiceCredential,
    [ValidateSet('Keep', 'On', 'Off')] [string] $DemoMode = 'Keep'
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$updateId = (Get-Date -Format 'yyyyMMdd-HHmmss') + '-journey-' + [guid]::NewGuid().ToString('N').Substring(0, 8)
$downloadRoot = Join-Path $env:TEMP ('Atlas-' + $updateId)
New-Item -ItemType Directory -Path $downloadRoot | Out-Null
$archive = Join-Path $downloadRoot 'source.zip'
Invoke-WebRequest -UseBasicParsing -Uri "https://github.com/sociospherez/Uni-LiberLand/archive/$SourceCommit.zip" -OutFile $archive
Expand-Archive -LiteralPath $archive -DestinationPath (Join-Path $downloadRoot 'source')
$roots = @(Get-ChildItem (Join-Path $downloadRoot 'source') -Directory)
if ($roots.Count -ne 1) { throw 'Unexpected source archive layout. No activation was attempted.' }
$backend = Join-Path $roots[0].FullName 'Liberland-University-Integrated-Journey\university-backend'
$publisher = Join-Path $backend 'deploy\Publish-Iis.ps1'
if (-not (Test-Path -LiteralPath $publisher -PathType Leaf)) { throw 'Deployment script is missing. No activation was attempted.' }
$release = Join-Path $InstallRoot ('releases\' + $updateId)

# Finish staging and dependency checks before requesting the existing task account password.
& $publisher -SiteName $SiteName -InstallRoot $InstallRoot -Mode Stage -ReleasePath $release
if (-not $ServiceCredential) {
    $ServiceCredential = Get-Credential -UserName "$env:COMPUTERNAME\AtlasCampusSvc" -Message 'Existing Liberland backend service account'
}
if (-not $ServiceCredential) { throw 'No credentials supplied. The staged release has not been activated.' }
& $publisher -SiteName $SiteName -InstallRoot $InstallRoot -Mode Activate -ReleasePath $release -ServiceCredential $ServiceCredential
if ($DemoMode -ne 'Keep') {
    $enabled = if ($DemoMode -eq 'On') { 'true' } else { 'false' }
    & (Join-Path $backend 'deploy\Set-DemoMode.ps1') -Enabled $enabled -SiteName $SiteName -InstallRoot $InstallRoot
}
Write-Host 'Course journey update activated. Complete SANDBOX-SIGNOFF.md on the hosted site.'
Write-Host "Staged source and deployment scripts: $backend"
