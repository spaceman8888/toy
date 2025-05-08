"use client"

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  temperature: 0
});

const taggingPrompt = ChatPromptTemplate.fromTemplate(
    `Extract the desired information from the following passage.

    Only extract the properties mentioned in the 'Classification' function.

    Passage:
    {input}
`
)

const classificationSchema = z.object({
    sentiment: z.string().describe("The sentiment of the text"),
    agressiveness:z.number().int().describe("How aggressive the text is on a scale from 1 to 10"),
    language: z.string().describe("The language of the text")
});

const llmWithStructuredOutput = llm.withStructuredOutput(classificationSchema,{
    name: "extractor"
});


export default function Page() {

    const [text, setText] = useState("");
    const [result, setResult] = useState<z.infer<typeof classificationSchema>>();

    // 1. 텍스트 분류
    const classifyText = async () => {
        const prompt = await taggingPrompt.invoke({input:text});

        const result = await llmWithStructuredOutput.invoke(prompt);

        setResult(result);
    }

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold">Classify Text into Labels</h1>
            <div className="w-full mt-8 border-2 border-gray-300 rounded-md p-4">
                <h1 className="text-xl font-bold">실습 결과</h1>
                {/* <PdfUploader/> */}
                <Textarea value={text} onChange={(e) => setText(e.target.value)} />   
                <Button onClick={classifyText}>분류</Button>    
                <div>
                    <p>감정: {result?.sentiment}</p>
                    <p>공격성: {result?.agressiveness}</p>
                    <p>언어: {result?.language}</p>
                </div>
            </div>
        </div>
    )
}