import {MemoryVectorStore} from "langchain/vectorstores/memory";
import {Document} from "langchain/document"
import {OpenAIEmbeddings} from "@langchain/openai"

const embeddings = new OpenAIEmbeddings({
    model : "text-embedding-3-small",
    apiKey : process.env.OPENAI_API_KEY,
});

// 메모리 벡터 저장소 생성
export async function createMemoryStore(docs:Document[]){
    const store = await MemoryVectorStore.fromDocuments(
        docs,
        embeddings
    );
    return store;
}