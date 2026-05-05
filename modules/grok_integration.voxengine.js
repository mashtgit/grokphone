require(Modules.Grok);

async function createGrokVoiceAgent(call) {
    let voiceAgentAPIClient = undefined;
    let hangupCall = false, forwardToLiveAgent = false;

    const onWebSocketClose = (event) => {
        Logger.write('===ON_WEB_SOCKET_CLOSE==');
        Logger.write(JSON.stringify(event));
        VoxEngine.terminate();
    };

    const voiceAgentAPIClientParameters = {
        xAIApiKey: X_API_KEY,
        model: GROK_MODEL,
        onWebSocketClose,
    };

    voiceAgentAPIClient = await Grok.createVoiceAgentAPIClient(
        voiceAgentAPIClientParameters
    );

    voiceAgentAPIClient.addEventListener(
        Grok.VoiceAgentAPIEvents.ConversationCreated,
        (event) => {
            Logger.write('===Grok.VoiceAgentAPIEvents.ConversationCreated===');
            Logger.write(JSON.stringify(event));

            const sessionUpdateParameters = {
                session: {
                    voice: "Ara",
                    turn_detection: { type: "server_vad" },
                    instructions: SYSTEM_INSTRUCTIONS,
                    tools: [
                        {
                            type: "function",
                            name: "hangup_call",
                            description: "Hangup the call",
                            parameters: {
                                type: "object",
                                properties: {},
                                required: []
                            }
                        }
                    ]
                }
            };

            voiceAgentAPIClient.sessionUpdate(sessionUpdateParameters);
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.VoiceAgentAPIEvents.SessionUpdated,
        (event) => {
            Logger.write('===Grok.VoiceAgentAPIEvents.SessionUpdated===');
            Logger.write(JSON.stringify(event));

            VoxEngine.sendMediaBetween(call, voiceAgentAPIClient);

            const response = {};
            voiceAgentAPIClient.responseCreate(response);
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.VoiceAgentAPIEvents.Unknown,
        (event) => {
            Logger.write('===Grok.VoiceAgentAPIEvents.Unknown===');
            Logger.write(JSON.stringify(event));
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.VoiceAgentAPIEvents.WebSocketError,
        (event) => {
            Logger.write('===Grok.VoiceAgentAPIEvents.WebSocketError===');
            Logger.write(JSON.stringify(event));
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.VoiceAgentAPIEvents.InputAudioBufferSpeechStarted,
        (event) => {
            Logger.write('===Grok.VoiceAgentAPIEvents.InputAudioBufferSpeechStarted===');
            Logger.write(JSON.stringify(event));
            if (voiceAgentAPIClient) voiceAgentAPIClient.clearMediaBuffer();
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.VoiceAgentAPIEvents.ResponseCreated,
        (event) => {
            Logger.write('===Grok.VoiceAgentAPIEvents.ResponseCreated===');
            Logger.write(JSON.stringify(event));
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.VoiceAgentAPIEvents.ResponseFunctionCallArgumentsDone,
        (event) => {
            Logger.write('===Grok.VoiceAgentAPIEvents.ResponseFunctionCallArgumentsDone===');
            Logger.write(JSON.stringify(event));
            if (event.data.payload.name == "hangup_call") {
                hangupCall = true;

                const itemCreate = {
                    item: {
                        type: "function_call_output",
                        call_id: event.data.payload.call_id,
                        output: "{\"result\": \"Have a great day, goodbye!.\"}"
                    }
                };

                voiceAgentAPIClient.conversationItemCreate(itemCreate);
                voiceAgentAPIClient.responseCreate({});
            }
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.VoiceAgentAPIEvents.ResponseOutputAudioTranscriptDone,
        (event) => {
            Logger.write('===Grok.VoiceAgentAPIEvents.ResponseOutputAudioTranscriptDone===');
            Logger.write(JSON.stringify(event));
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.Events.WebSocketMediaStarted,
        (event) => {
            Logger.write('===Grok.Events.WebSocketMediaStarted===');
            Logger.write(JSON.stringify(event));
        }
    );

    voiceAgentAPIClient.addEventListener(
        Grok.Events.WebSocketMediaEnded,
        (event) => {
            Logger.write('===Grok.Events.WebSocketMediaEnded===');
            Logger.write(JSON.stringify(event));

            if (hangupCall) {
                VoxEngine.terminate();
            }
        }
    );

    return voiceAgentAPIClient;
}
