import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_S3_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;


export const getImage = async (key) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
}

export const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
    const key = `aws:s3:${file.name}`;
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.data,
        ContentType: file.type,
      });
      
      await s3Client.send(command);
      urls.push(key);
    }
    
    return urls;
  };



