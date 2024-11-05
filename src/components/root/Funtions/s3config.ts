// s3.ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3 Client Configuration using environment variables
const REGION = import.meta.env.VITE_AWS_REGION;
const ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;

// Configure S3 Client with credentials
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// Function to generate a presigned URL for downloading an object
export const getPresignedUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    // Generate a presigned URL valid for 1 hour (3600 seconds)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (err) {
    console.error("Error generating presigned URL", err);
    throw err;
  }
};
