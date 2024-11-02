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

// Initialize DynamoDB client with environment variables for AWS credentials and region
const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Utility function to get userId from sessionStorage
const getUserId = (): string | null => {
  return sessionStorage.getItem("userSub") || null;
};

// Fetch an event by event ID for a specific user
export const getEventById = async (id: string): Promise<GetCommandOutput> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new GetCommand({
    TableName: "CalendarEvents",
    Key: { userId, id }, // Partition key with userId
  });
  return await docClient.send(command);
};

// Add a new event for a specific user
export const addEvent = async (
  id: string,
  eventName: string,
  date: string
): Promise<PutCommandOutput> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new PutCommand({
    TableName: "CalendarEvents",
    Item: { userId, id, eventName, date }, // Include userId in Item
  });
  return await docClient.send(command);
};

// Fetch all events for a specific user
export const getAllEvents = async (): Promise<ScanCommandOutput> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new ScanCommand({
    TableName: "CalendarEvents",
    FilterExpression: "userId = :userId", // Filter for the specific userId
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });
  return await docClient.send(command);
};

// Delete an event by event name for a specific user
export const deleteEventByName = async (
  eventName: string
): Promise<void> => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new DeleteCommand({
    TableName: "CalendarEvents",
    Key: {
      userId,     // Partition key
      eventName,         // Sort key if using both `userId` and `id` for uniqueness
    },
    ConditionExpression: "eventName = :eventName",
    ExpressionAttributeValues: {
      ":eventName": eventName,
    },
  });
  await docClient.send(command);
};
