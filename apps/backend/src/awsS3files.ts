import dotenv from "dotenv";
dotenv.config();

import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { CompressFolder, UncompressFolder } from "./filesSystem";

const AWS_S3_REGION = process.env.AWS_S3_REGION || "";
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
const homeDir = "/home/ashwin-rai/Projects/DevZen/apps/backend";
const workspaceDir = path.join(homeDir, "workspace");
export async function uploadAllProjectsFromWorkspace() {
  // Ensure workspaceDir exists
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
    const files: string[] = [];

    const walk = (dir: string) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          walk(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    };

    walk(localProjectPath);

    for (const filePath of files) {
      const relativePath = path.relative(localProjectPath, filePath).replace(/\\/g, "/");
      const s3Key = `code/${projectId}/${relativePath}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: fs.createReadStream(filePath),
        })
      );
    }

    console.log(`✅ Uploaded ${files.length} files for project '${projectId}'`);
  }
}

export const getRootFilesandFolders = async (key: string, localPath: string) => {
  // Ensure localPath exists
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath, { recursive: true });
  }
  try {
    const listParams = { Bucket: AWS_S3_BUCKET_NAME, Prefix: key };
    const command = new ListObjectsV2Command(listParams);
    const Donwloadeddata = await s3.send(command);

    if (!Donwloadeddata.Contents || Donwloadeddata.Contents.length === 0) {
      console.log("⚠️ No files found in source folder.");
      return;
    }
    const projectId = key.split("/").pop();
    const zipFileName = `${projectId}.zip`;
    const zipFileKey = Donwloadeddata.Contents.find(f => f.Key && f.Key.endsWith(zipFileName))?.Key;
    if (zipFileKey) {
      const getObjectParams = { Bucket: AWS_S3_BUCKET_NAME, Key: zipFileKey };
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const objectData = await s3.send(getObjectCommand);
      if (objectData.Body) {
        const zipBuffer = await streamToBuffer(objectData.Body as any);
        const zipFilePath = path.join(localPath, zipFileName);
        await writeFile(zipFilePath, zipBuffer);
        await UncompressFolder(localPath);
      }
    }



    for (const file of Donwloadeddata.Contents) {
      if (!file.Key) continue;
      if (file.Key.endsWith('.zip')) continue;

      const getObjectParams = { Bucket: AWS_S3_BUCKET_NAME, Key: file.Key };
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const objectData = await s3.send(getObjectCommand);

      if (!objectData.Body) {
        console.warn(`⚠️ Skipping empty file: ${file.Key}`);
        continue;
      }

      const fileBuffer = await streamToBuffer(objectData.Body as any);
      const filePath = path.join(localPath, file.Key.replace(key, ""));
      await writeFile(filePath, fileBuffer);
      console.log(`✅ Downloaded: ${file.Key} -> ${filePath}`);

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



