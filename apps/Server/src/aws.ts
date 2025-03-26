import dotenv from "dotenv";
dotenv.config();

import { S3Client, ListObjectsV2Command,CopyObjectCommand } from "@aws-sdk/client-s3";

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

export const copyFolder = async (sourcePrefix: string, destinationPrefix: string, continuationToken?: string) => {
    

    if (!AWS_S3_BUCKET_NAME) {
        console.error("❌ AWS_S3_BUCKET_NAME is missing! Check your environment variables.");
        throw new Error("AWS_S3_BUCKET_NAME is missing from environment variables.");
    }

    try {
        const listParams = {
            Bucket: AWS_S3_BUCKET_NAME,
            Prefix: sourcePrefix,
            ContinuationToken: continuationToken
        };

        console.log("📤 Sending request to list objects...");
        const command = new ListObjectsV2Command(listParams);
        const data = await s3.send(command);
        

        if (!data.Contents || data.Contents.length === 0) {
            console.log("⚠️ No files found in source folder.");
            return;
        }

        for (const file of data.Contents){
            if (!file.Key) continue;
            const fileName = file.Key.replace(sourcePrefix, "");
            if (!fileName) continue;
            const destination = `${destinationPrefix.replace(/\/$/, '')}/${fileName.replace(/^\//, '')}`;
            const copyParams = {
                Bucket: AWS_S3_BUCKET_NAME,
                CopySource: `${AWS_S3_BUCKET_NAME}/${file.Key}`,
                Key: destination,
            };
            const copyCommand = new CopyObjectCommand(copyParams);
            await s3.send(copyCommand);

        }
        
        

        return data;
    } catch (error) {
        console.error("❌ Error in copyFolder:", error);
        return error;
    }
};
