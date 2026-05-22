/**
 * AWS SDK v3 Implementation Example for File Controller
 * =====================================================
 * 
 * To migrate from v2 to v3:
 * 
 * 1. Install AWS SDK v3 packages:
 *    npm install @aws-sdk/client-s3
 * 
 * 2. Replace the S3 config import in file.controller.js:
 *    OLD: import s3 from "../config/s3.js";
 *    NEW: import { s3Client, uploadFileToS3 } from "../config/s3-v3-upload-helper.js";
 * 
 * 3. Update upload functions as shown below:
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Helper function to upload file to S3
 * Handles error logging and retries
 */
export const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `file-share-app/${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    const response = await s3Client.send(command);
    
    // Construct S3 URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/file-share-app/${fileName}`;
    
    return {
      success: true,
      location: fileUrl,
      eTag: response.ETag,
    };
  } catch (error) {
    console.error('[S3 Upload Error]', {
      fileName,
      error: error.message,
      code: error.Code,
    });
    throw error;
  }
};

export { s3Client };


/**
 * UPDATED uploadFiles function using SDK v3
 * ===========================================
 * 
 * const uploadFiles = async (req, res) => {
 *   if (!req.files || req.files.length === 0) {
 *     return res.status(400).json({ error: 'No files uploaded' });
 *   }
 * 
 *   const { isPassword, password, hasExpiry, expiresAt, userId } = req.body;
 * 
 *   try {
 *     const savedFiles = [];
 *     const user = await User.findById(userId);
 *     if (!user) return res.status(404).json({ error: 'User not found' });
 * 
 *     for (const file of req.files) {
 *       const originalName = file.originalname;
 *       const extension = path.extname(originalName);
 *       const fileNameWithoutExt = path.basename(originalName, extension);
 *       const uniqueSuffix = shortid.generate();
 *       const finalFileName = `${fileNameWithoutExt.replace(/\s+/g, '_')}_${uniqueSuffix}${extension}`;
 * 
 *       console.log("[Upload] Uploading:", finalFileName);
 * 
 *       // Upload to S3 using v3
 *       const s3Result = await uploadFileToS3(
 *         file.buffer,
 *         finalFileName,
 *         file.mimetype
 *       );
 * 
 *       const fileUrl = s3Result.location;
 *       const shortCode = shortid.generate();
 * 
 *       const fileObj = {
 *         path: fileUrl,
 *         name: finalFileName,
 *         type: file.mimetype,
 *         size: file.size,
 *         hasExpiry: hasExpiry === 'true',
 *         expiresAt: hasExpiry === 'true'
 *           ? new Date(Date.now() + expiresAt * 3600000)
 *           : new Date(Date.now() + 10 * 24 * 3600000),
 *         status: 'active',
 *         shortUrl: `/f/${shortCode}`,
 *         createdBy: userId,
 *       };
 * 
 *       if (isPassword === 'true') {
 *         const hashedPassword = await bcrypt.hash(password, 10);
 *         fileObj.password = hashedPassword;
 *         fileObj.isPasswordProtected = true;
 *       }
 * 
 *       const newFile = new File(fileObj);
 *       const savedFile = await newFile.save();
 *       savedFiles.push(savedFile);
 * 
 *       user.totalUploads += 1;
 *       if (file.mimetype.startsWith('image/')) user.imageCount += 1;
 *       else if (file.mimetype.startsWith('video/')) user.videoCount += 1;
 *       else if (file.mimetype.startsWith('application/')) user.documentCount += 1;
 *     }
 * 
 *     await user.save();
 * 
 *     return res.status(201).json({
 *       message: "Files uploaded successfully",
 *       fileIds: savedFiles.map(f => f._id),
 *     });
 *   } catch (error) {
 *     console.error("Upload error:", error);
 *     res.status(500).json({ message: "File upload failed", error: error.message });
 *   }
 * };
 */
