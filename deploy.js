import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import VoximplantApiClient from '@voximplant/apiclient-nodejs';
import 'dotenv/config';

// Normalize env values to avoid inline comment leakage from .env
const cleanEnvValue = (value) =>
    typeof value === 'string' ? value.replace(/\s+#.*$/, '').trim() : value;

const VOX_CI_CREDENTIALS = cleanEnvValue(process.env.VOX_CI_CREDENTIALS);
const VOX_CI_ROOT_PATH = cleanEnvValue(process.env.VOX_CI_ROOT_PATH);
const VOX_ACCOUNT_NAME = cleanEnvValue(process.env.VOX_ACCOUNT_NAME);
const VOX_NEW_APP_NAME = cleanEnvValue(process.env.VOX_NEW_APP_NAME);
const VOX_PHONE_NUMBER = cleanEnvValue(process.env.VOX_PHONE_NUMBER);
const X_API_KEY = cleanEnvValue(process.env.X_API_KEY);
const GROK_MODEL = cleanEnvValue(process.env.GROK_MODEL) || 'grok-voice-think-fast-1.0';
const SYSTEM_INSTRUCTIONS = cleanEnvValue(process.env.SYSTEM_INSTRUCTIONS);

const setCleanEnv = (key, value) => {
    if (typeof value === 'undefined') {
        delete process.env[key];
        return;
    }
    process.env[key] = value;
};

setCleanEnv('VOX_CI_CREDENTIALS', VOX_CI_CREDENTIALS);
setCleanEnv('VOX_CI_ROOT_PATH', VOX_CI_ROOT_PATH);
setCleanEnv('VOX_ACCOUNT_NAME', VOX_ACCOUNT_NAME);
setCleanEnv('VOX_NEW_APP_NAME', VOX_NEW_APP_NAME);
setCleanEnv('VOX_PHONE_NUMBER', VOX_PHONE_NUMBER);

// ---------------------------
// Check required environment variables
// ---------------------------
const required = { VOX_CI_CREDENTIALS, VOX_CI_ROOT_PATH, VOX_ACCOUNT_NAME, VOX_NEW_APP_NAME, X_API_KEY };
const missing = Object.entries(required).filter(([, v]) => !v);
if (missing.length) {
    console.error(`Missing required env vars: ${missing.map(([k]) => k).join(', ')}`);
    process.exit(1);
}

// ---------------------------
// Define project paths
// ---------------------------
const projectRoot = __dirname;
const ciRootDir = VOX_CI_ROOT_PATH;
const sourceApplicationDir = path.join(projectRoot, 'application');
const sourceScenariosDir = path.join(projectRoot, 'scenarios');
const sourceVoiceAIDir = path.join(projectRoot, 'modules');

// ---------------------------
// Create CI root folder if it doesn't exist
// ---------------------------
if (!fs.existsSync(ciRootDir)) fs.mkdirSync(ciRootDir, { recursive: true });
console.log(`CI root folder ready: ${ciRootDir}`);

// ---------------------------
// Install Voximplant CI package
// ---------------------------
console.log('Installing @voximplant/voxengine-ci');
try {
    execSync('npm install @voximplant/voxengine-ci', { stdio: 'inherit' });
    console.log('Voximplant CI package installed');
} catch (err) {
    console.error('Failed to install Voximplant CI:', err);
    process.exit(1);
}

// ---------------------------
// Initialize CI
// ---------------------------
console.log('Initializing Voximplant CI');
try {
    execSync(`npx voxengine-ci init`, {
        stdio: 'inherit'
    });
    console.log('Voximplant CI initialized successfully');
} catch (err) {
    console.error('Voximplant CI initialization failed:', err);
    process.exit(1);
}

// ---------------------------
// Copy application config files (with template substitution)
// ---------------------------
const ciApplicationsDir = path.join(ciRootDir, 'applications');
const ciAppName = VOX_NEW_APP_NAME;
const accountName = VOX_ACCOUNT_NAME;
const ciApplicationDir = path.join(ciApplicationsDir, `${ciAppName}.${accountName}.voximplant.com`);

if (!fs.existsSync(ciApplicationDir)) fs.mkdirSync(ciApplicationDir, { recursive: true });

['application.config.json', 'rules.config.json'].forEach(file => {
    const src = path.join(sourceApplicationDir, file);
    const dest = path.join(ciApplicationDir, file);
    let content = fs.readFileSync(src, 'utf-8');
    // Replace {{VAR}} placeholders with env values
    content = content.replace(/\{\{(\w+)\}\}/g, (_, key) => process.env[key] || `{{${key}}}`);
    fs.writeFileSync(dest, content);
    console.log(`Config written to CI folder: ${file}`);
});

// ---------------------------
// Copy scenario scripts
// ---------------------------
const ciScenariosDir = path.join(ciRootDir, 'scenarios', 'src');
if (!fs.existsSync(ciScenariosDir)) fs.mkdirSync(ciScenariosDir, { recursive: true });

fs.readdirSync(sourceScenariosDir).forEach(file => {
    const src = path.join(sourceScenariosDir, file);
    const dest = path.join(ciScenariosDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Scenario copied: ${file}`);
});

// ---------------------------
// Generate config files from .env (credentials + agent_config)
// ---------------------------

// credentials.voxengine.js
const credentialsContent = `const X_API_KEY = '${X_API_KEY.replace(/'/g, "\\'")}';`;
fs.writeFileSync(path.join(ciScenariosDir, 'credentials.voxengine.js'), credentialsContent);
console.log(`Generated: credentials.voxengine.js (from .env X_API_KEY)`);

// agent_config.voxengine.js
const voxNum = VOX_PHONE_NUMBER || 'YOUR_RENTED_PHONE_NUMBER';
const safeInstructions = (SYSTEM_INSTRUCTIONS || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
const agentConfigContent = `const voxNum = '${voxNum.replace(/'/g, "\\'")}';
// Temporary explicit model until xAI changes the Voice Agent API default on May 31, 2026.
const GROK_MODEL = '${GROK_MODEL.replace(/'/g, "\\'")}';
const SYSTEM_INSTRUCTIONS = \`${safeInstructions}\`;`;

fs.writeFileSync(path.join(ciScenariosDir, 'agent_config.voxengine.js'), agentConfigContent);
console.log(`Generated: agent_config.voxengine.js (from .env)`);

// Copy remaining modules (grok_integration.voxengine.js) — skip the two we just generated
fs.readdirSync(sourceVoiceAIDir).forEach(file => {
    if (file === 'credentials.voxengine.js' || file === 'agent_config.voxengine.js') return;
    const src = path.join(sourceVoiceAIDir, file);
    const dest = path.join(ciScenariosDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Module copied: ${file}`);
});

// ---------------------------
// Upload application to Voximplant
// ---------------------------
console.log('Uploading application to Voximplant');
try {
    execSync(`npx voxengine-ci upload --application-name ${ciAppName}`, {
        stdio: 'inherit'
    });
    console.log('Application, rules, and scenarios uploaded successfully!');
} catch (err) {
    console.error('Upload failed:', err);
    process.exit(1);
}

// ---------------------------
// Attach phone number to application
// ---------------------------

console.log('Creating Voximplant Api Client');
const client = new VoximplantApiClient({
    pathToCredentials: VOX_CI_CREDENTIALS
});
client.onReady = async () => {
    console.log('Binding Phone Number to Application');
    try {
        const result = await client.PhoneNumbers.bindPhoneNumberToApplication({
            phoneNumber: VOX_PHONE_NUMBER,
            applicationName: ciAppName
        });

        console.log('Phone number bound successfully!');
        console.log(result);
        console.log('Deployment completed successfully!');
    } catch (err) {
        console.error('Binding failed:', err);
        process.exit(1);
    }
};
