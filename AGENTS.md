# Grok Phone Agent — AGENTS.md

## Two separate runtimes

**Local Node.js** (`deploy.js`, `outbound.js`) runs on the dev machine using `@voximplant/apiclient-nodejs`. Uses `require('dotenv').config()` to read `.env`.

**VoxEngine** (`scenarios/*.voxengine.js`, `modules/*.voxengine.js`) runs on Voximplant's servers. Different API surface (`VoxEngine.*`, `CallEvents.*`, `Modules.*`), no Node.js APIs, no `dotenv`. Variables are shared across all scenarios loaded by the same rule — no imports needed.

## All secrets come from `.env`

`modules/credentials.voxengine.js` and `modules/agent_config.voxengine.js` are **gitignored and generated at deploy time**. Never edit them directly. `deploy.js` reads `.env`, generates these two files into the CI staging dir, then uploads. Edit `.env` and re-deploy instead.

Required `.env` vars (checked by `deploy.js`): `VOX_CI_CREDENTIALS`, `VOX_CI_ROOT_PATH`, `VOX_ACCOUNT_NAME`, `VOX_NEW_APP_NAME`, `X_API_KEY`.

Optional: `GROK_MODEL` (defaults to `grok-voice-think-fast-1.0`), `SYSTEM_INSTRUCTIONS`, `VOX_PHONE_NUMBER`, `SCRIPT_CUSTOM_DATA`.

## Template substitution

`application/application.config.json` uses `{{VAR}}` placeholders (e.g. `{{VOX_NEW_APP_NAME}}`). `deploy.js` replaces them from `process.env` before upload. Edit `.env`, not the JSON.

## VoxEngine scenario wiring

`application/rules.config.json` defines two rules. Each rule loads 4 scenarios in order; they share scope:

- **inboundCalls** (pattern `.*`): `credentials` → `agent_config` → `grok_integration` → `inbound_handler`
- **outboundCalls** (pattern `outbound`): `credentials` → `agent_config` → `grok_integration` → `outbound_handler`

Global variables (`X_API_KEY`, `GROK_MODEL`, `SYSTEM_INSTRUCTIONS`, `voxNum`) are defined in the first two and consumed by the latter two.

## Key dev commands

| Action | Command |
|---|---|
| Deploy/update everything | `node deploy.js` (generates configs, inits CI, uploads, binds number) |
| Trigger outbound call | `node outbound.js` |
| Clean CI state (if upload fails) | `rm -rf voxengine_ci_source_files/` then `node deploy.js` |

No test runner configured (`package.json` `"test"` is a placeholder). No linter, no typecheck.

## Testing inbound with a sandbox number

Sandbox numbers cannot receive direct PSTN calls. Instead:
1. Call one of Voximplant's test numbers: `+19292240694` (USA), `+442038083060` (UK), or other regional numbers
2. After the automated greeting, enter the sandbox number as DTMF extension
3. The call routes to the `inbound_handler` scenario

## `require(Modules.Grok)`

`Modules.Grok` is a Voximplant-provided module available only at runtime on the platform — not in npm, not locally. `grok_integration.voxengine.js` uses it along with `Grok.createVoiceAgentAPIClient()` and `Grok.VoiceAgentAPIEvents.*`.

## WebSocket error 1011

The Grok connector closes with code 1011 ("Internal server error") when xAI rejects the connection. Common causes:
- API key has no Voice Agent API access
- xAI account has no balance
- Model name is wrong or deprecated

`grok-voice-think-fast-1.0` was pinned for a deadline of May 31, 2026. If that date has passed, use `grok-voice-latest` instead.

## Transitive dependency noise

`@voximplant/apiclient-nodejs` ships old `axios` (0.21.x) and `form-data` (2.5.x) — `npm audit` shows many CVEs with "No fix available". These are not exploitable in normal usage (the SDK only calls Voximplant's own API with fixed URLs). The Voximplant team has not updated them. Ignore the audit noise.

## Git-ignored files

`voximplant-credentials.json`, `*_private.json`, `.env`, `voxengine_ci_source_files/`, `modules/credentials.voxengine.js`, `modules/agent_config.voxengine.js` — all contain credentials or generated output. Never commit them.

## Available skills in `.agents/skills/`

- `voximplant-voxengine-dev` — writing/reviewing/debugging VoxEngine scenario code
- `voximplant-management-api` — managing platform resources, deploying, retrieving logs/recordings

Load these when working with scenario code or platform operations.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
