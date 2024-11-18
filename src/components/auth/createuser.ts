import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

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


const TABLE_NAME = "userinfo"; // Update to your actual table name



export const createUser = async ( userId: string ,name: string, email: string, phone: string) => {
  const user = {
    userId,
    name,
    email,
    phone,
  };

  const params = {
    TableName: TABLE_NAME,
    Item:{ userId, name, email, phone },
  };

  try {
    await docClient.send(new PutCommand(params));
    console.log("User created successfully:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Could not create user");
  }
};
