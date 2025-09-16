import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: 'AKIAZI4IXKQHQHQHQHQH',
    secretAccessKey: 'your-secret-key-here'
  }
});

export const getComplaintImageUrl = async (userId, complaintId) => {
  try {
    const key = `complaints/${userId}/${complaintId}/image.jpg`;
    
    const command = new GetObjectCommand({
      Bucket: 'your-bucket-name',
      Key: key
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};