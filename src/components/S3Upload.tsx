// src/components/S3Upload.tsx
import React, { useState } from "react";
import { uploadFileToS3 } from "../aws_config";

const S3Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      await uploadFileToS3(file);
      setMessage("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload to S3"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default S3Upload;
