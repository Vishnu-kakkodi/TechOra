import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Uploads a file to S3.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The key (path) where the file will be stored.
 * @param filePath - The local file path of the file to upload.
 * @param contentType - The MIME type of the file.
 * @returns The S3 upload response, including the file URL.
 */
export const uploadToS3 = async (
  bucketName: string,
  key: string,
  filePath: string,
  contentType: string
) => {
  try {
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return { Location: fileUrl };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
