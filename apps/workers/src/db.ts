import { QDRANT_URL } from "./config";
import { QdrantClient } from "@qdrant/js-client-rest";


const qdrant = new QdrantClient({ url: QDRANT_URL });
export async function ensureQdrantCollection() {
    try {

        const collections = await qdrant.getCollections();
        const exists = collections.collections.some(
            (c) => c.name === "ASHNA-VECTOR-EMBEDDINGS"
        );

        if (!exists) {
            console.log("Creating Qdrant collection...");
            await qdrant.createCollection("ASHNA-VECTOR-EMBEDDINGS", {
                vectors: { size: 3072, distance: "Cosine" },
            });
            console.log("✅ Collection created.");
        } else {
            console.log("✅ Qdrant collection already exists.");
        }
    } catch (err) {
        console.error("❌ Error ensuring Qdrant collection:", err);
    }
}