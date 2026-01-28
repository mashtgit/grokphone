const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const VoximplantApiClient = require('@voximplant/apiclient-nodejs').default;
require('dotenv').config();

// Normalize env values to avoid inline comment leakage from .env
const cleanEnvValue = (value) =>
    typeof value === 'string' ? value.replace(/\s+#.*$/, '').trim() : value;

const VOX_CI_CREDENTIALS = cleanEnvValue(process.env.VOX_CI_CREDENTIALS);
const VOX_CI_ROOT_PATH = cleanEnvValue(process.env.VOX_CI_ROOT_PATH);
const VOX_ACCOUNT_NAME = cleanEnvValue(process.env.VOX_ACCOUNT_NAME);
const VOX_NEW_APP_NAME = cleanEnvValue(process.env.VOX_NEW_APP_NAME);
const VOX_PHONE_NUMBER = cleanEnvValue(process.env.VOX_PHONE_NUMBER);

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
if (!VOX_CI_CREDENTIALS || !VOX_CI_ROOT_PATH) {
    console.error('Please set VOX_CI_CREDENTIALS and VOX_CI_ROOT_PATH in your .env file');
    process.exit(1);
}

// ---------------------------
// Define project paths
// ---------------------------
const projectRoot = __dirname;
const ciRootDir = VOX_CI_ROOT_PATH; // Root folder for Voximplant CI source files
const sourceApplicationDir = path.join(projectRoot, 'application'); // Folder with app configs
const sourceScenariosDir = path.join(projectRoot, 'scenarios'); // Folder with scenario scripts
const sourceVoiceAIDir = path.join(projectRoot, 'modules'); // Folder with ai script

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
// Copy application config files
// ---------------------------
const ciApplicationsDir = path.join(ciRootDir, 'applications');
const ciAppName = VOX_NEW_APP_NAME; // Application name
const accountName = VOX_ACCOUNT_NAME;   // Account name
const ciApplicationDir = path.join(ciApplicationsDir, `${ciAppName}.${accountName}.voximplant.com`);

// Create application folder if it doesn't exist
if (!fs.existsSync(ciApplicationDir)) fs.mkdirSync(ciApplicationDir, { recursive: true });

// Copy configs
['application.config.json', 'rules.config.json'].forEach(file => {
    const src = path.join(sourceApplicationDir, file);
    const dest = path.join(ciApplicationDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Config copied to CI folder: ${file}`);
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
// Copy modules scripts
// ---------------------------
fs.readdirSync(sourceVoiceAIDir).forEach(file => {
    const src = path.join(sourceVoiceAIDir, file);
    const dest = path.join(ciScenariosDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Scenario copied: ${file}`);
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