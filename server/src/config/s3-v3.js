// AWS SDK v3 implementation (Modern approach - RECOMMENDED)
// To use this, run: npm install @aws-sdk/client-s3
// Then replace: import s3 from "../config/s3.js" with: import s3Client from "../config/s3-v3.js"

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * AWS SDK v3 S3 Client Configuration
 * More performant, smaller bundle size, and better TypeScript support
 */
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('[S3 Client v3] Region:', process.env.AWS_REGION);
  console.log('[S3 Client v3] Bucket:', process.env.AWS_BUCKET_NAME);
  console.log('[S3 Client v3] Ready for uploads');
}

export default s3Client;
export { PutObjectCommand };
