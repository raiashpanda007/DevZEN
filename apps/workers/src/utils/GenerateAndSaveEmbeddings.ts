import { Document } from "langchain/document"
import GeminiEmbeddings from "./GeminiEmbeddings"
import {QDRANT_URL} from "../config"
import { QdrantVectorStore } from '@langchain/qdrant';
const GenerateAndSaveEmbeddings = async (docs: Document[]) => {
    try {
        await QdrantVectorStore.fromDocuments(docs, GeminiEmbeddings, {
            url: QDRANT_URL,
            collectionName: "ASHNA-VECTOR-EMBEDDINGS",
        });
        console.log("✅ Embeddings saved into QdrantDB");
    } catch (error) {
        console.error("❌ Error saving embeddings:", error);
        throw error;
    }
}
export default GenerateAndSaveEmbeddings