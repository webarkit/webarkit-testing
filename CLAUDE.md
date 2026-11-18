# CLAUDE.md

All project instructions live in [AGENTS.md](AGENTS.md), shared with the other agents:

@AGENTS.md

## Claude Code specifics

- On Windows prefer the PowerShell tool; for Linux test containers write the script to a file
  and run `docker run … bash /scripts/script.sh` (inline `bash -c` quoting breaks in PowerShell 5.1).
- Long builds (`npm run build-docker`, native tests) belong in the background.
- Verify browser-visible changes with the static example before reporting them as done.
