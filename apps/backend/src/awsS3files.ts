import dotenv from "dotenv";
dotenv.config();

import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

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

export const getRootFilesandFolders = async (key: string, localPath: string) => {
    try {
        const listParams = { Bucket: AWS_S3_BUCKET_NAME, Prefix: key };
        const command = new ListObjectsV2Command(listParams);
        const data = await s3.send(command);

        if (!data.Contents || data.Contents.length === 0) {
            console.log("⚠️ No files found in source folder.");
            return;
        }

        for (const file of data.Contents) {
            if (!file.Key) continue;

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

export const saveTheFile = async (key: string, filePath: string, content: string) => {
    const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: content,
    }
    try {
        await s3.send(new PutObjectCommand(params));
        console.log("✅ File saved to S3:", key);
    } catch (error) {
        console.error("❌ Error saving file to S3:", error);
    }
}


export async function create_folder_file_s3(key: string) {
    try {
        const command = new PutObjectCommand(
            {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: key,
                Body: "",
            }

        )

        await s3.send(command);
        console.log("✅ Folder/file created in S3:", key);
    } catch (error) {
        console.error("❌ Error creating folder/file in S3:", error);
    }
}


export async function delete_folder_file_s3(key: string) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        });

        await s3.send(command);
        console.log("✅ Folder/file deleted from S3:", key);
    } catch (error) {
        console.error("❌ Error deleting folder/file from S3:", error);
    }
}


