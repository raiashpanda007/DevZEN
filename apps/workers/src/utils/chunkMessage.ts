import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";


interface ChunkMessagesProps {
    message: string
    chatId: string;
    messageId: string;
}

const ChunkMessages = async ({ message, messageId, chatId }: ChunkMessagesProps) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 25
    })
    const allChunks: Document[] = [];
    const messageChunks = await splitter.createDocuments([message])
    messageChunks.forEach((chunk, index) => (
        allChunks.push(new Document({
            pageContent: chunk.pageContent,
            metadata: {
                chatId: String(chatId),
                messageId: String(messageId),
                source: "message",
                chunkIndex: index,
            }
        }))
    ));
    return allChunks
}

export default ChunkMessages