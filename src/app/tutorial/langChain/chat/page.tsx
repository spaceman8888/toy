"use client"

/**
 * @description 영어를 한국어로 번역하는 기능으로 간단한 LLM 앱 구현
 */

import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import { useEffect, useState } from "react";
import { ChatPromptValueInterface } from "@langchain/core/prompt_values";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// 모델 생성
const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    openAIApiKey: process.env["NEXT_PUBLIC_OPENAI_API_KEY"],
});

// const client = wrapOpenAI(new OpenAI());

export default function Page(){
    const [answer,setAnswer] = useState("");
    const [answerStream,setAnswerStream] = useState("");
    const [english,setEnglish] = useState("");
    const [language,setLanguage] = useState("한국어");
    // const messages = [
    //     new SystemMessage("영어를 한국어로 번역해줘."),
    //     new HumanMessage("Hello, world! Nice to meet you. My name is Bo."),
    // ]


    useEffect(()=>{
        // invoke();
        // stream();
        // promptTemplate();
    },[])

    // 한번에 가져오는 방식
    const invoke = async (messages:ChatPromptValueInterface) =>{
        const res = await model.invoke(messages);
        console.log(res);
        setAnswer(res.content.toString());
        return res;
    }

    // 스트리밍 방식
    const stream = async (messages:ChatPromptValueInterface) =>{
        const stream = await model.stream(messages);
        const chunks = [];
        for await(const chunk of stream){
            chunks.push(chunk.content);
            setAnswerStream(chunks.join(""));
        }
    }

    // 프롬프트 템플릿 방식
    const promptTemplate = async () =>{
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "영어를 {language}로 번역해줘."],
            ["user", "{text}"],
        ]);

        const promptValue = await prompt.invoke({
            language: language,
            text: english,
        });
        console.log(promptValue);
        await invoke(promptValue);
        await stream(promptValue);
        // setAnswer(promptValue.toString());
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold">Build a simple LLM application with chat models and prompt templates</h1>
                <p>💡 invoke 방식은 한번에 가져오는 방식이고, stream 방식은 스트리밍 방식입니다.</p>
                <p>💡 system prompt는 모델의 행동을 정의하는 프롬프트</p>
                <p>💡 prompt를 template화 하여 프롬프트의 구조를 변수로 템플릿화 함</p>

            </div>
            <div className="mt-8 border-2 border-gray-300 rounded-md p-4">
                <h1 className="text-xl font-bold">실습 결과</h1>
                <Textarea
                    placeholder="Enter your text"
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                />
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="한국어">한국어</option>
                    <option value="일본어">일본어</option>
                </select>
                <Button onClick={() => promptTemplate()}>번역하기</Button>

                <div className="flex mt-6">
                    <div>
                        <h1 className="text-lg font-bold">invoke 방식</h1>
                        <div>{answer}</div>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">stream 방식</h1>
                        <div>{answerStream}</div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}