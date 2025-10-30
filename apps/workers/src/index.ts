 import { Worker } from "bullmq";
import { HOST, PORT } from "./config";
import { z as zod } from "zod"
import { ensureQdrantCollection } from "./db";
import ChunkMessages from "./utils/chunkMessage";
import GenerateAndSaveEmbeddings from "./utils/GenerateAndSaveEmbeddings";
import GeminiEmbeddings from "./utils/GeminiEmbeddings";
import GetContextFromEmbeddings from "./utils/GenerateContext";
import axios from "axios"

const JobSchema = zod.object({
    message: zod.string()
});
(async () => {
    await ensureQdrantCollection();
    console.log("Qdrant is ready.");
})();
const worker = new Worker('llm-embedding-generation-queue', async (job) => {
    console.log("Processing job with name :: ", job.name, "id::", job.id, "with data :: \n", job.data);

    const parsedData = JobSchema.safeParse(job.data)
    if (!parsedData.success) {
        throw Error("Invalid Data");
    }

    const { message } = parsedData.data;
    const ids = job.name.split('/');
    const chatId = ids[1];
    const messageId = ids[2];
    if (!chatId || !messageId) {
        // console.error("Worker didn't recieved messageId or chatID")
        throw Error("Worker didn't recieved messageId or chatID");
    }
    const qVector = await GeminiEmbeddings.embedQuery(message);
    console.log("Embeddings :: ", qVector);
    const context = await GetContextFromEmbeddings(message, chatId, qVector);
    const chunks = await ChunkMessages({ message, messageId, chatId });
    await GenerateAndSaveEmbeddings(chunks);

    return { context, message, messageId, chatId };

}, {
    concurrency: 5,
    connection: {
        host: HOST,
        port: parseInt(PORT ?? "6379")
    }
})

worker.on("completed", async (job) => {
    console.log(`✅ Job completed: ${job.id}`);
    console.log("Context is here :: ", job.returnvalue);


});

worker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job?.id}`, err);
});

worker.on("error", (err) => {
    console.error("Worker connection error:", err);
});