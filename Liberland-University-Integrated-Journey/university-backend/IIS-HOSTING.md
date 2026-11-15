# Hosted sandbox on Windows Server 2019 / IIS

Deploy **this `university-backend` folder**, under
`Liberland-University-Integrated-Journey`. The root `liberland_mvp`, the separate
Stripe example, and the old ZIP archives are not the complete hosted application.
The older `Liberland-University-Stripe-Sandbox` folder is retained unchanged as an
earlier snapshot. These hosting changes apply only to the integrated journey.

The intended public origin is `https://universityofliberland.land`.

Confirmed from the IIS screenshots: the site name and application pool are
**`UOLedu`** (U-O-L), site ID **7**, and the current physical path is
`C:\repo\inetpub\Uni-LiberLand\liberland_mvp`. The visible `www` binding uses
HTTPS port 443, SNI and a Cloudflare Origin Certificate. A second HTTPS binding is
listed; the preflight verifies that the canonical non-www hostname is present.
Use a **separate checkout** for deployment. Changing branches or pulling updates
inside the currently served repository can immediately change the existing site.

| Address | Behaviour |
| --- | --- |
| `/` | Campus, prospectuses and learning |
| `/student` | Redirect to the student/staff account portal |
| `/admin` | Redirect to the same portal; staff permissions require staff login and MFA |
| `/portal.html` | Existing student/staff portal |
| `/api/*` | Backend routes with existing account and enrolment checks |
| `/api/stripe/webhook` | Signed Stripe sandbox notifications |

IIS terminates HTTPS and proxies **all requests for this site** to a Node process
listening on `127.0.0.1:3100`. The backend serves its own `public/` files. It never
serves the database, secrets, setup token or server code. No extra public port,
admin subdomain, database service or Node development server is needed.

## One-time server preparation

Use Remote Desktop and an elevated **Windows PowerShell 5.1** window. Do not run
this script on your laptop expecting it to reach the server remotely.

1. Confirm the exact **IIS site name** in IIS Manager. It may differ from the domain.
   The site must already have a working HTTPS binding/certificate for
   `universityofliberland.land`. Keep the current bindings and DNS.
   For this installation, use `UOLedu` exactly. To list both hostnames without
   editing anything, run `Get-WebBinding -Name UOLedu | Format-Table protocol,bindingInformation`.
2. Install a machine-wide Node.js **24 or newer** runtime and Git for Windows.
   The app uses the built-in `node:sqlite` API. No separate SQLite installer is needed.
3. Check whether **IIS URL Rewrite** and **Application Request Routing (ARR)** are
   already installed. If needed, install them using Microsoft's installers. ARR's
   **Enable Proxy** setting is server-wide: review its effect on the other hosted
   applications before enabling it. The deployment script checks this setting and
   does not change it, install modules, run `iisreset`, alter firewall rules or
   modify other sites. Module installation itself needs an appropriate maintenance window.
4. Create a dedicated **standard local Windows user**, for example `AtlasCampusSvc`,
   with a strong privately stored password. It must be able to run a scheduled task
   while logged off (`Log on as a batch job`, subject to server/group policy).
   Do not use your RDP administrator account. The script stores its credentials
   through Task Scheduler; no password is written to the repository or script.
   Manage password expiry/rotation and update the task credentials when rotated.
5. Choose an unused backend port (default `3100`) and a new dedicated installation
   directory (default `C:\Apps\LiberlandAtlas`). The script refuses to use the
   current website directory as its private installation directory.

Microsoft references:
- https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/reverse-proxy-with-url-rewrite-v2-and-application-request-routing
- https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows
- https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/register-scheduledtask

## Stage and review

Clone the repository onto the server and select the reviewed hosting branch/commit.
After the hosting change is merged, use `main` for subsequent updates.

```powershell
git clone https://github.com/sociospherez/Uni-LiberLand.git C:\Deploy\Uni-LiberLand
Set-Location C:\Deploy\Uni-LiberLand
# For initial review before merge:
git switch codex/iis-node-hosting
Set-Location .\Liberland-University-Integrated-Journey\university-backend

$atlasSite = 'UOLedu'
.\deploy\Publish-Iis.ps1 -SiteName $atlasSite -WhatIf
.\deploy\Publish-Iis.ps1 -SiteName $atlasSite
```

Staging installs the pinned dependency and writes a separate release folder. It
does not switch the IIS path, create/start a background task, or replace existing
application files. Read the output for the **exact staged ReleasePath**.
This script stages the local checkout; it does not silently fetch or merge code.
For later updates, first review/pull the intended Git commit, then stage again.
Do not edit a staged release after reviewing it.

The persistent `C:\Apps\LiberlandAtlas\private\app.env` file holds:

