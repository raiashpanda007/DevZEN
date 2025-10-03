import { Queue } from "bullmq";

const queue = new Queue('llm-queue', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

export default queue;