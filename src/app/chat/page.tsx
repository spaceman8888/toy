"use client"

import { useEffect, useState} from "react"
import { askAboutDocument } from "@/lib/langchain/askDocument";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {useDebounce} from "use-debounce"

const dummyText = `
React는 JavaScript 라이브러리로서 사용자 인터페이스를 만들기 위해 사용됩니다.
컴포넌트 기반 구조를 가지고 있으며 상태 관리와 렌더링 최적화에 강점을 가집니다.
또한 가상 DOM을 활용하여 성능을 향상시킵니다.
`;

export default function ChatPage() {
  const [question,setQuestion] = useState("");
  const [debouncedQuestion] = useDebounce(question, 500);
  // const [answer,setAnswer] = useState("");
  const [loading,setLoading] = useState(false);
  const [history,setHistory] = useState<{question:string,answer:string}[]>([]);
  
  const handleAsk = async () =>{
    if(!question.trim()) return;

    setLoading(true);
    const response = await askAboutDocument(dummyText,question);
    // setAnswer(response);
    setHistory((prev)=>[...prev,{question,answer:response}]);
    setQuestion("");
    setLoading(false);
  }

  useEffect(()=>{
    if(!debouncedQuestion.trim()) return;
  },[debouncedQuestion]);

  return <div className="p-6 space-y-4 max-w-3xl mx-auto">
    <h1 className="text-xl font-bold">문서 기반 GPT 챗봇</h1>
    <div className="space-y-2">
      <Textarea
        rows={3}
        placeholder="질문을 입력하세요"
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
      />
      <Button onClick={handleAsk} disabled={loading}>
        {loading ? "답변중..." : "질문하기"}
      </Button>
    </div>
    <div className="space-y-4">
      {history.map((item,i)=>(
        <div key={i} className="border rounded p-4 bg-muted">
          <p className="font-semibold">Q. {item.question}</p>
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{item.answer}</p>
        </div>
      ))}
    </div>
  </div>;
}
