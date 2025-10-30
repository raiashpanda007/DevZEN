import { QdrantVectorStore } from '@langchain/qdrant';
import GeminiEmbeddings from './Embeddings';
import { QDRANT_URL } from "../config";
const GenerateContext = async (chatID:string,queryVector: number[]) => {
    const vectorStore = new QdrantVectorStore(GeminiEmbeddings,{
        url:QDRANT_URL,
        collectionName:"ASHNA-VECTOR-EMBEDDINGS"
    });
    const qVec = queryVector ;
    const results = await vectorStore.similaritySearchVectorWithScore(
        qVec,
        5,
        { must: [{ key: "metadata.chatId", match: { value: chatID } }] }
    );
    try {
        console.debug(`Found ${results.length} chat-scoped embedding results for chatId=${chatID}`);
        results.forEach((r, idx) => {
            const doc = r[0];
            const score = r[1];
            console.debug(`result[${idx}] score=${score} preview=${String(doc?.pageContent).slice(0, 120).replace(/\n/g, ' ')} metadata=${JSON.stringify(doc?.metadata)}`);
        });
    } catch (e) {
        console.debug('Error while logging results preview', e);
    }
    let finalResults = results;
    if (!results || results.length === 0) {
        console.warn(`No chat-scoped embeddings found for chatId=${chatID}. Running fallback global search.`);
        const fallback = await vectorStore.similaritySearchVectorWithScore(qVec, 5);
        console.debug(`Fallback returned ${fallback.length} results`);
        finalResults = fallback;
    }

    return finalResults.map((r) => r[0].pageContent).join("\n---\n");

}

export default GenerateContext