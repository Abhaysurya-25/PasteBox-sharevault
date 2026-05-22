import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// AWS SDK v3 - Modern, recommended approach
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

if (process.env.NODE_ENV === 'development') {
  console.log('[S3 Client v3] Region:', process.env.AWS_REGION);
  console.log('[S3 Client v3] Ready');
}

export { s3Client, PutObjectCommand, DeleteObjectCommand };
