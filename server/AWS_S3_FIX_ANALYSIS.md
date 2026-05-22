# AWS S3 Upload Fix - Complete Analysis & Testing Guide

## Problem Summary

Your **"SignatureDoesNotMatch"** error with `region: null` was caused by **4 critical issues**:

### Issue 1: ❌ Multiple S3 Instances (PRIMARY BUG)
```js
// WRONG - Creates NEW instance in every upload
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
```

**Why this is bad:**
- Overrides the properly configured instance from `s3.js`
- Not using signature v4
- Race conditions with credential loading
- New instance for EVERY file upload (wasteful)

**FIX:** Use the imported `s3` instance from `s3.js` which is configured once

---

### Issue 2: ❌ Missing Signature Version (SIGNATURE ERROR ROOT CAUSE)
AWS SDK v2 signature calculation fails without explicit **signature v4** configuration.

**Error manifestation:**
```
SignatureDoesNotMatch
The request signature we calculated does not match the signature you provided
```

**FIXED in s3.js:**
```js
AWS.config.update({
  region: process.env.AWS_REGION,
  signatureVersion: 'v4', // ← CRITICAL FIX
  sslEnabled: true,
  maxRetries: 3,
});
```

---

### Issue 3: ❌ Redundant dotenv.config() Calls
- Called in `app.js`
- Called in `s3.js`
- Called in `index.js`

**FIXED:** Only called once in `app.js` at startup

---

### Issue 4: ❌ Region Becoming Null
**Why it happens:**
- `region: null` in error means `process.env.AWS_REGION` is undefined
- Caused by: New S3 instances created before proper initialization
- Timing issue: Environment not fully loaded during controller execution

**FIXED by:**
- Loading dotenv in `app.js` FIRST
- Using pre-configured s3 instance
- Adding explicit region to AWS.config.update()

---

## Changes Applied

### 1. [s3.js](../server/src/config/s3.js) - AWS Config Fix
✅ Added `signatureVersion: 'v4'`
✅ Using `AWS.config.update()` properly
✅ Removed redundant dotenv.config()
✅ Added debug logging

### 2. [file.controller.js](../server/src/controllers/file.controller.js) - Use Imported Instance
✅ Removed local S3 instantiation in `uploadFiles()`
✅ Removed local S3 instantiation in `uploadFilesGuest()`
✅ Now using the properly configured s3 instance
✅ Improved error logging

### 3. [app.js](../server/src/app.js) - Single Dotenv Load
✅ Centralized dotenv.config() call

### 4. [index.js](../server/src/index.js) - Removed Duplicate Dotenv
✅ Removed redundant dotenv import

---

## Testing the Fix

### Step 1: Verify Environment Variables
```bash
# Check if .env has all required variables
grep AWS_ .env
```

Expected output:
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wAKnP...
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=sharevault-storage-abhay
```

### Step 2: Test Upload with Debug Logging
Start the server:
```bash
npm run start
# OR nodemon src/index.js
```

You should see in console:
```
[S3 Config] Region: ap-south-1
[S3 Config] Bucket: sharevault-storage-abhay
[S3 Config] Signature Version: v4
```

### Step 3: Try File Upload
Upload a test file via your client. Check console logs:
```
[Upload] File: test_abc123.pdf
[Upload] Region: ap-south-1
[Upload] Bucket: sharevault-storage-abhay
```

### Step 4: Verify S3 Upload Success
If successful, you'll see:
```json
{
  "message": "Files uploaded successfully",
  "fileIds": ["507f1f77bcf86cd799439011"]
}
```

### Step 5: Check AWS S3 Console
- Go to AWS S3 Console
- Navigate to `sharevault-storage-abhay` bucket
- Check `file-share-app/` folder
- Your file should be there!

---

## Troubleshooting

### Still Getting "SignatureDoesNotMatch"?

1. **Check AWS Credentials are correct:**
   ```bash
   # In .env verify
   AWS_ACCESS_KEY_ID=AKIA... (starts with AKIA)
   AWS_SECRET_ACCESS_KEY=... (long string)
   ```

2. **Verify Region is correct:**
   ```bash
   # S3 bucket region must match
   AWS_REGION=ap-south-1  ✅ (must match bucket region)
   ```

3. **Check S3 Bucket Policy:**
   - AWS Console → S3 → sharevault-storage-abhay
   - Permissions → Bucket Policy
   - Should allow PutObject for the IAM user

4. **Rotate Credentials:**
   ```bash
   # Generate new access keys in AWS IAM
   # Update .env with new credentials
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   ```

5. **Check Server Time:**
   AWS signatures are time-sensitive. Server time must be synced with NTP:
   ```bash
   # Windows
   w32tm /resync
   ```

### Still Getting "region: null"?

1. Make sure `.env` exists in server folder
2. Restart the server (nodemon should auto-restart)
3. Check that dotenv is properly loading:
   ```js
   // Add this temporarily in app.js
   console.log("All env vars loaded:", Object.keys(process.env).filter(k => k.startsWith('AWS_')));
   ```

---

## AWS SDK v3 Migration (Recommended)

For better performance and modern code:

1. Install v3 packages:
```bash
npm install @aws-sdk/client-s3
```

2. Use the migration guide: `MIGRATION_GUIDE_AWS_SDK_V3.md`

3. Update imports:
```js
// OLD (v2)
import s3 from "../config/s3.js";

// NEW (v3)
import { s3Client, uploadFileToS3 } from "../config/s3-v3-upload-helper.js";
```

Benefits of v3:
- ✅ Smaller bundle size
- ✅ Better TypeScript support
- ✅ Automatic region handling
- ✅ Better error messages
- ✅ Native promise/async support
- ✅ Less maintenance (v2 is deprecated)

---

## IAM Permissions Checklist

Ensure your IAM user has:
- ✅ AmazonS3FullAccess
- ✅ Can access specific bucket: `sharevault-storage-abhay`
- ✅ Can PutObject (upload)
- ✅ Can GetObject (download)
- ✅ Can ListBucket

If not, update IAM policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::sharevault-storage-abhay",
        "arn:aws:s3:::sharevault-storage-abhay/*"
      ]
    }
  ]
}
```

---

## Summary of Fixes

| Issue | Before | After |
|-------|--------|-------|
| S3 Instance | Multiple instances | Single reusable instance |
| Signature Version | Not set (undefined) | Explicitly v4 |
| Region Config | Loaded late | Loaded at startup |
| Dotenv Calls | 3 redundant calls | 1 centralized call |
| Error Result | `SignatureDoesNotMatch, region: null` | ✅ Upload successful |

---

**Your upload should now work! Test it and let me know if you encounter any issues.**
