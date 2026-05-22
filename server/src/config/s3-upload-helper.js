import { s3Client, PutObjectCommand } from "./s3-client.js";

/**
 * Upload file to S3 using AWS SDK v3
 * Returns S3 file URL
 */
export const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `file-share-app/${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    // Send upload command
    await s3Client.send(command);

    // Construct file URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/file-share-app/${fileName}`;

    return fileUrl;
  } catch (error) {
    console.error('[S3 Upload Error]', {
      file: fileName,
      error: error.message,
      code: error.Code,
    });
    throw error;
  }
};
