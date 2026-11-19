# Staff demo testing

The same application supports `DEMO_MODE=true` or `DEMO_MODE=false` in the protected environment file. Default is false. Restart the backend after changing the setting.

With demo mode enabled, open `/portal.html?tab=login` and choose **Enter staff demo**. The server signs in the dedicated **Staff Admin** account (`staff.admin@universityofliberland.land`) without a password or authenticator. This shortcut only exists while the server flag is enabled; client query parameters cannot enable it. Normal staff authentication remains unchanged.

The entire instance uses `DATA_DIR/demo/campus.sqlite` and its separate encryption key while enabled. It never reads normal accounts, enquiries or enrolments. Demo records persist between uses; prior demo sessions are invalidated on restart. Turning demo mode off restores the normal database and disables demo access. The normal database and credentials are retained. Existing normal enquiries are not copied into the public demo workspace.

Use fictional details because anyone with the demo link can enter the sample staff workspace. Register a test student in another browser/profile, request an enrolment, then enter staff demo to approve it. Submit a test honorary enquiry and open **Enquiries** to assign it, add notes or reply. Email remains preview-only; existing Stripe integration remains test-only. A banner indicates that records are demonstration records.

## Windows deployment and switching

Run the pinned `deploy/Update-SandboxJourney.ps1 -SourceCommit <sha> -DemoMode On` in Administrator PowerShell. The updater stages and activates the full backend release using the existing deployment protections, then changes the flag and restarts the scheduled task. It prompts for the existing Windows service account credentials during activation; these are separate from campus staff authentication.

After deployment, `deploy/Set-DemoMode.ps1 -Enabled true` enables testing; `-Enabled false` disables it. The helper backs up app.env privately, restarts only the managed campus task, checks `/api/config` and restores the previous configuration if the check fails. A failed flag change leaves the newly deployed code in place with the prior setting. Full deployment rollback continues to use the existing publisher.

Keep DATA_DIR pointing at the normal base directory. Do not point it at the demo subdirectory yourself. An existing nonempty unmarked demo directory is rejected. Backups include both normal and demo databases/keys when present.

The PowerShell scripts require execution on the Windows/IIS server; Linux checks cover the application behavior, not Windows Task Scheduler execution.
