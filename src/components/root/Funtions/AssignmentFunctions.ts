import { PutItemCommand, DeleteItemCommand, DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const idToken: string | null = sessionStorage.getItem('idToken');
const identityClient = new CognitoIdentityClient({ region: 'ap-south-1' });

const Credentials = fromCognitoIdentityPool({
  client: identityClient,
  identityPoolId: 'ap-south-1:0552001a-378b-4154-be28-84a0ea5b9f10',
  logins: {
    'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_epWmiSTO9': idToken as string,
  },
});

export default Credentials;

const dynamoClient = new DynamoDBClient({
  region: 'ap-south-1',
  credentials: Credentials,
});

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: Credentials,
});

const SUBJECT_TABLE_NAME = import.meta.env.VITE_ASSIGNMENT_TABLE_NAME || "Assignements";
const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME || "testbucket4675";

if (!S3_BUCKET_NAME) {
  throw new Error("Missing S3 bucket name. Please check your .env file.");
}

const getUserId = (): string | null => {
  return sessionStorage.getItem("userSub") || null;
};

interface UploadData {
  subjectName: string;
  unitName: string;
  file: File;
}

// Upload PDF to S3 and store metadata in DynamoDB
export async function uploadDataToDynamoDB({ subjectName, unitName, file }: UploadData): Promise<void> {
  const userId = getUserId();
  if (!userId) {
    throw new Error("User is not logged in.");
  }

  const fileName = file.name;
  const fileKey = `${userId}/${subjectName}/${unitName}/${file.name}`;
  const s3Params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
    Body: file,
    ContentType: 'application/pdf',
  };

  try {
    // Upload PDF to S3
    await s3Client.send(new PutObjectCommand(s3Params));
    const pdfUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    const subjectUnitId = `${subjectName}_${unitName}`;

    // Save metadata to DynamoDB
    const dynamoParams = {
      TableName: SUBJECT_TABLE_NAME,
      Item: marshall({
        userId,
        subjectUnitId,
        pdfUrl,
        subjectName,
        unitName,
        fileName,
      }),
    };
    await dynamoClient.send(new PutItemCommand(dynamoParams));
    console.log('Data successfully uploaded to S3 and DynamoDB');
  } catch (error) {
    console.error('Error uploading data:', error);
    throw error;
  }
}

interface DeleteData {
  subjectName: string;
  unitName: string;
  fileName: string;
}

// Delete PDF and metadata
export async function deleteDataFromDynamoDB({ subjectName, unitName, fileName }: DeleteData): Promise<void> {
  const userId = getUserId();
  if (!userId) {
    throw new Error("User is not logged in.");
  }

  const fileKey = `${userId}/${subjectName}/${unitName}/${fileName}`;
  const s3Params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    // Delete PDF from S3
    await s3Client.send(new DeleteObjectCommand(s3Params));
    console.log(`PDF deleted from S3: ${fileKey}`);

    const subjectUnitId = `${subjectName}_${unitName}`;
    // Delete metadata from DynamoDB
    const dynamoParams = {
      TableName: SUBJECT_TABLE_NAME,
      Key: marshall({
        userId,
        subjectUnitId,
      }),
    };

    await dynamoClient.send(new DeleteItemCommand(dynamoParams));
    console.log('Metadata successfully deleted from DynamoDB');
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
}

// Fetch subjects and their units with PDF links
export async function fetchSubjects(): Promise<Array<{ subjectName: string; unitName: string; pdfUrl: string; fileName: string }>> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User is not logged in.");
  }

  const params = {
    TableName: SUBJECT_TABLE_NAME,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  try {
    const result = await dynamoClient.send(new ScanCommand(params));
    const items = result.Items ? result.Items.map((item) => unmarshall(item)) : [];

    return items.map(item => ({
      subjectName: item.subjectName,
      unitName: item.unitName,
      pdfUrl: item.pdfUrl,
      fileName: item.fileName,  // Ensure consistency with PDF name field
    }));
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
}
