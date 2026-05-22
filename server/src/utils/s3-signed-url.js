import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3-client.js";

const S3_PREFIX = "file-share-app";

export const getS3ObjectKey = (fileName) => `${S3_PREFIX}/${fileName}`;

/**
 * @param {string} fileName - stored file name in S3
 * @param {{ disposition?: 'inline' | 'attachment', expiresIn?: number }} options
 */
export async function createSignedGetUrl(fileName, options = {}) {
  const { disposition = "attachment", expiresIn = 24 * 60 * 60 } = options;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: getS3ObjectKey(fileName),
    ResponseContentDisposition:
      disposition === "inline"
        ? `inline; filename="${fileName}"`
        : `attachment; filename="${fileName}"`,
  };

  const command = new GetObjectCommand(params);
  return getSignedUrl(s3Client, command, { expiresIn });
}
