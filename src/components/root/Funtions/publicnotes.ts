import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  GetCommandOutput,
  PutCommandOutput,
  ScanCommandOutput
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

// Utility function to get userId from session storage
const getUserId = (): string | null => {
  return sessionStorage.getItem("userSub") || null;
};

export const postreq = async (
    eventName: string,
  ): Promise<PutCommandOutput> => {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found in session storage");
  
    const command = new PutCommand({
      TableName: "Requests",
      Item: {eventName },
    });
    return await docClient.send(command);
  };
  
  export const getAllRequests = async (): Promise<ScanCommandOutput> => {
    

  const command = new ScanCommand({
    TableName: "Requests",
    
  });
  return await docClient.send(command);
};