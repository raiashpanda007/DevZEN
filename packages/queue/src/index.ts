import { Queue } from "bullmq";
import dotenv from "dotenv"
dotenv.config()
const host = process.env.QUEUE_HOST;
const port = process.env.QUEUE_PORT;
if(!port || !host) {
    throw new Error("host and port not provided for queue system")
}
const queue = new Queue('llm-embedding-generation-queue', {
    connection: {
        host: host,
        port: parseInt(port),
    },
});

export default queue;