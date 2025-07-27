import dotenv from "dotenv";
dotenv.config();
import {
    ListObjectsV2Command,
    DeleteObjectsCommand,
    ListObjectsV2CommandInput,
    ListObjectsV2CommandOutput,
    DeleteObjectsCommandInput,
    S3Client,
    CopyObjectCommand
} from "@aws-sdk/client-s3";

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

export const copyFolder = async (
    sourcePrefix: string,
    destinationPrefix: string,
    continuationToken?: string
) => {
    if (!AWS_S3_BUCKET_NAME) {
        console.error("❌ AWS_S3_BUCKET_NAME is missing! Check your environment variables.");
        throw new Error("AWS_S3_BUCKET_NAME is missing from environment variables.");
    }

    try {
        const listParams = {
            Bucket: AWS_S3_BUCKET_NAME,
            Prefix: sourcePrefix.endsWith("/") ? sourcePrefix : `${sourcePrefix}/`,
            ContinuationToken: continuationToken
        };

        console.log("📤 Sending request to list objects...");
        const command = new ListObjectsV2Command(listParams);
        const data = await s3.send(command);

        if (!data.Contents || data.Contents.length === 0) {
            console.log("⚠️ No files found in source folder.");
            return;
        }

        for (const file of data.Contents) {
            if (!file.Key) continue;


            if (!file.Key.startsWith(listParams.Prefix)) continue;

            const fileName = file.Key.slice(listParams.Prefix.length);
            if (!fileName) continue;

            const destination = `${destinationPrefix.replace(/\/$/, "")}/${fileName.replace(/^\//, "")}`;
            const copyParams = {
                Bucket: AWS_S3_BUCKET_NAME,
                CopySource: `${AWS_S3_BUCKET_NAME}/${file.Key}`,
                Key: destination,
            };

            console.log(`📂 Copying: ${file.Key} → ${destination}`);
            const copyCommand = new CopyObjectCommand(copyParams);
            await s3.send(copyCommand);
        }

        return data;
    } catch (error) {
        console.error("❌ Error in copyFolder:", error);
        return error;
    }
};

export const deleteFolder = async (folderName: string): Promise<void> => {
    if (!AWS_S3_BUCKET_NAME) {
        throw new Error("❌ AWS_S3_BUCKET_NAME is missing from environment variables.");
    }

    try {
        const prefix = folderName.endsWith("/") ? `code/${folderName}` : `code/${folderName}/`;
        let continuationToken: string | undefined = undefined;

        while (true) {
            const listParams: ListObjectsV2CommandInput = {
                Bucket: AWS_S3_BUCKET_NAME,
                Prefix: prefix,
                ContinuationToken: continuationToken,
            };

            const listCommand = new ListObjectsV2Command(listParams);
            const listResponse: ListObjectsV2CommandOutput = await s3.send(listCommand);

            const contents = listResponse.Contents;

            if (!contents || contents.length === 0) {
                console.log(`✅ No more objects to delete under '${prefix}'`);
                break;
            }

            const deleteParams: DeleteObjectsCommandInput = {
                Bucket: AWS_S3_BUCKET_NAME,
                Delete: {
                    Objects: contents.map(obj => ({ Key: obj.Key! })),
                    Quiet: false,
                },
            };

            const deleteCommand = new DeleteObjectsCommand(deleteParams);
            const deleteResponse = await s3.send(deleteCommand);

            console.log(`🗑️ Deleted ${deleteResponse.Deleted?.length || 0} objects from '${prefix}'`);

            if (!listResponse.IsTruncated || !listResponse.NextContinuationToken) {
                break;
            }

            continuationToken = listResponse.NextContinuationToken;
            console.log(`✅ Finished deleting all objects under '${prefix}'`);
        }
    } catch (error) {
        console.log("Error in deleting the project ", error);

    }


};