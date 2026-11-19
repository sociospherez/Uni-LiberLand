# Honorary Recognition

Public information page: `/honorary-recognition.html`. The campus header links to it; on small screens the link is in the hamburger menu. The page explains honorary doctoral, master's and bachelor's titles without representing them as awards currently offered by the university.

Visitors can enquire or discuss a potential nomination through a direct form with an honorary doctorate, master’s, bachelor’s or general-interest selector. The form stores a tagged enquiry in the existing staff inbox through POST /api/enquiries. Submissions do not guarantee an award; awarding authority and regulations still require confirmation. Sandbox email remains preview-only. Five supplied images illustrate the page. Image alternative text is descriptive; the page makes no claims that the people pictured are past recipients.

## Publish to the existing Windows server

Run `deploy/Publish-HonoraryRecognition.ps1 -SourceCommit <full-commit-sha>` in Administrator PowerShell. It discovers UOLedu's active `iis` release, downloads eleven pinned public assets, verifies SHA-256 hashes, backs up affected files under private/backups, and adds the two navigation links to the existing index. The backend, service task, keys and student records are not changed. Local HTTP checks verify the page, navigation and served asset hashes; failures restore the changed files. No service restart is required.

The publisher expects the existing staged `release/iis` and `release/public` layout. It stops without modifying files when that layout or the expected header is missing. A Windows/IIS execution check must be done on the server; this script cannot be executed in the Linux authoring environment.

After publication, open the public honorary page, hard-refresh the campus header, and follow an enquiry button. Staff can review enquiries in the existing portal. Verify that a real visitor submission is saved before signing off the hosted change. The direct form collects an initial introduction only, with no document upload or payment.
