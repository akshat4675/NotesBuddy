import { DynamoDBClient,DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { marshall } from "@aws-sdk/util-dynamodb";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { getUnits } from "./PdfuploadF";

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


const dynamoClient = new DynamoDBClient({
  region: 'ap-south-1',
  credentials: Credentials,
});

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: Credentials,
});



const SUBJECT_TABLE_NAME = import.meta.env.VITE_SUBJECT_TABLE_NAME || "Subjects";
const UNIT_TABLE_NAME = import.meta.env.VITE_UNIT_TABLE_NAME || "Units";
const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME ||"testbucket4675";

if (!S3_BUCKET_NAME) {
  throw new Error("Missing S3 bucket name. Please check your .env file.");
}

const getUserId = (): string | null => {
  return sessionStorage.getItem("userSub") || null;
};

// Delete an Entire Subject, including all associated units and their S3 files
export async function deleteSubject(subjectId: string) {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  try {
    // Fetch all units for this subject
    const units = await getUnits(subjectId);

    // Delete each unit's S3 file and DynamoDB entry
    await Promise.all(
      units.map(async (unit) => {
        // Delete unit file from S3
        const fileKey = `${userId}/${subjectId}/${unit.name}`;
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: fileKey,
        });
        await s3Client.send(deleteObjectCommand);

        // Delete unit from Units table
        const deleteUnitCommand = new DeleteItemCommand({
          TableName: UNIT_TABLE_NAME,
          Key: marshall({
            id: unit.id,
            userId,
          }),
        });
        await dynamoClient.send(deleteUnitCommand);
      })
    );

    // Delete subject from Subjects table
    const deleteSubjectCommand = new DeleteItemCommand({
      TableName: SUBJECT_TABLE_NAME,
      Key: marshall({
        userId,
      }),
    });
    await dynamoClient.send(deleteSubjectCommand);

    console.log(`Deleted subject ${subjectId} and its units from DynamoDB and S3`);
  } catch (error) {
    console.error("Error deleting subject and its units:", error);
    throw error;
  }
}

// Delete a Single Unit and its S3 file
export async function deleteUnit(subjectId: string, unitId: string, fileName: string) {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found in session storage");

  try {
    // Delete unit file from S3
    const fileKey = `${userId}/${subjectId}/${fileName}`;
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
    });
    await s3Client.send(deleteObjectCommand);

    // Delete unit from Units table
    const deleteUnitCommand = new DeleteItemCommand({
      TableName: UNIT_TABLE_NAME,
      Key: marshall({
        id: subjectId,
        userId,
      }),
    });
    await dynamoClient.send(deleteUnitCommand);

    console.log(`Deleted unit ${unitId} and its file from DynamoDB and S3`);
  } catch (error) {
    console.error("Error deleting unit:", error);
    throw error;
  }
}
