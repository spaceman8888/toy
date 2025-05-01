import { TextChunk } from "@/features/upload/utils/splitText";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings();

// 문서를 벡터로 변환
export async function embedDocuments(docs: Document[]){
    const vectors = await embeddings.embedDocuments(
        docs.map((doc) => doc.pageContent)
    )
    return vectors;
}

// 문서를 Document 형태로 변환
export function toDocuments(chunks:TextChunk[]): Document[]{
    return chunks.map((chunk) => {
        return new Document({
            pageContent : chunk.text,
            metadata : {id:chunk.id}
        })
    })
}