# VoxHub — AI Call Center Platform

VoxHub is a multi-tenant SaaS platform for AI-powered voice agents, built on **Voximplant** + **Grok Voice Agent API** + **Node.js**.

- **VoxEngine scenarios** — inbound/outbound calls with Grok Voice Agent on Voximplant
- **Backend API** (Hono.js) — tenant management, agent config, call control — on **Railway**
- **Frontend** (Next.js) — client dashboard — on **Cloudflare Pages**

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
    - [Create a Voximplant Account](#create-a-voximplant-account)
    - [Get a Phone Number](#get-a-phone-number)
    - [Set Up Your Environment](#set-up-your-environment)
- [Configuration](#configuration)
    - [Environment Variables (.env)](#environment-variables-env)
    - [Service Account](#service-account)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Testing](#testing)
    - [Testing Inbound Calls (Sandbox)](#testing-inbound-calls-sandbox)
    - [Testing Outbound Calls](#testing-outbound-calls)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

This voice agent example demonstrates:

- Handling inbound phone calls via a Voximplant virtual number
- Making outbound phone calls to a real number
- Real-time conversation with Grok Voice Agent API
- Automated deployment using Voximplant CI/CD

All sensitive configuration is stored in `.env` — no hardcoded secrets in source files.

---

## Prerequisites

Before you begin, ensure you have:

- A Voximplant account ([sign up](https://manage.voximplant.com/auth/sign_up))
- A Voximplant service account JSON key ([guide](https://voximplant.com/docs/guides/management-api/authorization#service-accounts))
- Grok API key with Voice Agent access (from [x.ai](https://x.ai))
- Node.js 18+ installed
- [Railway](https://railway.app) account (for backend API)

---

## Getting Started

### Create a Voximplant Account

1. Go to [Voximplant Sign Up](https://manage.voximplant.com/auth/sign_up)
2. Complete registration: Email, Password, Account Name
3. Verify your email and finish the setup wizard
4. Create a service account in **Service Accounts** and download the JSON key

### Get a Phone Number

You need a phone number linked to your application. Two options:

**Option A: Rent a real number**
1. Go to **Numbers → Buy Number** in the Voximplant control panel
2. Select a country and purchase a number
3. It will be bound automatically during deployment

**Option B: Sandbox number (free, for testing)**
Voximplant provides a sandbox number for testing. To use it:
1. Skip buying a number
2. After deployment, call one of Voximplant's test numbers and enter your app's virtual number as an extension (see [Testing](#testing-inbound-calls-sandbox))

### Set Up Your Environment

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd grok-phone-agent
npm install
```

**Available commands:**

| Command | Description |
|---------|------------|
| `npm start` | Start Hono API server (Railway) |
| `npm run dev` | Dev mode with hot-reload |
| `npm run deploy:vox` | Deploy VoxEngine code to Voximplant |

---

## Configuration

All configuration is managed through `.env`. No need to edit JavaScript files.

### Environment Variables (.env)

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Your `.env` should look like this:

```env
# Voximplant CI Credentials
VOX_CI_CREDENTIALS=./voximplant-credentials.json
VOX_CI_ROOT_PATH=./voxengine_ci_source_files
VOX_ACCOUNT_NAME=your_account_name
VOX_NEW_APP_NAME=your-app-name
VOX_PHONE_NUMBER=your_virtual_number
SCRIPT_CUSTOM_DATA={"clientNum":"+12345678901"}

# xAI Grok Voice Agent
X_API_KEY=your_xai_api_key_here
GROK_MODEL=grok-voice-latest
SYSTEM_INSTRUCTIONS="You are a useful virtual assistant..."
```

| Variable | Description |
|---|---|
| `VOX_CI_CREDENTIALS` | Path to your Voximplant service account JSON file |
| `VOX_CI_ROOT_PATH` | Local CI working directory (gitignored) |
| `VOX_ACCOUNT_NAME` | Your Voximplant account name |
| `VOX_NEW_APP_NAME` | Name for the new Voximplant Application |
| `VOX_PHONE_NUMBER` | Your Voximplant virtual number (used as caller ID for outbound) |
| `SCRIPT_CUSTOM_DATA` | JSON with data passed to the outbound scenario (e.g., destination number) |
| `X_API_KEY` | Your xAI API key (must have Voice Agent API access) |
| `GROK_MODEL` | Grok voice model: `grok-voice-latest` (recommended) or a pinned version |
| `SYSTEM_INSTRUCTIONS` | System prompt for the Grok voice agent |

> The `application.config.json` uses `{{VARS}}` placeholders that are automatically substituted from `.env` during deployment.

### Service Account

Place your Voximplant service account JSON file in the project root (e.g., `voximplant-credentials.json`).

> **Security:** This file contains your private key. It is listed in `.gitignore` and must never be committed.

---

## Project Structure

```
grok-phone-agent/
├── backend/                              # ⬅ Hono API server (deployed on Railway)
│   └── src/
│       ├── index.js                      # Entry point (npm start / npm run dev)
│       ├── app.js                        # Hono app, middleware, routes
│       ├── routes/index.js               # Health check, API endpoints
│       └── db/index.js                   # Postgres connection
│
├── scenarios/                            # VoxEngine call handlers (deployed to Voximplant)
│   ├── inbound_handler.voxengine.js      # Incoming call handler
│   └── outbound_handler.voxengine.js     # Outgoing call handler
│
├── modules/                              # Grok integration modules
│   ├── credentials.voxengine.js          # Generated from .env at deploy (gitignored)
│   ├── agent_config.voxengine.js         # Generated from .env at deploy (gitignored)
│   └── grok_integration.voxengine.js     # Grok Voice Agent API (WebSocket, events)
│
├── application/                          # Voximplant app config templates
│   ├── application.config.json           # {{VAR}} placeholders
│   └── rules.config.json                 # Routing rules (inbound + outbound)
│
├── deploy.js                             # Deploy VoxEngine code to Voximplant CI
├── outbound.js                           # Trigger outbound call via Management API
├── railway.json                          # Railway deployment config
├── .env.example
└── .gitignore
```

### Key Files

| File | Purpose |
|---|---|---|
| `backend/src/index.js` | Hono API server entry point (Railway) |
| `backend/src/app.js` | Hono app setup, middleware, route registration |
| `backend/src/routes/index.js` | Health check + API routes |
| `backend/src/db/index.js` | Postgres connection via `postgres.js` |
| `scenarios/inbound_handler.voxengine.js` | Handles incoming calls and connects to Grok |
| `scenarios/outbound_handler.voxengine.js` | Makes outbound calls and attaches Grok after connection |
| `modules/grok_integration.voxengine.js` | WebSocket communication with Grok, audio routing, tool calls |
| `application/rules.config.json` | Defines `inboundCalls` (pattern `.*`) and `outboundCalls` (pattern `outbound`) rules |
| `deploy.js` | Reads `.env`, generates config files, runs Voxengine CI to upload everything |
| `outbound.js` | Starts an outbound call via the Voximplant Management API |

**How config generation works:** `deploy.js` reads `.env`, generates `credentials.voxengine.js` and `agent_config.voxengine.js` with your actual values, then uploads them together with the static scenarios.

---

## Deployment

### VoxEngine (Voximplant)

```bash
npm run deploy:vox
```

This runs `deploy.js` which:
1. Verifies env vars, initializes Voximplant CI
2. Generates `credentials.voxengine.js` + `agent_config.voxengine.js` from `.env`
3. Substitutes `{{VARS}}` in `application.config.json`
4. Uploads scenarios and rules to your Voximplant account
5. Binds phone number to the application

### Backend API (Railway)

Auto-deployed from GitHub — push to `main` triggers a deploy:

- **URL**: `https://grokphone-production.up.railway.app`
- **Health check**: `GET /health`

```bash
git push origin main        # → Railway auto-deploys
```

### Frontend (Cloudflare Pages)

```bash
cd frontend && npm run deploy:cf
```

---

## Testing

### Testing Inbound Calls (Sandbox)

If you have a sandbox (virtual) number instead of a real rented number:

1. In the Voximplant control panel, verify your sandbox number is active and linked to the application
2. Call **one of Voximplant's test numbers**:

   ```
   +74999384362  (Russia)
   +19292240694  (USA)
   +48223970842  (Poland)
   +97243720980  (Israel)
   +420228880669 (Czech)
   +14388002812  (Canada)
   +61283104145  (Australia)
   +442038083060 (UK)
   ```

3. After the automated greeting, **enter your virtual number** (e.g. `699113361`) as an extension using the keypad (DTMF)
4. The call will be routed to your application's `inbound_handler` scenario

**Expected behavior:**
- The call is answered by the VoxEngine scenario
- A Grok Voice Agent is created and connected
- Audio is transmitted in real time
- The dialogue continues until hangup or the `hangup_call` function is triggered

**Check results:**
- View **Call History** in the Voximplant panel
- Review scenario logs via `Logger.write` messages

### Testing Outbound Calls

**Prerequisites:**
- A rented phone number linked to the application
- Sufficient Voximplant account balance for outbound calls
- The `outboundCalls` rule is active

**Using the helper script:**

```bash
node outbound.js
```

This script:
- Fetches the `outboundCalls` rule ID from the Voximplant API
- Starts the scenario with `SCRIPT_CUSTOM_DATA` from `.env`
- The scenario calls `VoxEngine.callPSTN()` to dial the destination number
- After the callee answers, a Grok Voice Agent is attached

**Expected behavior:**
- An outbound call is placed from your virtual number to the client's number
- A Grok Voice Agent is created and the conversation begins
- The dialogue continues until hangup or the `hangup_call` function

---

## Troubleshooting

### Call rings but is not answered
- The phone number is a sandbox number — use a test number with extension (see [Testing Inbound Calls](#testing-inbound-calls-sandbox))
- The application is not bound to the phone number

### WebSocket closes with error 1011
- **xAI API key** does not have Voice Agent API access or has insufficient balance
- Check your xAI account at [console.x.ai](https://console.x.ai)
- Try the model `grok-voice-latest`

### Deployment fails with "Cannot add application"
- Check that `VOX_ACCOUNT_NAME` matches your Voximplant account name
- Delete the `voxengine_ci_source_files/` directory and retry

### Logs show "Module not found"
- The Grok module (`Modules.Grok`) is available by default on the Voximplant platform
- If missing, contact Voximplant support to enable it for your account

### Viewing logs
- Go to **Call History** in the Voximplant control panel
- Open a call session to see all `Logger.write` messages
- Check for WebSocket close codes and error messages

---

## License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full details.
