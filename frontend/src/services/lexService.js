import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY,
});

const lexRuntime = new AWS.LexRuntime();

export const sendMessageToLex = async (message, sessionId, userRole, userId) => {
  // Set default values if any of the parameters are undefined
  const effectiveSessionId = sessionId || "unknown";
  const effectiveUserRole = userRole || "unknown";
  const effectiveUserId = userId || "unknown";

  console.log(effectiveSessionId);
  console.log(effectiveUserRole);
  console.log(effectiveUserId);

  const params = {
    botName: "DalVactionHome",
    botAlias: "prod",
    userId: effectiveUserId,  
    inputText: message,
    sessionAttributes: {
      "userRole": effectiveUserRole,
      "sessionId": effectiveSessionId
    }
  };

  try {
    const response = await lexRuntime.postText(params).promise();
    return response.message;
  } catch (error) {
    console.error('Error sending message to Lex:', error);
    throw error;
  }
};
