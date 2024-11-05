import { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: Credentials,
});

// Initialize DynamoDB Client


const dynamoDBClient  = DynamoDBDocumentClient.from(client);

// Helper function to get `userSub` from session storage
const getUserId = (): string | null => {
  return sessionStorage.getItem("userSub") || null;
};

// Add a new to-do item
export async function addToDo(taskDescription: string): Promise<void> {
  const userSub = getUserId();
  if (!userSub) throw new Error("User not authenticated");

  const taskId = uuidv4();

  const params = {
    TableName: "ToDoTable",
    Item: {
      userSub: { S: userSub },
      taskId: { S: taskId },
      taskDescription: { S: taskDescription },
      isCompleted: { BOOL: false }
    }
  };

  await dynamoDBClient.send(new PutItemCommand(params));
}

export async function getToDos() {
  const userSub = getUserId();
  if (!userSub) throw new Error("User not authenticated");

  const params = {
    TableName: "ToDoTable",
    FilterExpression: "userSub = :userSub",
    ExpressionAttributeValues: {
      ":userSub": { S: userSub }
    }
  };

  const data = await dynamoDBClient.send(new ScanCommand(params));
  return data.Items?.map((item) => ({
    taskId: item.taskId.S as string,
    taskDescription: item.taskDescription.S as string,
    isCompleted: item.isCompleted.BOOL as boolean
  })) || [];
}

// Updated to accept a dynamic `isCompleted` value
export async function completeToDo(taskId: string, isCompleted: boolean): Promise<void> {
  const userSub = getUserId();
  if (!userSub) throw new Error("User not authenticated");

  const params = {
    TableName: "ToDoTable",
    Key: {
      userSub: { S: userSub },
      taskId: { S: taskId }
    },
    UpdateExpression: "SET isCompleted = :isCompleted",
    ExpressionAttributeValues: {
      ":isCompleted": { BOOL: isCompleted }
    }
  };

  await dynamoDBClient.send(new UpdateItemCommand(params));
}

export async function deleteToDo(taskId: string): Promise<void> {
  const userSub = getUserId();
  if (!userSub) throw new Error("User not authenticated");

  const params = {
    TableName: "ToDoTable",
    Key: {
      userSub: { S: userSub },
      taskId: { S: taskId }
    }
  };

  await dynamoDBClient.send(new DeleteItemCommand(params));
}