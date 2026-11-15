#Requires -Version 5.1
#Requires -RunAsAdministrator
<#
Run on the Windows IIS server, in elevated Windows PowerShell 5.1.
Stage is the default: it does not change IIS or start a background task.
See IIS-HOSTING.md before using Activate or Rollback.
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)] [ValidatePattern('^[A-Za-z0-9 ._-]+$')] [string] $SiteName,
    [ValidateSet('Stage', 'Activate', 'Rollback')] [string] $Mode = 'Stage',
    [string] $InstallRoot = 'C:\Apps\LiberlandAtlas',
    [string] $PublicOrigin = 'https://universityofliberland.land',
    [ValidateRange(1024, 65535)] [int] $Port = 3100,
    [string] $ReleasePath,
    [string] $RollbackRecord,
    [PSCredential] $ServiceCredential
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Import-Module WebAdministration

function Set-DirectoryAccess([string] $Directory, [string[]] $Readers, [string[]] $Writers = @()) {
    $acl = New-Object System.Security.AccessControl.DirectorySecurity
    $acl.SetAccessRuleProtection($true, $false)
    foreach ($id in @('S-1-5-18', 'S-1-5-32-544') + $Writers + $Readers) {
        $sid = New-Object System.Security.Principal.SecurityIdentifier($id)
        $rights = if ($id -in @('S-1-5-18', 'S-1-5-32-544')) { 'FullControl' } elseif ($id -in $Writers) { 'Modify' } else { 'ReadAndExecute' }
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($sid, $rights, 'ContainerInherit,ObjectInherit', 'None', 'Allow')
        $acl.AddAccessRule($rule)
    }
    Set-Acl -LiteralPath $Directory -AclObject $acl
}
function Read-Json([string] $File) { Get-Content -LiteralPath $File -Raw | ConvertFrom-Json }
function Save-Json($Value, [string] $File) { [IO.File]::WriteAllText($File, ($Value | ConvertTo-Json -Depth 8), (New-Object Text.UTF8Encoding($false))) }
function Check-Release([string] $Base, [string] $ExpectedId) {
    $lastFailure = ''
    for ($attempt = 0; $attempt -lt 6; $attempt++) {
        try {
            $nonce = [guid]::NewGuid().ToString('N')
            $marker = Invoke-WebRequest -UseBasicParsing -Uri "$Base/atlas-release.json?v=$nonce" -TimeoutSec 10
            if (($marker.Content | ConvertFrom-Json).release -ne $ExpectedId) { throw 'The URL is serving a different release.' }
            $config = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/config?v=$nonce" -TimeoutSec 10
            if (($config.Content | ConvertFrom-Json).mode -ne 'hosted-sandbox') { throw 'The backend is not in hosted sandbox mode.' }
            foreach ($asset in @('index.html', 'portal.html', 'portal.js', 'campus.css')) {
                $response = Invoke-WebRequest -UseBasicParsing -Uri "$Base/${asset}?v=$nonce" -TimeoutSec 10
                if ($response.StatusCode -ne 200) { throw "Failed to load $asset" }
            }
            return
        } catch { $lastFailure = $_.Exception.Message; Start-Sleep -Seconds 2 }
    }
    throw "Release health check failed: $lastFailure"
}
function Stop-CampusTask([string] $Name, [int] $ListenPort) {
    if (Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue) {
        Stop-ScheduledTask -TaskName $Name
        for ($attempt = 0; $attempt -lt 15; $attempt++) {
            if (-not (Get-NetTCPConnection -State Listen -LocalPort $ListenPort -ErrorAction SilentlyContinue)) { return }
            Start-Sleep -Seconds 1
        }
        throw 'The old backend has not released its port. No unrelated process will be terminated.'
    }
}
function Restore-Release($Record) {
    Stop-CampusTask $Record.taskName $Record.port
    $task = Get-ScheduledTask -TaskName $Record.taskName -ErrorAction SilentlyContinue
    if ($task) { Unregister-ScheduledTask -TaskName $Record.taskName -Confirm:$false }
    if ($Record.previousTaskXml) {
        Register-ScheduledTask -TaskName $Record.taskName -Xml $Record.previousTaskXml -User $ServiceCredential.UserName -Password ($ServiceCredential.GetNetworkCredential().Password) | Out-Null
        Start-ScheduledTask -TaskName $Record.taskName
    }
    Set-ItemProperty -LiteralPath $sitePath -Name physicalPath -Value $Record.previousSitePath
}

