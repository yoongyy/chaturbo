# Chaturbo CLI

CLI for scanning local AI agent logs, sanitizing sensitive data locally, and uploading workflow drafts to Chaturbo.

## Security

- Raw conversations stay local.
- Only sanitized workflow drafts are uploaded.
- Local CLI config and secrets are stored in the user config directory, not in npm package contents.

## Commands

- `chaturbo connect`
- `chaturbo sync`
- `chaturbo scan agent`
- `chaturbo login`
- `chaturbo whoami`
- `chaturbo pair`
- `chaturbo marketplace search`
- `chaturbo marketplace buy --id <workflow_id>`
- `chaturbo marketplace library`
- `chaturbo credits balance`
- `chaturbo credits topup --amount 100`
