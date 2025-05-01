"use client"

import {useEffect, useState} from "react"
import {splitTextIntoChunks} from "@/features/upload/utils/splitText"
import {toDocuments} from "@/lib/langchain/embed"
import { createMemoryStore } from "@/lib/langchain/store";


const dummyText = `
React는 JavaScript 라이브러리로서 사용자 인터페이스를 만들기 위해 사용됩니다.
컴포넌트 기반 구조를 가지고 있으며 상태 관리와 렌더링 최적화에 강점을 가집니다.
또한 가상 DOM을 활용하여 성능을 향상시킵니다.
`;

export default function ChatPage() {
  const [results, setResults] = useState<string[]>([]);

  useEffect(()=>{
    async function runTest(){
      const chunks = splitTextIntoChunks(dummyText);
      const docs = toDocuments(chunks);
      const store = await createMemoryStore(docs);

      const query = "React에서 상태를 어떻게 관리하나요?";
      const found = await store.similaritySearch(query,2);

      setResults(found.map((doc)=>doc.pageContent));
    }
    runTest();
  },[]);
  
  return <div className="p-6 space-y-4 max-w-3xl mx-auto">
    <h1 className="text-xl font-bold">유사 문서 검색 테스트</h1>
    <ul className="list-disc pl-5 space-y-2">
      {results.map((text,i)=>(
        <li key={i} className="bg-muted p-2 rounded">{text}</li>
      ))}
    </ul>
  </div>;
}
