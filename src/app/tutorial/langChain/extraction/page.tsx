"use client"

import {z} from "zod"
import {ChatPromptTemplate} from "@langchain/core/prompts"
import {ChatOpenAI} from "@langchain/openai"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const personSchema = z.object({
    name:z.optional(z.string()).describe("The name of the person"),
    hair_color:z.optional(z.string()).describe("The color of the person's hair if known"),
    height_in_meters:z.optional(z.string()).describe("Height measured in meters"),
})

const dataSchema = z.object({
    people: z.array(personSchema).describe("Extracted data about people.")
})

const promptTemplate = ChatPromptTemplate.fromMessages([[
    "system",
    `You are an expert extraction algorithm.
    Only extract relevant information from the text.
    If you do not know the value of an attribute asked to extract,
    return null for the attribute's value.`],
    ["human","{text}"],
])

const llm = new ChatOpenAI({
    modelName:"gpt-4o-mini",
    temperature:0, // 출력 문장의 랜덤성 조절
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})



export default function Page(){
    const [text, setText] = useState("")
    const [text2, setText2] = useState("")
    const [result, setResult] = useState<z.infer<typeof personSchema>>()
    const [result2, setResult2] = useState<z.infer<typeof dataSchema>>()

    const handleSubmit = async () => {
        const structured_llm = llm.withStructuredOutput(personSchema)
        const prompt = await promptTemplate.invoke({text})
        const result = await structured_llm.invoke(prompt)
        setResult(result)
    }

    const handleSubmit2 = async () => {
        const structured_llm = llm.withStructuredOutput(dataSchema)
        const prompt = await promptTemplate.invoke({text:text2})
        const result = await structured_llm.invoke(prompt)
        setResult2(result)
    }

    return (
        <div>
            <h1>Extraction</h1>
            <div className="mt-8 border-2 border-gray-300 rounded-md p-4">
                <h1 className="text-2xl font-bold">실습 결과</h1>
                <div className="mt-4 border-2 border-gray-300 rounded-md p-4">
                    <h2 className="text-xl font-bold">Case 1</h2>
                    {/* <PdfUploader/> */}
                    <Textarea
                        placeholder="Enter text here"
                        className="w-full"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Button onClick={handleSubmit}>Submit</Button>
                    <div className="mt-4 border-2 border-gray-300 rounded-md p-4">
                        <p>Name: {result?.name}</p>
                        <p>Hair Color: {result?.hair_color}</p>
                        <p>Height in Meters: {result?.height_in_meters}</p>
                    </div>
                </div>
                <div className="mt-4 border-2 border-gray-300 rounded-md p-4">
                <h2 className="text-xl font-bold">Case 2</h2>
                {/* <PdfUploader/> */}
                <Textarea
                    placeholder="Enter text here"
                    className="w-full"
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                />
                <Button onClick={handleSubmit2}>Submit</Button>
                {result2?.people.map(person => (
                    <div key={person.name} className="mt-4 border-2 border-gray-300 rounded-md p-4">
                        <p>Name: {person.name}</p>
                        <p>Hair Color: {person.hair_color}</p>
                        <p>Height in Meters: {person.height_in_meters}</p>
                    </div>
                ))}
            </div>
            </div>
            
        </div>
    )
}