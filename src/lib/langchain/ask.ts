import {ChatOpenAI} from "@langchain/openai";
import {questionPrompt} from "./prompt";

const chat = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function askWithContext(context:string, question:string){
    const prompt = await questionPrompt.format({context,question});
    const res = await chat.invoke(prompt);
    return res.content;
}

