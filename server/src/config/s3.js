// import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });

// export default s3;


import AWS from "aws-sdk";

// CRITICAL: Pass credentials directly to S3 constructor for proper initialization
// Do NOT rely on AWS.config.update() alone - it doesn't always propagate to S3 instance
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4', // REQUIRED for ap-south-1 region
  sslEnabled: true,
  maxRetries: 3,
  httpOptions: {
    timeout: 30000,
  },
});

// Also update global config as fallback
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('[S3 Config] Region:', process.env.AWS_REGION);
  console.log('[S3 Config] Bucket:', process.env.AWS_BUCKET_NAME);
  console.log('[S3 Config] Signature Version: v4');
  console.log('[S3 Config] Access Key:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 10) + '***');
}

export default s3;