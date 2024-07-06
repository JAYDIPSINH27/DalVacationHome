import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();


const handler = async (event) => {
  // TODO implement
  event.response.autoConfirmUser = true;
  console.log({event: JSON.stringify(event)})
  const secrutiy_questions = JSON.parse(event.request.validationData.security_questions);
 const input = {
      "Item": {
        "username": {
          "S": event.userName
        },
        "key": {
          "N": event.request.validationData.caesar_key
        }
      },
      "TableName": "caesar_keys"
    };
    const input2 = {
      "Item": {
        "username": {
          "S": event.userName
        },
        "question": {
          "S": secrutiy_questions.question
        },
        "answer": {
          "S": secrutiy_questions.answer
        }
      },
      "TableName": "security_questions"
    }
    try {
        const command = new PutItemCommand(input);
        const command2 = new PutItemCommand(input2);
        const response = await client.send(command);
        const response2 = await client.send(command2);
        return event;
    } catch (error) {
        console.error('Error writing to DynamoDB:', error);
        throw new Error('Error writing to DynamoDB: ' + error);
    }
    
};

export { handler }