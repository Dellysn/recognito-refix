import { env } from "@/env.mjs";
import { s3Client } from "@/lib/helpers/s3";
import upload, { File } from "@/lib/multer";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import nc from "next-connect";
import { promisify } from "util";

const handler = nc<
  NextApiRequest & {
    files: File[];
  },
  NextApiResponse
>({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

function removeFileAfterUpload(filename: string) {
  fs.unlink(filename, (err) => {
    if (err) {
      return;
    }
  });
}

handler.use(upload.array("file"));
handler.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  console.log(session);
  console.log(req.files);

  try {
    const { name } = req.body;
    const files = req.files;
    if (files.length === 0) {
      return res.status(400).json({
        error: "Please select a file",
      });
    }

    console.log({
      name,
      files,
    });

    const asyncReadFile = promisify(fs.readFile);

    const urls: string[] = [];

    files.forEach(async (file: File) => {
      const _file = await asyncReadFile(file.path);
      const fileParams = {
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: file.filename,
        Body: _file,
        ContentType: file.mimetype,
      };
      const url = await s3Client.upload(fileParams).promise();
      console.log(url);
      if (url) {
        urls.push(url.Location);
        removeFileAfterUpload(file.path);
      } else {
        removeFileAfterUpload(file.path);
        return res.status(200).json({
          error: "Something went wrong",
        });
      }

      if (session) {
        const task = await prisma.task.create({
          data: {
            name,
            files: {
              set: urls,
            },
            status: "pending",
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
        if (task) {
          console.log(task);

          return res.status(201).json({
            task,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      error: "Something went wrong",
    });
  }
});

export default handler;
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
