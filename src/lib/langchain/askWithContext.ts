import {ChatOpenAI} from "@langchain/openai";
import {questionPrompt} from "./prompt";

export async function askWithContext(
    context:string, 
    question:string, 
){
    const chat = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY,
        streaming: true,
     
    });

    const prompt = await questionPrompt.format({context,question});
    const res = await chat.invoke(prompt);
    return res.content;
}

