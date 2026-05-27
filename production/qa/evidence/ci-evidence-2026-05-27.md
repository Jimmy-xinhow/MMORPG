# CI Evidence

**Date**: 2026-05-27
**Scope**: Godot Client Engineering QA gate
**Workflow**: CCGS test-setup + smoke-check adaptation

---

## CI Configuration

| Check | Result | Evidence |
| --- | --- | --- |
| GitHub Actions workflow present | PASS | `.github/workflows/tests.yml` |
| Trigger on push to `main` | PASS | `on.push.branches: main` |
| Trigger on pull request to `main` | PASS | `on.pull_request.branches: main` |
| Read-only repository permission | PASS | `permissions.contents: read` |
| Node runtime pinned | PASS | `actions/setup-node@v4`, Node.js 20 |
| Project QA gate wired | PASS | `npm run check` |

---

## Install Strategy

The workspace does not currently include a lockfile. The workflow uses:

- `npm ci` when `package-lock.json` exists.
- `npm install --no-audit --no-fund` as the fallback when no lockfile exists.

This keeps the workflow usable now and automatically switches to deterministic install once a lockfile is added.

---

## Local Validation

Local command run after adding the workflow:

```powershell
npm.cmd run check
```

Expected CI command:

```bash
npm run check
```

The CI command is the same project gate without the Windows `.cmd` shim.

---

## Limitations

- Remote GitHub Actions execution was not observed from this local workspace because this directory is not a Git repository and has no attached GitHub run metadata.
- This evidence confirms CI configuration and local gate parity, not a completed remote Actions run.

---

## QA Verdict

**CI evidence**: CONFIGURED WITH LOCAL GATE PASS

The project now has a GitHub Actions workflow for the project QA gate. A remote Actions run should be reviewed after the workspace is committed and pushed to GitHub.
