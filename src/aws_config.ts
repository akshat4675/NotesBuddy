// src/awsConfig.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = import.meta.env.VITE_AWS_REGION;
const ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;


// Initialize the S3 client with credentials
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
export const uploadFileToS3 = async (file: File): Promise<void> => {
  const bucketName = BUCKET_NAME;

  if (!bucketName) {
    throw new Error("S3 bucket name is missing. Please set VITE_S3_BUCKET_NAME in your .env.local file.");
  }

  const params = {
    Bucket: bucketName,
    Key: file.name,
    Body: file,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    console.log("File uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

export default s3Client;
