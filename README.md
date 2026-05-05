# Grok Voice Agent Example with Voximplant

A ready-to-run example demonstrating inbound and outbound calls with Grok Voice Agent integrated via Voximplant CI.

This project showcases **fully automated creation of Voximplant Application, Scenarios, and Rules** with **Grok Voice Agent API** for voice interactions.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
    - [Create a Voximplant Account](#create-a-voximplant-account)
    - [Purchase a Phone Number](#purchase-a-phone-number)
    - [Set Up Your Environment](#set-up-your-environment)
- [Project Structure](#project-structure)
    - [Inbound Call Handling](#inbound-call-handling)
    - [Outbound Call Handling](#outbound-call-handling)
    - [Grok Voice Agent Integration](#grok-voice-agent-integration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Additional Resources](#additional-resources)
- [Support](#support)

---

## Overview

This voice agent example demonstrates:

- 📞 Handling inbound phone calls
- 📱 Making outbound phone calls
- 🤖 Real-time conversation with Grok Voice Agent API
- 🔄 Automated deployment using Voximplant CI/CD

It is designed to work **out-of-the-box** with minimal setup.

---

## Prerequisites

Before you begin, ensure you have:

- A valid email address for Voximplant account registration
- Basic knowledge of JavaScript
- Grok API credentials (from [x.ai](https://x.ai))
- Git and Node.js installed

---

## Getting Started

### Create a Voximplant Account

1. Go to [Voximplant Sign Up](https://manage.voximplant.com/auth/sign_up)
2. Complete registration: Email, Password, Account Name
3. Verify your email and finish the setup wizard

### Purchase a Phone Number

1. Log in to Voximplant control panel
2. Navigate: **Numbers → Buy Number**
3. Select a country and choose a number
4. Complete the purchase
5. Attach the number to your Application (to be created in the next steps)

### Set Up Your Environment

#### Clone the repository

```bash
git clone https://github.com/voximplant/grok-voice-agent-example.git
cd grok-voice-agent-example
```

#### Install dependencies

```bash
npm install
```

### Add Voximplant CI Credentials

Copy the example file, then update it with your Voximplant CI credentials and application settings:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
# Voximplant CI Credentials
VOX_CI_CREDENTIALS=/path/to/voximplant-credentials.json   # Path to Voximplant service account JSON
VOX_CI_ROOT_PATH=./voxengine_ci_source_files              # Local directory for CI source files
VOX_ACCOUNT_NAME=your_account_name                        # e.g. "mycompany"
VOX_NEW_APP_NAME=your_new_app_name                        # e.g. "grok-voice-agent"
VOX_PHONE_NUMBER=your_rented_phone_number                 # Rented phone number on Voximplant Platform
SCRIPT_CUSTOM_DATA={"clientNum":"+12345678901"}           # Set the phone number you want to make outbound call to
```

Notes

- `VOX_CI_CREDENTIALS` — path to the JSON file you downloaded from Voximplant containing your API key and account information.
- `VOX_CI_ROOT_PATH` — local folder where the CI source files will be prepared before deployment.
- `VOX_ACCOUNT_NAME` — your Voximplant account name.
- `VOX_NEW_APP_NAME` — the name you want to give to the new Voximplant Application.
- `VOX_PHONE_NUMBER` — your rented Voximplant number used as the outbound caller ID
- `SCRIPT_CUSTOM_DATA` — JSON string containing data to pass to the scenario (e.g., client phone number).

> 💡 Tip: VOX_CI_CREDENTIALS should point to the JSON file you downloaded from Voximplant with your API key and account information (read more [how to get it](https://voximplant.com/docs/guides/management-api/authorization#service-accounts))

> 💡 Tip: Make sure the `.env` file is **not committed to version control**, as it contains sensitive credentials. .env is part of the project .gitignore by default.

### Configure Application Name and Account

Update the `application.config.json` file in the `application/` folder:

```json
{
  "applicationName": "YOUR_NEW_APP_NAME.YOUR_ACCOUNT_NAME.voximplant.com"
}
```
- **`YOUR_NEW_APP_NAME`** — the name you want to give to the new Voximplant Application
- **`YOUR_ACCOUNT_NAME`** — your Voximplant account name (as used in your credentials)

> 💡 **Tip:** This name must match the account name in your `.env` file (`VOX_ACCOUNT_NAME`) and your desired application name (`VOX_NEW_APP_NAME`). Otherwise, the deployment script will fail.

### Configure Voice Agent

The integration with Grok requires an **API key** and **system instructions** for the LLM. These settings are defined in two modules:

- `modules/credentials.voxengine.js` — API key (gitignored)
- `modules/agent_config.voxengine.js` — system instructions and caller ID

#### Example configuration (credentials):

```javascript
const X_API_KEY = 'YOUR_X_API_KEY';
```

#### Example configuration (agent config):

```javascript
const voxNum = 'YOUR_RENTED_PHONE_NUMBER';
const GROK_MODEL = 'grok-voice-think-fast-1.0';
const SYSTEM_INSTRUCTIONS = `
Your system instructions go here...
`;
```

Notes

- `X_API_KEY` — your API key from Grok (xAI).
- `GROK_MODEL` — the Grok Voice Agent model to use. `grok-voice-think-fast-1.0` is the recommended model for new deployments. `grok-voice-fast-1.0` is the legacy default in the xAI API.
- `SYSTEM_INSTRUCTIONS` — the system prompt or instructions you want the LLM to follow during the call.
- `voxNum` — your rented Voximplant number used as the outbound caller ID.
- These values are used in both **inbound** and **outbound** scenarios.

> 💡 Tip: Keep your API key private. Do not commit real keys to a public repository. `modules/credentials.voxengine.js` is listed in `.gitignore`.

### Set Voximplant Phone Number

The project uses a rented Voximplant number for both **incoming** and **outgoing** calls. Set the caller ID in `modules/agent_config.voxengine.js`:

```javascript
const voxNum = 'YOUR_RENTED_PHONE_NUMBER';
```

> 💡 Tip: Make sure the same number is properly linked in Voximplant for both inbound and outbound rules to avoid call errors.

### Run the Local CI Deployment

Once your environment and credentials are set up, run the local CI deployment script:

```bash
node deploy.js
```

This script will:

- **Verify your environment variables** (`.env` file) to ensure all required credentials and paths are set.
- **Initialize the Voximplant CI project**, creating the necessary structure for deployment.
- **Copy all scenarios, modules, and configuration files** into the CI project folder.
- **Upload the Application, Rules, and Scenarios** to your Voximplant account.
- **Bind rented phone number** to the uploaded Application

After running the script:
- Ensure the number is associated with two created rules.
   
Now your application will be **fully deployed and ready for testing**.

> 💡 Tip: If you encounter errors, check that your `.env` variables are correct and that your Voximplant account has **sufficient permissions and balance**.

## Project Structure

```
grok-voice-agent-example/
├── scenarios/
│   ├── inbound_handler.voxengine.js      # Incoming call handler
│   └── outbound_handler.voxengine.js     # Outgoing call handler
│
├── modules/
│   ├── credentials.voxengine.js          # API key (gitignored)
│   ├── agent_config.voxengine.js         # System instructions + caller ID
│   └── grok_integration.voxengine.js     # Grok Voice Agent API integration
│
├── application/
│   ├── application.config.json           # Voximplant Application configuration
│   └── rules.config.json                 # Routing rules configuration
│
├── deploy.js                             # Local CI deployment script for Voximplant
├── outbound.js                           # Script using Voximplant API Client to start outbound calls
├── package.json
├── .env
├── .env.example
├── .gitignore
├── voxengine_ci_source_files/            # Generated by CI (gitignored)
└── README.md
```

### Description of Key Files

- `scenarios/inbound_handler.voxengine.js` — handles all **incoming calls** and connects them to Grok Voice Agent
- `scenarios/outbound_handler.voxengine.js` — initiates **outgoing calls** and attaches Grok Voice Agent after connecting
- `modules/credentials.voxengine.js` — stores Grok API key (gitignored)
- `modules/agent_config.voxengine.js` — stores caller ID and LLM system instructions
- `modules/grok_integration.voxengine.js` — manages the WebSocket communication with Grok, audio routing, and events
- `application/application.config.json` — defines your Voximplant Application name
- `application/rules.config.json` — contains inbound and outbound routing rules
- `deploy.js` — local CI script to automate deployment of Application, Rules, and Scenarios
- `outbound.js` — local script using Voximplant API Client to automate outbound call initiation
- `.env` — environment variables such as Voximplant credentials and app name


## Testing

This section describes how to test **incoming** and **outgoing** calls after successfully deploying the application in Voximplant using `deploy.js`.

Before testing, make sure that:

- The application is successfully uploaded to Voximplant.
- A phone number is rented and linked to the application.
- The scenarios and rules are active.

---

### Testing Incoming Calls (Inbound)

**Steps:**

1. In the Voximplant control panel, verify that:
    - The rented phone number is linked to your Application.
    - The rule `inboundCalls` is active.

2. Make a regular phone call to the rented Voximplant number.

3. **Expected behavior:**
    - The call will be handled by the `inbound_handler` scenario.
    - A Grok Voice Agent will be created.
    - Audio will be transmitted in real time between the caller and Grok.
    - The dialogue continues until the call ends or the LLM function `hangup_call` is triggered.

4. **Check logs and results:**
    - View **Call History** in the Voximplant panel.
    - Check scenario logs via `Logger.write` messages.

---

### Testing Outgoing Calls (Outbound)

**Steps:**

1. **Verify setup in Voximplant control panel:**
    - Ensure your **rented phone number** is linked to your application.
    - Make sure the **`outboundCalls` rule** is active.

2. **Use the outbound helper script (recommended):**
```bash
node outbound.js
```

**Alternative: call the API directly**

```bash
curl -X POST "https://api.voximplant.com/platform_api/StartScenarios" \
  -d "account_name=YOUR_ACCOUNT_NAME" \
  -d "application_id=YOUR_APP_ID" \
  -d "api_key=YOUR_API_KEY" \
  -d "rule_id=YOUR_OUTBOUND_RULE_ID" \
  -d 'script_custom_data={"clientNum":"+12345678901"}'
```

3. **Expected behavior:**
   - The script **automatically fetches the `ruleId`** for the outbound rule.
   - `scriptCustomData` (e.g., client phone number) is passed to the scenario.
   - The call is placed from your **rented Voximplant number** to the client’s number.
   - A **Grok Voice Agent** is created and attached to the call.
   - Audio is transmitted in **real time** between the caller and Grok.
   - The dialogue continues until the call ends or the LLM triggers `hangup_call`.

4. **Verify logs and results:**
   - Check **Call History** in the Voximplant control panel.
   - Review scenario logs via `Logger.write` for step-by-step execution.
---

### Verification

For both inbound and outbound calls:

- Check **Call History** in Voximplant.
- Review scenario logs (`Logger.write`).
- Ensure the Grok WebSocket connection is properly closed after the call ends.

> 💡 Tip: Always test with both inbound and outbound calls to verify **end-to-end voice interaction** with the Grok Voice Agent.

## Next Steps

Once this sample is running, you can explore broader Voximplant capabilities such as:

- **Voice AI orchestration** — a serverless runtime for speech-to-speech, speech-to-text, and text-to-speech pipelines with code-driven control. Mix and match speech/LLM components, use wideband audio for higher fidelity, and scale globally on a distributed network.
- **SIP connectivity** — deep SIP support with trunking and registration interoperability for carriers, PBXs, and SBCs, so your agent can plug into existing telecom environments.
- **WhatsApp calling** — support for the WhatsApp Business Calling API to place and receive calls inside WhatsApp for multi-channel voice experiences.
- **SDKs** — run the same agent across phone numbers, SIP, native mobile apps, WebRTC, and WhatsApp without changing your call logic.

Learn more about Voximplant and Voice AI on: [voximplant.ai](https://voximplant.ai)

## Troubleshooting

### Common Issues

**Issue: Calls not connecting**
- Verify your phone number is properly configured.
- Check that your application is attached to the phone number.
- Ensure your account has sufficient balance.

**Issue: Grok API errors**
- Verify your API key is correct.
- Check API rate limits.
- Review API endpoint URLs.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes:
```bash
git commit -m 'Add amazing feature'
```
4. Push to your branch
```bash
git push origin feature/amazing-feature
```
5. Open a Merge Request (Pull Request) for review.

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for full details.
