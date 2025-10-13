import { EMBEDDING_CLIENT } from "./EmbeddingClient";
const GeminiEmbeddings = {
    embedDocuments: async (texts: string[]): Promise<number[][]> => {
        const response = await EMBEDDING_CLIENT.models.embedContent({
            model: 'gemini-embedding-001',
            contents: [...texts],
        });
        if (!response || !response.embeddings) {
            throw new Error("No embeddings returned");
        }
        return response.embeddings
            .map((embedding) => embedding.values)
            .filter((values): values is number[] => Array.isArray(values));
    },
    embedQuery: async (text: string): Promise<number[]> => {
        const response = await EMBEDDING_CLIENT.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
        });
        if (!response || !response.embeddings || !response.embeddings[0]?.values) {
            throw new Error("No embedding returned");
        }
        return response.embeddings[0].values;
    }
}
export default GeminiEmbeddings