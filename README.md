# PrivacyLens

PrivacyLens is a privacy-focused data discovery app for small organisations. It scans CSV, XLSX, and TXT exports in memory, detects common Indian identifiers, stores scan metadata in PostgreSQL, and calculates deterministic findings and risk scores. Raw file bytes and cell/message values are never written to disk or PostgreSQL.

## Requirements

- Node.js 20 or newer
- pnpm 9 or newer
- PostgreSQL 14 or newer (Supabase PostgreSQL works)
- Optional: Gemini API key and a currently supported model name

## Local setup

1. Create a PostgreSQL database and run the schema:

   ```sh
   psql "$DATABASE_URL" -f server/db/schema.sql
   ```

2. Copy `.env.example` to `.env` and set at least `DATABASE_URL`, a random `JWT_SECRET` of 32+ characters, and `CLIENT_ORIGIN`. Add `GEMINI_API_KEY` and `AI_MODEL` to enable AI features. Without Gemini credentials, deterministic detection, inventory, findings, scoring, and documents continue to work.

3. Install dependencies and start both services:

   ```sh
   pnpm install
   pnpm dev
   ```

4. Visit `http://localhost:5173`. The API listens on port 5000 by default. For a production client, run `pnpm build`; serve `client/dist` with a static host that proxies `/api` to the server.

For production, set `COOKIE_SECURE=true`, use HTTPS, use a strong secret manager for credentials, configure `CLIENT_ORIGIN` to the exact web origin, and use a PostgreSQL TLS connection. Legal timelines are configurable with `ERASURE_DEFAULT_DAYS`; generated content is a draft and requires review by qualified counsel.

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `PORT` | No | API port, defaults to 5000 |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Session signing secret, minimum 32 characters |
| `JWT_EXPIRES_IN` | No | JWT lifetime, defaults to `1h` |
| `CLIENT_ORIGIN` | Yes | Exact allowed browser origin |
| `CONNECTOR_CLIENT_URL` | No | Browser origin used after OAuth callbacks |
| `CONNECTOR_API_URL` | No | API origin used for provider callback URLs |
| `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET` | No | Google Drive OAuth app credentials |
| `CONNECTOR_TOKEN_KEY` | No | 32-byte hex key used to encrypt stored OAuth tokens |
| `GEMINI_API_KEY` | No | Server-only Gemini credential |
| `AI_MODEL` | No | Current supported Gemini model identifier |
| `MAX_UPLOAD_MB` | No | Upload cap, defaults to 10 MB |
| `MAX_ROWS` | No | Parsed row/line cap, defaults to 50,000 |
| `ERASURE_DEFAULT_DAYS` | No | Configurable due-date interval |
| `COOKIE_SECURE` | No | Set `true` behind HTTPS; local default is `false` |

The Gemini credential is optional by design so the scanner can operate when the AI service is unavailable. Scan payloads contain field names, safe structural statistics, detector counts/rates, and masked samples only. The Privacy Assistant also sends the user's chat messages and limited organisation-scoped finding metadata to Gemini; known identifiers detected in messages are masked first. Raw uploaded file contents are never included. Do not paste raw personal information into chat.

## Privacy assistant and cloud connections

Assistant suggestions do not change an assessment until the user applies them. Resolving a finding requires a user confirmation and evidence note; this changes only PrivacyLens findings and score, not the original file.

Google Drive/Sheets use OAuth authorization code flow. Users authenticate on Google's site and grant read-only access; PrivacyLens never receives their account password. Configure the Google OAuth client ID/secret in `.env`. Register this redirect URL with the Google OAuth client:

- `http://localhost:5000/api/connectors/google/callback`

Set `CONNECTOR_API_URL` to the public API origin and `CONNECTOR_CLIENT_URL` to the browser origin (for this local Vite session, `http://127.0.0.1:5174`). Generate a unique token key with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and set it as `CONNECTOR_TOKEN_KEY`. OAuth tokens are encrypted with AES-256-GCM in PostgreSQL. Do not commit `.env` or reuse the example values. Google requires Drive API enabled and scopes `drive.readonly`, `openid`, and `email`. Provider consent and app verification rules may apply.

Connected files are downloaded to server memory and passed through the existing in-memory scanner. Scannable sources are CSV, XLSX, TXT, Google Sheets (exported as XLSX), and Google Docs (exported as plain text). Other formats are not currently imported. The app retains scan metadata and OAuth tokens, not source-file bytes.

## Tests

Run `pnpm test` for detector, Aadhaar checksum, masking, risk scoring, and synthetic 200-row clinic sample checks. The sample exists only in test memory. Cross-tenant API integration tests require a configured PostgreSQL test database and are not yet included.

## Architecture and limitations

- `server/src/app.js` contains API routes, per-query tenant scoping, memory uploads, scan orchestration, rules, and persistence.
- `server/src/services/detectors.js` contains deterministic identifier detection and masking.
- `server/db/schema.sql` defines organisation-scoped PostgreSQL records.
- `client/src/App.jsx` provides the authenticated React workspace.

Current limitations: upload scans run in-process and are not durable jobs across restarts; scans read the first worksheet only; CSV, XLSX, and text parsing is limited to the configured row/file caps; risk score history is recorded after scans and finding changes; RLS policies are not installed (the API enforces tenant scope in every data query). Before deployment, add database backup/restore procedures, worker-based job processing, organisation-specific retention policy controls, hardened operational monitoring, current DPDP Act/rules review, and real database-backed isolation/route integration tests.
