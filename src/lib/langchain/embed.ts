import { TextChunk } from "@/features/upload/utils/splitText";
import { Document } from "langchain/document";


export function toDocuments(chunks:TextChunk[]): Document[]{
    return chunks.map((chunk) => {
        return new Document({
            pageContent : chunk.text,
            metadata : {id:chunk.id}
        })
    })
}