import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";

const lexClient = new LexRuntimeV2Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

export const sendMessageToLex = async (message, sessionId) => {
  const params = {
    botAliasId: "TSTALIASID",
    botId: "0NW7NZXY0B",
    localeId: "en_US",
    sessionId,
    text: message,
  };

  try {
    const command = new RecognizeTextCommand(params);
    const response = await lexClient.send(command);
    return response;
  } catch (error) {
    console.error("Error sending message to Lex:", error);
    throw error;
  }
};
