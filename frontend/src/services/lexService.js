import { LexRuntimeServiceClient, PostTextCommand } from "@aws-sdk/client-lex-runtime-service";


const credentials = {
  accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY,
};


const client = new LexRuntimeServiceClient({
  credentials,
  region: "us-east-1",
});

// const lexRuntime = new AWS.LexRuntime();

export const sendMessageToLex = async (message, sessionId, userRole, userId) => {
  // Set default values if any of the parameters are undefined
  const effectiveSessionId = sessionId || "unknown";
  const effectiveUserRole = userRole || "unknown";
  const effectiveUserId = userId || "unknown";

  console.log(effectiveSessionId);
  console.log(effectiveUserRole);
  console.log(effectiveUserId);

  try {

    const input = { // PostTextRequest
      botName: "DalVactionHome", // required
      botAlias: "prod", // required
      userId: effectiveUserId, // required
      sessionAttributes: { // StringMap
        "userRole": effectiveUserRole,
        "sessionId": effectiveSessionId
      },
      inputText: message, // required
    };
    const command = new PostTextCommand(input);
    const response = await client.send(command);
    return response.message;
  } catch (error) {
    console.error('Error sending message to Lex:', error);
    throw error;
  }
};
