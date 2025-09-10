import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Response from "@/lib/Utils/Response";
import { z as zod } from "zod";
import { NextRequest, NextResponse } from "next/server";


const accessKey = process.env.AWS_S3_ACCESS_KEY ?? "";
const secretKey = process.env.AWS_S3_SECRET_KEY ?? "";
const region = process.env.AWS_S3_REGION ?? "";
const bucket = process.env.AWS_S3_BUCKET_NAME ?? "";

const s3Client = new S3Client({
    region: region || "us-east-1",
    credentials: {
        accessKeyId: accessKey || "",
        secretAccessKey: secretKey || ""
    },
})


const DownloadProjectSchema = zod.object({
    projectId: zod.string()
})


const GenerateSignedURLs = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const parsedBody = DownloadProjectSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json(new Response(401, "Please provide project id", parsedBody.error), { status: 401 })
        }

        const { projectId } = parsedBody.data
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: `code/${projectId}/${projectId}.zip`
        })
        // temp fix 
        const url = await getSignedUrl(s3Client as any, command as any);
        console.log("Signed URL for the file is this :: ", url);

        return NextResponse.json(new Response(201, `YourSinged URL to donwload project of ID:: ${projectId}`, url), { status: 201 });
    } catch (error) {
        console.error("Error in generating url", error);
        return NextResponse.json(new Response(500, `Unable to generate URL`, { error }))
    }

}

export default GenerateSignedURLs