$deploymentMutex = New-Object Threading.Mutex($false, ('Global\LiberlandAtlas-' + $SiteName))
try { $locked = $deploymentMutex.WaitOne(0) } catch [Threading.AbandonedMutexException] { $locked = $true }
if (-not $locked) { $deploymentMutex.Dispose(); throw 'Another deployment for this IIS site is running.' }
try {
$uri = [uri] $PublicOrigin
if (-not $uri.IsAbsoluteUri -or $uri.Scheme -ne 'https' -or $uri.UserInfo -or $uri.AbsolutePath -ne '/' -or $uri.Query -or $uri.Fragment) { throw 'PublicOrigin must be an HTTPS origin without a path or credentials.' }
$PublicOrigin = $uri.GetLeftPart([UriPartial]::Authority)
$sitePath = "IIS:\Sites\$SiteName"
$site = Get-Item -LiteralPath $sitePath
$InstallRoot = [IO.Path]::GetFullPath($InstallRoot).TrimEnd('\')
if ($InstallRoot -eq [IO.Path]::GetPathRoot($InstallRoot).TrimEnd('\')) { throw 'InstallRoot must be a dedicated application directory, not a drive root.' }
$siteRoot = [IO.Path]::GetFullPath([Environment]::ExpandEnvironmentVariables([string] $site.physicalPath)).TrimEnd('\')
if ($InstallRoot -eq $siteRoot -or $InstallRoot.StartsWith($siteRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'InstallRoot must be outside the currently served website directory.' }
$taskName = 'LiberlandAtlas-' + $SiteName
$envFile = Join-Path $InstallRoot 'private\app.env'
$dataDirectory = Join-Path $InstallRoot 'private\data'
$backupDirectory = Join-Path $InstallRoot 'private\backups'
$stateDirectory = Join-Path $InstallRoot 'private\deployments'

if ($Mode -eq 'Rollback') {
    if (-not $ServiceCredential -or -not $RollbackRecord) { throw 'Supply ServiceCredential and RollbackRecord for rollback.' }
    $record = Read-Json $RollbackRecord
    if ($record.siteName -ne $SiteName -or $record.taskName -ne $taskName -or [string] $site.physicalPath -ne $record.newSitePath) { throw 'Rollback record does not match the current site/release. Inspect manually.' }
    $sid = (New-Object Security.Principal.NTAccount($ServiceCredential.UserName)).Translate([Security.Principal.SecurityIdentifier]).Value
    if ($sid -ne $record.serviceSid) { throw 'Use the same service account that activated this release.' }
    if ($PSCmdlet.ShouldProcess($SiteName, 'Restore the previous backend task and IIS physical path')) {
        Restore-Release $record
        if ($record.previousReleaseId) { Check-Release $record.publicOrigin $record.previousReleaseId }
        Write-Host 'Previous task and IIS path restored. Database content was retained; verify the website.'
    }
    return
}

$node = (Get-Command node.exe -ErrorAction Stop).Source
$nodeVersion = & $node --version
if ($LASTEXITCODE -ne 0 -or [int]($nodeVersion.TrimStart('v').Split('.')[0]) -lt 24) { throw 'Install machine-wide Node.js 24 or newer first.' }
if (-not (Get-WebGlobalModule | Where-Object { $_.Name -eq 'RewriteModule' })) { throw 'Install IIS URL Rewrite before continuing.' }
try { $proxyEnabled = (Get-WebConfigurationProperty -PSPath 'MACHINE/WEBROOT/APPHOST' -Filter 'system.webServer/proxy' -Name enabled).Value } catch { throw 'Install IIS Application Request Routing (ARR) first.' }
if (-not $proxyEnabled) { throw 'ARR proxy support is disabled. Review its server-wide impact and enable it in IIS Manager first.' }
$httpsBinding = @($site.Bindings.Collection | Where-Object { $_.protocol -eq 'https' -and (($_.bindingInformation -split ':')[-1] -eq $uri.DnsSafeHost) })
if (-not $httpsBinding.Count) { throw 'The target site needs an existing HTTPS binding for the exact public hostname.' }
if (Get-WebApplication -Site $SiteName | Where-Object { $_.path -ne '/' }) { throw 'This site contains child IIS applications. Review their routing before using a whole-site reverse proxy.' }
if (Get-WebVirtualDirectory -Site $SiteName | Where-Object { $_.path -ne '/' }) { throw 'This site contains virtual directories. Review their routing before proceeding.' }
if ($Mode -eq 'Activate' -and (-not $ServiceCredential -or -not $ReleasePath)) { throw 'Supply ServiceCredential and the staged ReleasePath to activate.' }
if (-not $PSCmdlet.ShouldProcess($SiteName, "$Mode Liberland hosted sandbox under $InstallRoot")) { return }

if ($Mode -eq 'Stage') {
    if (-not (Test-Path -LiteralPath $InstallRoot)) {
        New-Item -ItemType Directory -Path $InstallRoot | Out-Null
        Set-DirectoryAccess $InstallRoot @()
    } elseif (-not (Test-Path -LiteralPath (Join-Path $InstallRoot 'atlas-install.json'))) {
        throw 'An existing InstallRoot is not marked as an Atlas deployment. Choose a new dedicated directory.'
    }
    $installMarker = Join-Path $InstallRoot 'atlas-install.json'
    if (Test-Path -LiteralPath $installMarker) {
        if ((Read-Json $installMarker).siteName -ne $SiteName) { throw 'InstallRoot belongs to a different site.' }
    } else { Save-Json @{siteName=$SiteName} $installMarker }
    foreach ($directory in @((Join-Path $InstallRoot 'private'), $dataDirectory, $backupDirectory, $stateDirectory, (Join-Path $InstallRoot 'releases'))) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    $releaseId = (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [guid]::NewGuid().ToString('N').Substring(0,8)
    $ReleasePath = Join-Path $InstallRoot "releases\$releaseId"
    New-Item -ItemType Directory -Path $ReleasePath | Out-Null
    $source = Split-Path $PSScriptRoot -Parent
    foreach ($entry in @('server', 'public', 'package.json', 'package-lock.json')) { Copy-Item -LiteralPath (Join-Path $source $entry) -Destination $ReleasePath -Recurse }
    Push-Location $ReleasePath
    try { & 'npm.cmd' ci '--omit=dev' '--ignore-scripts'; if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' } } finally { Pop-Location }
    Save-Json @{release=$releaseId} (Join-Path $ReleasePath 'public\atlas-release.json')
    $gateway = Join-Path $ReleasePath 'iis'
    New-Item -ItemType Directory -Path $gateway | Out-Null
    $template = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'web.config.template') -Raw
    $hostPattern = [Security.SecurityElement]::Escape([regex]::Escape($uri.Authority))
    [IO.File]::WriteAllText((Join-Path $gateway 'web.config'), $template.Replace('__PORT__', [string] $Port).Replace('__ORIGIN__', $PublicOrigin).Replace('__HOST_REGEX__', $hostPattern), (New-Object Text.UTF8Encoding($false)))
    Save-Json @{release=$releaseId;siteName=$SiteName;publicOrigin=$PublicOrigin;port=$Port;dataDirectory=$dataDirectory;backupDirectory=$backupDirectory} (Join-Path $ReleasePath 'deployment.json')
    if (-not (Test-Path -LiteralPath $envFile)) {
        $lines = @("PUBLIC_ORIGIN=$PublicOrigin", "PORT=$Port", ('DATA_DIR="' + $dataDirectory.Replace('\','/') + '"'), ('BACKUP_DIR="' + $backupDirectory.Replace('\','/') + '"'), 'STRIPE_PUBLISHABLE_KEY=', 'STRIPE_SECRET_KEY=', 'STRIPE_WEBHOOK_SECRET=')
        [IO.File]::WriteAllText($envFile, ($lines -join "`r`n") + "`r`n", (New-Object Text.UTF8Encoding($false)))
    }
    Write-Host "Staged release: $ReleasePath"
    Write-Host "Configure sandbox secrets privately in: $envFile"
    Write-Host 'IIS and background tasks have not been changed. Use -Mode Activate with this ReleasePath after review.'
    return
}

$ReleasePath = (Resolve-Path -LiteralPath $ReleasePath).Path
if ((Split-Path $ReleasePath -Parent) -ne (Join-Path $InstallRoot 'releases')) { throw 'ReleasePath must be a direct child of this installation releases directory.' }
$release = Read-Json (Join-Path $ReleasePath 'deployment.json')
if ($release.siteName -ne $SiteName -or $release.publicOrigin -ne $PublicOrigin -or $release.port -ne $Port) { throw 'The staged release targets different site/origin/port settings.' }
$settings = & $node (Join-Path $PSScriptRoot 'read-settings.mjs') $envFile
if ($LASTEXITCODE -ne 0) { throw 'The private environment file could not be read.' }
$settings = $settings | ConvertFrom-Json
if ($settings.origin -ne $PublicOrigin -or [int] $settings.port -ne $Port -or [IO.Path]::GetFullPath($settings.data) -ne $dataDirectory -or [IO.Path]::GetFullPath($settings.backup) -ne $backupDirectory) { throw 'The private environment file does not match the staged deployment settings.' }
$serviceSid = (New-Object Security.Principal.NTAccount($ServiceCredential.UserName)).Translate([Security.Principal.SecurityIdentifier]).Value
if ($serviceSid -in @('S-1-5-18', 'S-1-5-19', 'S-1-5-20') -or $serviceSid -eq [Security.Principal.WindowsIdentity]::GetCurrent().User.Value) { throw 'Use a dedicated standard user account for this application, not the administrator or a shared built-in identity.' }
$previousTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($previousTask) {
    $previousSid = (New-Object Security.Principal.NTAccount($previousTask.Principal.UserId)).Translate([Security.Principal.SecurityIdentifier]).Value
    if ($previousSid -ne $serviceSid) { throw 'The existing background task uses a different service account. Review manually.' }
    if ($previousTask.Actions.Execute -ne $node -or -not $previousTask.Actions.WorkingDirectory.StartsWith((Join-Path $InstallRoot 'releases') + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'The existing task is not a release managed by this routine.' }
    if ($previousTask.Actions.WorkingDirectory -eq $ReleasePath) { throw 'This release is already active. Stage a fresh release before updating.' }
} elseif (Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue) { throw 'The selected port is already in use. Choose an unused port and stage again.' }

Set-DirectoryAccess $InstallRoot @($serviceSid)
Set-DirectoryAccess (Join-Path $InstallRoot 'private') @($serviceSid)
Set-DirectoryAccess $dataDirectory @() @($serviceSid)
Set-DirectoryAccess $backupDirectory @() @($serviceSid)
Set-DirectoryAccess $stateDirectory @()
Set-DirectoryAccess (Join-Path $ReleasePath 'iis') @($serviceSid, 'S-1-5-32-568', 'S-1-5-17')
if (Test-Path -LiteralPath (Join-Path $dataDirectory 'campus.sqlite')) {
    & $node "--env-file=$envFile" (Join-Path $ReleasePath 'server\backup.js')
    if ($LASTEXITCODE -ne 0) { throw 'Database/key backup failed. Activation stopped.' }
}
$previousReleaseId = $null
if ($previousTask) { $previousReleaseId = (Read-Json (Join-Path $previousTask.Actions.WorkingDirectory 'deployment.json')).release }
$recordPath = Join-Path $stateDirectory ($release.release + '.json')
$record = @{siteName=$SiteName;taskName=$taskName;serviceSid=$serviceSid;port=$Port;publicOrigin=$PublicOrigin;previousSitePath=[string] $site.physicalPath;newSitePath=(Join-Path $ReleasePath 'iis');previousTaskXml=$(if ($previousTask) { Export-ScheduledTask -TaskName $taskName } else { $null });previousReleaseId=$previousReleaseId}
Save-Json $record $recordPath
try {
    Stop-CampusTask $taskName $Port
    if (Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue) { throw 'Backend port is still occupied.' }
    $action = New-ScheduledTaskAction -Execute $node -Argument ('--env-file="' + $envFile + '" "' + (Join-Path $ReleasePath 'server\app.js') + '"') -WorkingDirectory $ReleasePath
    $trigger = New-ScheduledTaskTrigger -AtStartup
    $taskSettings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) -StartWhenAvailable
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $taskSettings -User $ServiceCredential.UserName -Password ($ServiceCredential.GetNetworkCredential().Password) -RunLevel Limited -Force | Out-Null
    Start-ScheduledTask -TaskName $taskName
    Check-Release "http://127.0.0.1:$Port" $release.release
    Set-ItemProperty -LiteralPath $sitePath -Name physicalPath -Value $record.newSitePath
    Check-Release $PublicOrigin $release.release
} catch {
    $activationError = $_.Exception.Message
    try { Restore-Release $record } catch { throw "Activation failed: $activationError. Automatic restore also failed: $($_.Exception.Message). Use rollback record $recordPath and inspect Task Scheduler/IIS." }
    throw "Activation failed and previous task/site path restored: $activationError. Verify the previous website. Rollback record: $recordPath"
}
Write-Host "Hosted sandbox activated at $PublicOrigin. Manual rollback record: $recordPath"
Write-Host 'Bindings/certificates were retained. Verify staff MFA, student learning and a signed sandbox payment before sharing.'
} finally { $deploymentMutex.ReleaseMutex(); $deploymentMutex.Dispose() }