```dotenv
PUBLIC_ORIGIN=https://universityofliberland.land
PORT=3100
DATA_DIR="C:/Apps/LiberlandAtlas/private/data"
BACKUP_DIR="C:/Apps/LiberlandAtlas/private/backups"
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Fill the three Stripe values **on the server only**, using a single Stripe sandbox.
Blank values allow manual enrolment review but leave checkout unavailable.
The app continues to reject live API keys and live payment events. This is a
hosted sandbox, not an implementation of live payments.

For hosted payment testing, configure a **sandbox webhook destination** in Stripe:
`https://universityofliberland.land/api/stripe/webhook`. Subscribe to
`checkout.session.completed`, `checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, and `checkout.session.expired`.
Use **that destination's** signing secret. The local Stripe CLI listener and its
signing secret are not used for this hosted route. Start the public endpoint
before testing deliveries; use Stripe's retry/resend feature if setup events fail.

If retaining your laptop's fictional accounts, stop its backend and copy its
**entire `data/` directory**, including `encryption.key`, into the server's private
data directory before activation. Never copy a live SQLite file by itself; use a
matched database/key backup or stop the source first. Do not overwrite an existing
server database. Starting empty creates a new database and requires staff setup.

## Activate the reviewed release

```powershell
$atlasCredential = Get-Credential "$env:COMPUTERNAME\AtlasCampusSvc"
.\deploy\Publish-Iis.ps1 -SiteName $atlasSite -Mode Activate `
  -ReleasePath 'PASTE THE EXACT STAGED RELEASE PATH' `
  -ServiceCredential $atlasCredential
```

Activation grants the service account read access to code/config and modify access
only to its data/backups. It keeps the database and authenticator encryption key
outside every release. If data already exists, it backs up the database **and its
key together** before proceeding. Protect the Windows host and backup access;
these file ACLs do not defend against a server administrator.

The script registers one startup task scoped to this site, starts Node under the
dedicated standard account, checks the loopback backend, then changes only this
site's physical path to a generated proxy-only folder. It leaves the HTTPS
bindings/certificate and other applications in place. Expect a short interruption
when replacing the site's existing Node task on subsequent releases.

The public check must see the exact release marker, backend configuration and
essential page/assets through HTTPS. Failed activation attempts restore the
previous task and IIS path; the error tells you if restoration itself fails.
Save the printed rollback record path. Validate recovery on the actual server.
This preserves files/settings, but is not a promise of zero downtime or database
schema rollback. The script refuses sites with child IIS applications or virtual
directories until their routing is reviewed.

The proxy template redirects `www` and HTTP requests to the canonical non-www
HTTPS origin before forwarding them to Node. Both existing HTTPS bindings are
retained; the certificate needs to cover both hostnames. Sign-in sessions and
Stripe return URLs consistently use the canonical origin.

With the selected Cloudflare Origin Certificate, use Cloudflare-proxied DNS for
the public hostnames and Full (strict), subject to the certificate's validity and
hostname coverage. Origin CA certificates protect Cloudflare-to-IIS traffic and
are not normally trusted for direct browser-to-origin connections. Public health
checks must use the domain through Cloudflare, not the server IP or a hosts-file
override. The script does not bypass certificate validation. Cloudflare reference:
https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/
Do not use Flexible SSL with the HTTPS redirect.
Exclude `/api/*`, account/checkout pages and `atlas-release.json` from any explicit
cache-everything rule. The Node responses set `Cache-Control: no-store`.

## Verify after activation

- Open `/admin` and complete first staff setup using the token in the private data
  directory. Verify authenticator setup and subsequent sign-in with a fresh code.
- Register a fictional student in a private browser. Verify staff-only controls
  are denied, enrolment/learning survives sign-out and a separate browser session,
  and staff approvals work.
- Complete a Stripe sandbox test-card payment. Confirm its signed webhook succeeds
  and grants exactly one enrolment; returning without paying must not grant access.
- Log out of RDP, then check that the application still works. Verify startup after
  a planned reboot. The task restarts failed exits, but does not detect a hung process.
- Test backup/restore separately before collecting real information. The existing
  production-readiness gaps still apply: email delivery/verification, password and
  MFA recovery, monitoring, retention and abuse protection. Rate limits currently
  use the socket peer: behind ARR, visitors share a rate-limit bucket. Do not trust
  arbitrary forwarded IP headers as a shortcut; edge controls or a validated proxy
  trust design are a separate production step.

The Node/API tests cover the domain/cookie/payment behaviour. Windows ACLs,
Task Scheduler, installed IIS modules and actual proxy/Stripe deliveries must be
validated on the Windows server; they cannot be proven by Linux unit tests.

## Rollback and diagnostics

```powershell
.\deploy\Publish-Iis.ps1 -SiteName $atlasSite -Mode Rollback `
  -RollbackRecord 'PASTE THE PRINTED ROLLBACK JSON PATH' `
  -ServiceCredential $atlasCredential
```

Use the same Windows account. A rollback record is accepted only while its release
is the current IIS target. The prior task and IIS physical path are restored;
current database content is retained. For the very first deployment, the original
static IIS site is restored and the newly created backend task is removed.

Use Task Scheduler (`LiberlandAtlas-<IIS site name>`) and IIS logs for diagnostics.
If the task fails to start, stop that task before running its exact command
interactively to see Node's startup error:

```powershell
node --env-file="C:\Apps\LiberlandAtlas\private\app.env" "RELEASE PATH\server\app.js"
```

This routine does not install central logging, scheduled/off-device backups or
monitoring. It never automatically deletes old releases or backup pairs. Retain
the previous release and matched backups until the updated journey is verified.
