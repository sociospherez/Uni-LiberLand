#Requires -Version 5.1
#Requires -RunAsAdministrator
[CmdletBinding()]
param(
 [Parameter(Mandatory=$true)][ValidateSet('true','false')][string]$Enabled,
 [string]$SiteName='UOLedu',
 [string]$InstallRoot='C:\Apps\LiberlandAtlas',
 [int]$Port=3100
)
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
$Enabled=$Enabled.ToLowerInvariant()
$taskName='LiberlandAtlas-'+$SiteName
$envFile=Join-Path $InstallRoot 'private\app.env'
$task=Get-ScheduledTask -TaskName $taskName -ErrorAction Stop
$backend=[string]$task.Actions.WorkingDirectory
if(-not (Test-Path -LiteralPath (Join-Path $backend 'server\demo-mode.js'))){throw 'Deploy the demo-enabled release before changing DEMO_MODE.'}
if(-not (Test-Path -LiteralPath $envFile)){throw 'Private app.env was not found.'}
$mutex=New-Object Threading.Mutex($false,('Global\LiberlandAtlas-'+$SiteName))
try{$locked=$mutex.WaitOne(0)}catch [Threading.AbandonedMutexException]{$locked=$true}
if(-not $locked){$mutex.Dispose();throw 'Another deployment is running.'}
function Stop-DemoTask {
 Stop-ScheduledTask -TaskName $taskName -ErrorAction Stop
 for($attempt=0;$attempt -lt 15;$attempt++){
  if(-not (Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue)){return}
  Start-Sleep -Seconds 1
 }
 throw 'The backend has not stopped. No configuration change was made.'
}
function Check-DemoMode([bool]$Expected){
 for($attempt=0;$attempt -lt 12;$attempt++){
  try{
   $nonce=[guid]::NewGuid().ToString('N')
   $response=Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/config?v=$nonce" -TimeoutSec 5
   if($response.demoMode -is [bool] -and $response.demoMode -eq $Expected){return}
  }catch{}
  Start-Sleep -Seconds 1
 }
 throw 'The backend did not confirm the requested demo setting.'
}
try{
 $original=[IO.File]::ReadAllBytes($envFile)
 $content=[IO.File]::ReadAllText($envFile)
 $next=[regex]::Replace($content,'(?m)^\s*(?:export\s+)?DEMO_MODE\s*=.*\r?\n?','').TrimEnd()+"`r`nDEMO_MODE=$Enabled`r`n"
 $backup=Join-Path $InstallRoot ('private\backups\demo-setting-'+(Get-Date -Format 'yyyyMMdd-HHmmss')+'-'+[guid]::NewGuid().ToString('N').Substring(0,8)+'.env')
 New-Item -ItemType Directory -Path (Split-Path $backup -Parent) -Force | Out-Null
 [IO.File]::WriteAllBytes($backup,$original)
 try{
  Stop-DemoTask
  [IO.File]::WriteAllText($envFile,$next,(New-Object Text.UTF8Encoding($false)))
  Start-ScheduledTask -TaskName $taskName -ErrorAction Stop
  Check-DemoMode ($Enabled -eq 'true')
 }catch{
  $changeError=$_.Exception.Message
  [IO.File]::WriteAllBytes($envFile,$original)
  try{
   Stop-DemoTask
   Start-ScheduledTask -TaskName $taskName -ErrorAction Stop
  }catch{throw "The original configuration was restored but the task needs a manual restart. Original error: $changeError. Restart error: $($_.Exception.Message)"}
  throw "Demo setting failed and the original configuration was restored: $changeError"
 }
 Write-Host "DEMO_MODE=$Enabled is active."
 if($Enabled -eq 'true'){
  Write-Host 'Open /portal.html?tab=login and select Enter staff demo.'
  Write-Host 'Demo staff: Staff Admin (staff.admin@universityofliberland.land).'
  Write-Host 'All registrations, enrolments and enquiries now use separate demo records. Existing records remain in the normal database.'
 }else{Write-Host 'Normal records and protected staff sign-in are active. Demo sessions have no access.'}
}finally{$mutex.ReleaseMutex();$mutex.Dispose()}
