import { env } from "@/env.mjs";
import s3 from "aws-sdk/clients/s3";

export const s3Client = new s3({
  region: env.AWS_S3_REGION,
  accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_S3_ACCESS_SECRET,
});
