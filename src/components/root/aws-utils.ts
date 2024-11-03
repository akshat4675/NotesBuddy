import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";


// Load environment variables
const AWS_REGION = import.meta.env.VITE_AWS_REGION;
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS configuration. Please check your .env file.");
}

const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});


const SUBJECT_TABLE_NAME = import.meta.env.VITE_SUBJECT_TABLE_NAME || "Subjects";
const UNIT_TABLE_NAME = import.meta.env.VITE_UNIT_TABLE_NAME || "Units";
const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;

if (!S3_BUCKET_NAME) {
  throw new Error("Missing S3 bucket name. Please check your .env file.");
}

const getUserId = (): string | null => {
  return sessionStorage.getItem("userSub") || null;
};



export async function getSubjects() {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new ScanCommand({
    TableName: SUBJECT_TABLE_NAME,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: marshall({
      ":userId": userId,
    }),
  });

  try {
    const response = await dynamoClient.send(command);
    return response.Items ? response.Items.map(item => unmarshall(item)) : [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
}


export async function addSubject(name: string) {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new PutItemCommand({
    TableName: SUBJECT_TABLE_NAME,
    Item: marshall({
      id: `${userId}-${Date.now().toString()}`,
      name,
      userId, // Include userSub here for user-specific data
    }),
  });

  try {
    await dynamoClient.send(command);
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
}

export async function getUnits(subjectId: string) {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const command = new ScanCommand({
    TableName: UNIT_TABLE_NAME,
    FilterExpression: "subjectId = :subjectId AND userId = :userId",
    ExpressionAttributeValues: marshall({
      ":subjectId": subjectId,
      ":userId": userId,
    }),
  });

  try {
    const response = await dynamoClient.send(command);
    return response.Items ? response.Items.map(item => unmarshall(item)) : [];
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
}

export async function addUnit(subjectId: string, name: string, file: File) {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  const fileKey = `${userId}/${subjectId}/${Date.now()}-${file.name}`; // Prefix S3 key with userId

  // Upload file to S3
  const uploadCommand = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
    Body: file,
  });

  try {
    await s3Client.send(uploadCommand);

    // Add unit to DynamoDB with userId
    const addUnitCommand = new PutItemCommand({
      TableName: UNIT_TABLE_NAME,
      Item: marshall({
        id: `${userId}-${Date.now().toString()}`,
        subjectId,
        name,
        pdfUrl: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
        userId, // Include userId for user-specific retrieval
      }),
    });

    await dynamoClient.send(addUnitCommand);
  } catch (error) {
    console.error("Error adding unit:", error);
    throw error;
  }
}

