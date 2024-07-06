import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const client = new DynamoDBClient();

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function caesarCipher(str, shift) {
  return str.split('').map(char => {
    const code = char.charCodeAt(0);

    // Check if the character is a uppercase letter
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }

    // Check if the character is a lowercase letter
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }

    // If it's not a letter, return the character as is
    return char;
  }).join('');
}

const handler = async (event) => {
  console.log({event: JSON.stringify(event)})
  if (event.request.challengeName !== "CUSTOM_CHALLENGE") {
    return event;
  }

  if (event.request.session.length === 2) {
    event.response.publicChallengeParameters = {};
    event.response.privateChallengeParameters = {};
    const input = { // GetItemInput
      TableName: "security_questions", // required
      Key: { 
        "username": {
          S: event.userName
        }
      }
    }
    const command = new GetItemCommand(input);
    const response = await client.send(command);
    const user_question = unmarshall(response.Item);
    event.response.publicChallengeParameters.type =
      "SECURITY_QUESTION";
    event.response.publicChallengeParameters.securityQuestion = user_question.question;
    event.response.privateChallengeParameters.answer = user_question.answer;
    event.response.challengeMetadata = "SECURITY_QUESTION";
  }

  if (event.request.session.length === 3) {
    const code = ['CODE', 'ROOT', 'PASS', 'USER', 'SAFE', 'HACK', 'LOCK'];
    const random_index = getRandomNumber(0, code.length);
    event.response.publicChallengeParameters = {};
    event.response.privateChallengeParameters = {};
    const input = { // GetItemInput
      TableName: "caesar_keys", // required
      Key: { 
        "username": {
          S: event.userName
        }
      }
    }
    const command = new GetItemCommand(input);
    const response = await client.send(command);
    const cipher_key = unmarshall(response.Item);
    event.response.publicChallengeParameters.securityQuestion = caesarCipher(code[random_index], cipher_key.key)
      event.response.publicChallengeParameters.type =
      "CAESAR";
    event.response.privateChallengeParameters.answer = code[random_index];
    event.response.challengeMetadata = "CAESAR";
  }

  return event;
};

export { handler }