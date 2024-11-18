import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import "@/globals.css"
// Retrieve the stored token from sessionStorage
 // Adjust key based on how you store the token


const idToken: string | null = sessionStorage.getItem('idToken');

const identityClient = new CognitoIdentityClient({ region: 'ap-south-1' });

const Credentials = fromCognitoIdentityPool({
  client: identityClient,
  identityPoolId: 'ap-south-1:0552001a-378b-4154-be28-84a0ea5b9f10',
  logins: {
    'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_epWmiSTO9': idToken as string, // Assert idToken is a string
  },
});

export default Credentials;

// Initialize DynamoDB client using environment variables
const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: Credentials,
});

// Create DynamoDB Document client
const docClient = DynamoDBDocumentClient.from(client);

// Utility function to get userId from session storage
const getUserId = (): string | null => {
  return sessionStorage.getItem("userSub") || null;
};

const TableName = "userinfo"; // Replace with your DynamoDB table name

// Fetch user data from DynamoDB
export const fetchUserData = async (userId: string) => {
  try {
    const params = {
      TableName,
      Key: {
        userId: { S: userId }, // Partition key
      },
    };

    const command = new GetItemCommand(params);
    const data = await docClient.send(command);

    if (data.Item) {
      return {
        name: data.Item.name?.S || "",
        email: data.Item.email?.S || "",
        phone: data.Item.phone?.S || "",
      };
    } else {
      throw new Error("User not found.");
    }
  } catch (err) {
    throw new Error("Failed to fetch user data: " + (err instanceof Error ? err.message : "Unknown error"));
  }
};

// Update user data in DynamoDB
export const updateUserData = async (userId: string, name: string, email: string, phone: string) => {
  try {
    const params = {
      TableName,
      Key: {
        userId: { S: userId }, // Partition key
      },
      UpdateExpression: "SET #n = :name, #e = :email, #p = :phone",
      ExpressionAttributeNames: {
        "#n": "name",
        "#e": "email",
        "#p": "phone",
      },
      ExpressionAttributeValues: {
        ":name": { S: name },
        ":email": { S: email },
        ":phone": { S: phone },
      },
    };

    const command = new UpdateItemCommand(params);
    await docClient.send(command);
    return "Profile updated successfully.";
  } catch (err) {
    throw new Error("Failed to update profile: " + (err instanceof Error ? err.message : "Unknown error"));
  }
};
