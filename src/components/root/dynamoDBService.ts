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

// Function to fetch an event by event ID for a specific user
export const getEventById = async (id: string): Promise<GetCommandOutput> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new GetCommand({
    TableName: "CalendarEvents",
    Key: { userId, id },
  });
  return await docClient.send(command);
};

// Function to add a new event for a specific user
export const addEvent = async (
  id: string,
  eventName: string,
  date: string
): Promise<PutCommandOutput> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new PutCommand({
    TableName: "CalendarEvents",
    Item: { userId, id, eventName, date },
  });
  return await docClient.send(command);
};

// Function to fetch all events for a specific user
export const getAllEvents = async (): Promise<ScanCommandOutput> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new ScanCommand({
    TableName: "CalendarEvents",
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });
  return await docClient.send(command);
};

// Function to delete an event by event name for a specific user
export const deleteEventByName = async (
  eventName: string
): Promise<void> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new DeleteCommand({
    TableName: "CalendarEvents",
    Key: {
      userId,      
      eventName,   
    },
    ConditionExpression: "eventName = :eventName",
    ExpressionAttributeValues: {
      ":eventName": eventName,
    },
  });
  await docClient.send(command);
};
