#Requires -Version 5.1
#Requires -RunAsAdministrator
# Publish only the honorary page and navigation; existing backend and private data stay in place.
[CmdletBinding()]
param(
 [Parameter(Mandatory=$true)][ValidatePattern('^[0-9a-f]{40}$')][string]$SourceCommit,
 [string]$SiteName='UOLedu',
 [string]$InstallRoot='C:\Apps\LiberlandAtlas',
 [string]$LocalOrigin='http://127.0.0.1:3100'
)
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
Import-Module WebAdministration
$site=Get-Item ('IIS:\Sites\'+$SiteName)
$physical=[Environment]::ExpandEnvironmentVariables([string]$site.physicalPath)
if ((Split-Path $physical -Leaf) -ne 'iis') { throw 'Expected the staged IIS proxy folder. No changes made.' }
$public=Join-Path (Split-Path $physical -Parent) 'public'
$index=Join-Path $public 'index.html'
if (-not (Test-Path -LiteralPath $index)) { throw 'The active release public/index.html was not found. No changes made.' }
$original=[IO.File]::ReadAllText($index)
if ($original -notmatch 'class="header-actions"' -or $original -notmatch 'id="mobileMenu"') { throw 'Unexpected header layout. No changes made.' }
$stage=Join-Path $env:TEMP ('AtlasHonorary-'+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stage | Out-Null
$assets=@{
 'honorary-recognition.html'='BA66470A9A3918C70525E544E553E7D4F30F386AE468B308A28AE80DAC9D0DB0'
 'honorary-recognition.css'='956B6B9C8A9EB7517F40E272D8444C1673AD74113AC5CB3CF5EF65D9C29FB56F'
 'honorary-recognition.js'='D2ED9BBA1C2082C0D4D005725BF0070A9C339968C7D654BCF1A5FAA6CAB7A888'
 'honorary-nav.css'='1FB5FE3DEF94EDE756489C55519C4BBCD1CCE3586E097183EAAFEA2E9052AF88'
 'honorary-diploma.jpg'='C21597DC8707A9EC0965D1544150664D9DDCA3010B72EA6AAC4BF43BC62552DB'
 'honorary-regalia-man.jpg'='860AD3E5D46A594A44DABBE94EA84C519DAC4D185DD7DA8A33A314B5583D8849'
 'honorary-regalia-woman.jpg'='5B399B3E0D2BBC2F4093F015F78B4091A25593E7A2D4174A2A360839891D5175'
 'honorary-gown.jpg'='EAAC5498AE2950B3A849E07F09DBE04D7DD1F337D618B7333518A58616BB983C'
 'honorary-celebration.jpg'='408A579E0990C9994B588D4E0A1DA089472C8B7BAD9B6AC9D9E97D73B608B0EA'
}
$base="https://raw.githubusercontent.com/sociospherez/Uni-LiberLand/$SourceCommit/Liberland-University-Integrated-Journey/university-backend/public"
foreach($name in $assets.Keys){
 $target=Join-Path $stage $name
 Invoke-WebRequest -UseBasicParsing -Uri "$base/$name" -OutFile $target
 if((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $assets[$name]){ throw "Downloaded file failed verification: $name. No changes made." }
}
$updated=$original
if($updated -notmatch 'href="honorary-nav.css'){
 $updated=$updated.Replace('</head>','<link rel="stylesheet" href="honorary-nav.css?v=20261119"></head>')
}
$link='<a class="honorary-nav-link" href="honorary-recognition.html">Honorary Recognition</a>'
if($updated -notmatch 'class="honorary-nav-link"'){
 $updated=$updated.Replace('<div class="header-actions">',('<div class="header-actions">'+$link))
 $updated=$updated.Replace('<div class="mobile-menu" id="mobileMenu">',('<div class="mobile-menu" id="mobileMenu">'+$link))
}
if(([regex]::Matches($updated,'class="honorary-nav-link"')).Count -lt 2){throw 'Could not prepare both navigation links. No changes made.'}
$backup=Join-Path $InstallRoot ('private\backups\honorary-'+(Get-Date -Format 'yyyyMMdd-HHmmss')+'-'+[guid]::NewGuid().ToString('N').Substring(0,8))
New-Item -ItemType Directory -Path $backup -Force | Out-Null
$names=@('index.html')+@($assets.Keys)
$existed=@{}
foreach($name in $names){
 $source=Join-Path $public $name
 $existed[$name]=Test-Path -LiteralPath $source
 if($existed[$name]){Copy-Item -LiteralPath $source -Destination (Join-Path $backup $name)}
}
try{
 foreach($name in $assets.Keys){Copy-Item -LiteralPath (Join-Path $stage $name) -Destination (Join-Path $public $name) -Force}
 [IO.File]::WriteAllText($index,$updated,(New-Object Text.UTF8Encoding($false)))
 $page=Invoke-WebRequest -UseBasicParsing -Uri ($LocalOrigin.TrimEnd('/')+'/honorary-recognition.html')
 if($page.StatusCode -ne 200 -or $page.Content -notmatch 'id="pageTitle"'){throw 'Local page health check failed.'}
 $campusHomeResponse=Invoke-WebRequest -UseBasicParsing -Uri ($LocalOrigin.TrimEnd('/')+'/index.html')
 if($campusHomeResponse.Content -notmatch 'class="honorary-nav-link"'){throw 'Local navigation health check failed.'}
 foreach($name in $assets.Keys){
  $check=Join-Path $stage ('served-'+$name)
  Invoke-WebRequest -UseBasicParsing -Uri ($LocalOrigin.TrimEnd('/')+'/'+$name) -OutFile $check
  if((Get-FileHash -LiteralPath $check -Algorithm SHA256).Hash -ne $assets[$name]){throw "Served asset verification failed: $name"}
 }
}catch{
 foreach($name in $names){
  $target=Join-Path $public $name
  if($existed[$name]){Copy-Item -LiteralPath (Join-Path $backup $name) -Destination $target -Force}
  elseif(Test-Path -LiteralPath $target){Remove-Item -LiteralPath $target -Force}
 }
 throw
}
Write-Host "Honorary Recognition published in the active release: $public"
Write-Host "Backup: $backup"
Write-Host 'Open https://universityofliberland.land/honorary-recognition.html and hard-refresh the home page.'
Write-Host 'No service restart was required. Enquiries are saved through the existing campus enquiry service.'
