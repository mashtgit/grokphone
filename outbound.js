const VoximplantApiClient = require('@voximplant/apiclient-nodejs').default;
require('dotenv').config();

// Normalize env values to avoid inline comment leakage from .env
const cleanEnvValue = (value) =>
    typeof value === 'string' ? value.replace(/\s+#.*$/, '').trim() : value;

const VOX_CI_CREDENTIALS = cleanEnvValue(process.env.VOX_CI_CREDENTIALS);
const VOX_NEW_APP_NAME = cleanEnvValue(process.env.VOX_NEW_APP_NAME);
const SCRIPT_CUSTOM_DATA = cleanEnvValue(process.env.SCRIPT_CUSTOM_DATA);

const setCleanEnv = (key, value) => {
    if (typeof value === 'undefined') {
        delete process.env[key];
        return;
    }
    process.env[key] = value;
};

setCleanEnv('VOX_CI_CREDENTIALS', VOX_CI_CREDENTIALS);
setCleanEnv('VOX_NEW_APP_NAME', VOX_NEW_APP_NAME);
setCleanEnv('SCRIPT_CUSTOM_DATA', SCRIPT_CUSTOM_DATA);

if (!VOX_CI_CREDENTIALS || !VOX_NEW_APP_NAME || !SCRIPT_CUSTOM_DATA) {
    console.error('Credentials in .env is not set');
    process.exit(1);
}

console.log('Creating Voximplant API client');

const client = new VoximplantApiClient({
    pathToCredentials: VOX_CI_CREDENTIALS
});

client.onReady = async () => {
    try {
        console.log('Fetching routing rules');

        const rulesResponse = await client.Rules.getRules({
            applicationName: VOX_NEW_APP_NAME,
            ruleName: 'outboundCalls',
            withScenarios: true
        });

        if (!rulesResponse.result || rulesResponse.result.length === 0) {
            throw new Error(`Rule 'outboundCalls' not found in application "${VOX_NEW_APP_NAME}"`);
        }

        const rule = rulesResponse.result[0];
        const ruleId = rule.ruleId;
        console.log(`Rule found: 'outboundCalls', ruleId=${ruleId}`);

        console.log('Starting scenario');

        const startResult = await client.Scenarios.startScenarios({
            ruleId: ruleId,
            scriptCustomData: SCRIPT_CUSTOM_DATA
        });

        console.log('Scenario started successfully');
        console.log(startResult);

        process.exit(0);
    } catch (err) {
        console.error('Failed to start scenario:', err);
        process.exit(1);
    }
};
