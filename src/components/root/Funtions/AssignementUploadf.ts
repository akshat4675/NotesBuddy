import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

// Retrieve the stored token from sessionStorage
const idToken: string | null = sessionStorage.getItem("idToken");

// Initialize Cognito identity client and credentials
const identityClient = new CognitoIdentityClient({ region: "ap-south-1" });
const Credentials = fromCognitoIdentityPool({
  client: identityClient,
  identityPoolId: "ap-south-1:0552001a-378b-4154-be28-84a0ea5b9f10",
  logins: {
    "cognito-idp.ap-south-1.amazonaws.com/ap-south-1_epWmiSTO9": idToken as string, // Ensure idToken is a string
  },
});

// Initialize DynamoDB and S3 clients
const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: Credentials,
});

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: Credentials,
});

// Constants for table and bucket names
const SUBS_TABLE_NAME = import.meta.env.VITE_SUBs_TABLE_NAME || "Subs";
const ASSIGNMENT_TABLE_NAME = import.meta.env.VITE_ASSIGNMENT_TABLE_NAME || "Assignment";
const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME || "testbucket4675";

if (!S3_BUCKET_NAME) {
  throw new Error("Missing S3 bucket name. Please check your .env file.");
}

// Helper function to get the user ID from session storage
const getUserId = (): string | null => {
  return sessionStorage.getItem("userSub") || null;
};

// Function to fetch subjects (renamed to getSubs for frontend)
export async function getSubs() {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new ScanCommand({
    TableName: SUBS_TABLE_NAME,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: marshall({
      ":userId": userId,
    }),
  });

  try {
    const response = await dynamoClient.send(command);
    return response.Items ? response.Items.map((item) => unmarshall(item)) : [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
}

// Function to add a subject (renamed to addSub for frontend)
export async function addSub(name: string) {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new PutItemCommand({
    TableName: SUBS_TABLE_NAME,
    Item: marshall({
      Id: `${userId}-${Date.now().toString()}`,
      name,
      userId, // Include userId for user-specific data
    }),
  });

  try {
    await dynamoClient.send(command);
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
}

// Function to fetch assignments for a subject (kept as getAssignments)
export async function getAssignments(subId: string) {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new ScanCommand({
    TableName: ASSIGNMENT_TABLE_NAME,
    FilterExpression: "subId = :subId AND userId = :userId",
    ExpressionAttributeValues: marshall({
      ":subId": subId,
      ":userId": userId,
    }),
  });

  try {
    const response = await dynamoClient.send(command);
    return response.Items ? response.Items.map((item) => unmarshall(item)) : [];
  } catch (error) {
    console.error("Error fetching assignments:", error);
    throw error;
  }
}

// Function to add an assignment (kept as addAssignment)
export async function addAssignment(subId: string, name: string, file: File) {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const fileKey = `${userId}/${subId}/${file.name}`; // Prefix S3 key with userId

  // Upload file to S3
  const uploadCommand = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
    Body: file,
  });

  try {
    // Upload the file to S3
    await s3Client.send(uploadCommand);

    // Add assignment to DynamoDB with userId
    const addAssignmentCommand = new PutItemCommand({
      TableName: ASSIGNMENT_TABLE_NAME,
      Item: marshall({
        Id: `${userId}-${Date.now().toString()}`, // Use "Id" instead of "id" for consistency
        subId,
        name,
        pdfUrl: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
        userId, // Include userId for user-specific retrieval
      }),
    });

    await dynamoClient.send(addAssignmentCommand);
  } catch (error) {
    console.error("Error adding assignment:", error);
    throw error;
  }
}
