import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"; 
import { unmarshall } from "@aws-sdk/util-dynamodb";
const client = new DynamoDBClient();

export const handler = async (event) => {
  
  const input = {
    TableName: "question_bank",
  }
  try{
  const command = new ScanCommand(input);
  const data = await client.send(command);
  const items = data.Items.map( (item) => {
    return unmarshall(item);
});
  // TODO implement
  const response = {
    statusCode: 200,
    body: items
  };
  return response;
  }catch(e){
    console.error('Error fetching data from DynamoDB:', e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
  }
};
