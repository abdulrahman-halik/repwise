import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

export const ASSETS_BUCKET = 'assets';

export async function uploadAsset(key: string, body: Buffer | Uint8Array | string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: ASSETS_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return await s3.send(command);
}

export async function listAssets(prefix?: string) {
  const command = new ListObjectsV2Command({
    Bucket: ASSETS_BUCKET,
    Prefix: prefix,
  });
  return await s3.send(command);
}

export async function getAssetSignedUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: ASSETS_BUCKET,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn });
}

