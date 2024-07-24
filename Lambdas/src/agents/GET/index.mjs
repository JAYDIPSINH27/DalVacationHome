// Import the required AWS SDK clients and commands for Node.js
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

// Initialize the CognitoIdentityProviderClient
const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export const handler = async (event) => {
  const userPoolId = "us-east-1_1gMhUA7Dk"; // Replace with your Cognito User Pool ID
  const roleFilter = "agent";

  try {
    // Fetch all users from Cognito User Pool
    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
    });

    let users = [];
    let nextToken;

    // Loop to handle pagination
    do {
      if (nextToken) {
        command.input.PaginationToken = nextToken;
      }

      const response = await client.send(command);
      users = users.concat(response.Users);
      nextToken = response.PaginationToken;
    } while (nextToken);

    // Filter users with attribute role = "agent"
    const filteredUsers = users.filter((user) => {
      const roleAttribute = user.Attributes.find((attr) => attr.Name === "custom:role");
      return roleAttribute && roleAttribute.Value === roleFilter;
    });

    // Prepare the list of filtered users to return
    const result = filteredUsers.map((user) => ({
      username: user.Username,
      attributes: user.Attributes,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching users" }),
    };
  }
};
