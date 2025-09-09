import dotenv from "dotenv";
dotenv.config();

import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { CompressFolder } from "./filesSystem";

const AWS_S3_REGION = process.env.AWS_S3_REGION || "ap-south-1";
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY || "";
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY || "";

const s3 = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_KEY,
  },
});

// Base workspace path inside container
const homeDir = "/workspace";
const workspaceDir = path.join(homeDir, "/");

export async function uploadAllProjectsFromWorkspace() {
  if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir, { recursive: true });
  }
  console.log("Compressing folder");
  await CompressFolder();
  console.log("Compressed folder");
  const projectDirs = fs.readdirSync(workspaceDir).filter((name) => {
    const fullPath = path.join(workspaceDir, name);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const projectId of projectDirs) {
    const localProjectPath = path.join(workspaceDir, projectId);
    const zipFilePath = path.join(localProjectPath, `${projectId}.zip`);
    const s3Key = `code/${projectId}/${projectId}.zip`;

    if (fs.existsSync(zipFilePath)) {
      const fileStream = fs.createReadStream(zipFilePath);
      await s3.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: fileStream,
        })
      );
      console.log(`✅ Uploaded zip for project '${projectId}'`);
    } else {
      console.warn(`⚠️ Zip file not found for project '${projectId}'`);
    }
  }
}

export const getRootFilesandFolders = async (key: string, localPath: string, projectId: string) => {
  const projectDir = path.join(localPath, projectId);
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  try {
    const listParams = { Bucket: AWS_S3_BUCKET_NAME, Prefix: key };
    const command = new ListObjectsV2Command(listParams);
    const downloadedData = await s3.send(command);

    if (!downloadedData.Contents || downloadedData.Contents.length === 0) {
      console.log("⚠️ No files found in source folder.");
      return;
    }

    for (const file of downloadedData.Contents) {
      if (!file.Key || !file.Key.endsWith('.zip')) continue;

      const getObjectParams = { Bucket: AWS_S3_BUCKET_NAME, Key: file.Key };
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const objectData = await s3.send(getObjectCommand);

      if (!objectData.Body) {
        console.warn(`⚠️ Skipping empty file: ${file.Key}`);
        continue;
      }

      const fileBuffer = await streamToBuffer(objectData.Body as any);
      const destPath = path.join(projectDir, `${projectId}.zip`);
      await writeFile(destPath, fileBuffer);
      console.log(`✅ Downloaded and renamed: ${file.Key} -> ${destPath}`);
      break;
    }
  } catch (error) {
    console.error("❌ Error fetching S3 files:", error);
  }
};

const streamToBuffer = async (stream: any): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

function writeFile(filePath: string, fileData: Buffer): Promise<void> {
  return new Promise(async (resolve, reject) => {
    await createFolder(path.dirname(filePath));

    fs.writeFile(filePath, fileData, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function createFolder(dirName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirName, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}



