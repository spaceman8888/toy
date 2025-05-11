"use client"

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";


export default function Page(){
    const [text,setText] = useState("");
    const [result,setResult] = useState<BaseMessage>();
    const [threadId,setThreadId] = useState<string>("");
    const [messages,setMessages] = useState<BaseMessage[]>([]);

    useEffect(()=>{
        const newId = uuidv4();
        console.log(newId);
        setThreadId(newId);
    },[])

    const handleSubmit = async () => {
        const newMessage = new HumanMessage(text);

        const res = await fetch("/api/langgraph",{
            method:"POST",
            body:JSON.stringify({messages:[...messages,newMessage],
                threadId}),
            headers:{
                "Content-Type":"application/json"
            }
        })
        const data = await res.json();
        console.log(data.result.messages)
        const aiReply = data.result.messages.at(-1);
        setMessages([...messages,newMessage,aiReply]);
        setText("");
        setResult(aiReply);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">이전 대화를 기억하는 Chatbot</h1>
            <div>
                <h2 className="text-xl font-bold">💡 LangGraph란?</h2>
                <p>상태기반(stateful) LLM 파이프라인을 만드는 프레임워크</p>
            </div>
            <div>
                <h2 className="text-xl font-bold">💡 방식</h2>
                <p>callModel : 모델을 호출하는 함수</p>
                <p>StateGraph : 상태와 흐름을 정의하는 그래프</p>
                <p>MemorySaver : 상태를 저장하고 복원하는 체크포인터</p>
            </div>
            <div className="mt-8 border-2 border-gray-300 rounded-md p-4">
                <h1 className="text-xl font-bold">실습 결과</h1>

                <div>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} />
            <Button onClick={handleSubmit}>Submit</Button>
            <div>
                <p>{JSON.stringify(result)}</p>
            </div>
        </div>
                
            </div>
        </div>
    )
}