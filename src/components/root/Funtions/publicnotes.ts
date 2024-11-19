import { PutItemCommand,  DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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


const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: Credentials,
});

const REGION = "ap-south-1";
const TABLE_NAME = "publicnotes";
const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME || "testbucket4675";

if (!BUCKET_NAME) {
  throw new Error("Missing S3 bucket name. Please check your .env file.");
}



export const uploadPdfToS3 = async (file: File): Promise<string> => {
    const fileKey = `public/${Date.now()}-${file.name}`;
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
};

const dynamoDbClient = new DynamoDBClient({
    region: 'ap-south-1',
    credentials: Credentials,
  });
  

export const savePdfUrlToDynamoDB = async (id: string,  url: string,fileName: string): Promise<void> => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: { S: id },
            url: { S: url },
            fileName: { S: fileName }
        },
    };

    try {
        await dynamoDbClient.send(new PutItemCommand(params));
    } catch (error) {
        console.error("Error saving to DynamoDB:", error);
        throw error;
    }
};

export const fetchPdfUrlsFromDynamoDB = async (): Promise<{ id: string; url: string, fileName: string  }[]> => {
    const params = { TableName: TABLE_NAME };

    try {
        const data = await dynamoDbClient.send(new ScanCommand(params));
        return data.Items?.map((item) => ({
            id: item.id.S || "",
            url: item.url.S || "",
            fileName: item.fileName.S || "",
        })) || [];
    } catch (error) {
        console.error("Error fetching from DynamoDB:", error);
        throw error;
    }
};