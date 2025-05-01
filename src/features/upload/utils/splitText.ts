export interface TextChunk {
    id : string;
    text:string;
}

export function splitTextIntoChunks(
    fullText:string,
    chunkSize:number = 1000,
    chunkOverlap:number = 100
):TextChunk[] {
    const cleaned = fullText.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ").trim();
    const chunks:TextChunk[] = [];
    let start = 0;
    let id = 1;

    while(start < cleaned.length){
        const end = Math.min(start + chunkSize, cleaned.length);
        const chunk = cleaned.slice(start, end);
        chunks.push({id: `chunk-${id++}`, text: chunk});
        start += chunkSize - chunkOverlap;
    }
    return chunks;
}