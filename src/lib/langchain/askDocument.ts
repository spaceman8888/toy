"use client"

import {splitTextIntoChunks} from "@/features/upload/utils/splitText";
import {toDocuments} from "./embed";
import {createMemoryStore} from "./store";
import {askWithContext} from "./askWithContext";

export async function askAboutDocument(text:string, question:string){
    // const [streamingAnswer,setStreamingAnswer] = useState("");

    // 1. chunk => Document
    const chunks = splitTextIntoChunks(text);
    const docs = toDocuments(chunks);

    // 2. Document[] => VectorStore 생성
    const store = await createMemoryStore(docs);

    // 3. 질문과 유사한 문장 3개 검색
    const similarDocs = await store.similaritySearch(question,3);
    const context = similarDocs.map((doc) => doc.pageContent).join("\n");

    // 4. 질문 + context => GPT 호출
    const answer = await askWithContext(context,question);
    return answer.toString();
    
}